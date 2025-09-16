"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Download,
  Search,
  UserCheck,
  UserX,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Participant {
  _id: string;
  userId: string; // This should be the actual user ID
  name: string;
  email: string;
}

interface AttendanceRecord {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  entryTime?: string;
  exitTime?: string;
  status: "PRESENT" | "ABSENT" | "PARTIAL";
}

interface Event {
  _id: string;
  name: string;
  eventType: "SOLO" | "GROUP";
  minMember?: number;
  maxMember?: number;
}

interface Group {
  groupId: string;
  leader: Participant;
  members: Participant[];
}

export default function EventAttendancePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[] | Group[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (eventId) {
      fetchEventData();
      fetchParticipants();
      fetchAttendance();
    }
  }, [eventId]);

  const fetchEventData = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      const currentEvent = data.events.find((e: Event) => e._id === eventId);
      setEvent(currentEvent);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch event data",
        variant: "destructive",
      });
    }
  };

  const fetchParticipants = async () => {
    try {
      const res = await fetch(`/api/event/${eventId}/participants`);
      const data = await res.json();
      console.log("Fetched participants:", data.participants); // Debug log
      setParticipants(data.participants || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch participants",
        variant: "destructive",
      });
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await fetch(`/api/attendance?eventId=${eventId}`);
      const data = await res.json();
      console.log("Fetched attendance:", data.attendance); // Debug log
      setAttendance(data.attendance || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch attendance",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (userId: string, action: "entry" | "exit") => {
    try {
      console.log("Marking attendance:", { userId, eventId, action }); // Debug log

      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, eventId, action }),
      });

      const data = await res.json();
      console.log("Attendance response:", data); // Debug log

      if (data.success) {
        toast({
          title: "Success",
          description: `${
            action === "entry" ? "Entry" : "Exit"
          } recorded successfully`,
        });
        fetchAttendance();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to record attendance",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast({
        title: "Error",
        description: "Failed to record attendance",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (
    userId: string,
    newStatus: "PRESENT" | "ABSENT" | "PARTIAL"
  ) => {
    try {
      const res = await fetch("/api/attendance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, eventId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: "Success",
          description: `Status updated to ${newStatus}`,
        });
        fetchAttendance();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update status",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  // Helper function to get the correct user ID from participant
  const getUserId = (participant: Participant): string => {
    // If participant has userId field, use it; otherwise use _id
    return participant.userId || participant._id;
  };

  const getAttendanceStatus = (userId: string) =>
    attendance.find(
      (record) =>
        record.userId._id === userId ||
        record.userId._id === getUserId({ _id: userId } as Participant)
    );

  const filteredParticipants =
    event?.eventType === "SOLO"
      ? (participants as Participant[]).filter(
          (p) =>
            (p.name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
            (p.email?.toLowerCase() ?? "").includes(searchTerm.toLowerCase())
        )
      : (participants as Group[]).filter((group) => {
          const leaderMatch =
            (group.leader.name?.toLowerCase() ?? "").includes(
              searchTerm.toLowerCase()
            ) ||
            (group.leader.email?.toLowerCase() ?? "").includes(
              searchTerm.toLowerCase()
            );
          const memberMatch = group.members.some(
            (m) =>
              (m.name?.toLowerCase() ?? "").includes(
                searchTerm.toLowerCase()
              ) ||
              (m.email?.toLowerCase() ?? "").includes(searchTerm.toLowerCase())
          );
          return leaderMatch || memberMatch;
        });

  const exportToCSV = () => {
    let rows: string[][] = [
      ["Name", "Email", "Entry Time", "Exit Time", "Status"],
    ];

    if (event?.eventType === "SOLO") {
      (participants as Participant[]).forEach((p) => {
        const userId = getUserId(p);
        const record = getAttendanceStatus(userId);
        rows.push([
          p.name,
          p.email,
          record?.entryTime
            ? new Date(record.entryTime).toLocaleString()
            : "Not marked",
          record?.exitTime
            ? new Date(record.exitTime).toLocaleString()
            : "Not marked",
          record?.status || "ABSENT",
        ]);
      });
    } else {
      (participants as Group[]).forEach((group) => {
        // Leader
        const leaderUserId = getUserId(group.leader);
        const leaderRecord = getAttendanceStatus(leaderUserId);
        rows.push([
          group.leader.name + " (Leader)",
          group.leader.email,
          leaderRecord?.entryTime
            ? new Date(leaderRecord.entryTime).toLocaleString()
            : "Not marked",
          leaderRecord?.exitTime
            ? new Date(leaderRecord.exitTime).toLocaleString()
            : "Not marked",
          leaderRecord?.status || "ABSENT",
        ]);
        // Members
        group.members.forEach((member) => {
          const memberUserId = getUserId(member);
          const memberRecord = getAttendanceStatus(memberUserId);
          rows.push([
            member.name,
            member.email,
            memberRecord?.entryTime
              ? new Date(memberRecord.entryTime).toLocaleString()
              : "Not marked",
            memberRecord?.exitTime
              ? new Date(memberRecord.exitTime).toLocaleString()
              : "Not marked",
            memberRecord?.status || "ABSENT",
          ]);
        });
      });
    }

    const csvContent = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event?.name || "event"}_attendance.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleToggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">
            Loading attendance data...
          </p>
        </div>
      </div>
    );
  }

  // Calculate stats based on actual participant count
  const totalParticipantCount =
    event?.eventType === "SOLO"
      ? (participants as Participant[]).length
      : (participants as Group[]).reduce(
          (acc, group) => acc + 1 + group.members.length,
          0
        );

  const presentCount = attendance.filter((r) => r.status === "PRESENT").length;
  const absentCount = totalParticipantCount - presentCount;
  const attendanceRate =
    totalParticipantCount > 0
      ? Math.round((presentCount / totalParticipantCount) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 capitalize">
              {event?.name} - Attendance
            </h1>
            <p className="text-gray-600">
              {event?.eventType} Event • {totalParticipantCount} Participants
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">
                Total Participants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalParticipantCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Present</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {presentCount}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Absent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {absentCount}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">
                Attendance Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {attendanceRate}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Participants Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-2 w-full sm:flex-row sm:justify-between sm:items-center">
              <CardTitle>Participant Attendance</CardTitle>
              <div className="flex flex-col gap-2 w-full sm:flex-row sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search participants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
                <Button
                  onClick={exportToCSV}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Entry Time</TableHead>
                    <TableHead>Exit Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {event?.eventType === "SOLO"
                    ? (filteredParticipants as Participant[]).map((p) => {
                        const userId = getUserId(p);
                        const record = getAttendanceStatus(userId);
                        return (
                          <TableRow key={p._id}>
                            <TableCell>{p.name}</TableCell>
                            <TableCell>{p.email}</TableCell>
                            <TableCell>
                              {record?.entryTime
                                ? new Date(record.entryTime).toLocaleString()
                                : "Not marked"}
                            </TableCell>
                            <TableCell>
                              {record?.exitTime
                                ? new Date(record.exitTime).toLocaleString()
                                : "Not marked"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  record?.status === "PRESENT"
                                    ? "default"
                                    : record?.status === "PARTIAL"
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                {record?.status || "ABSENT"}
                              </Badge>
                            </TableCell>
                            <TableCell className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => markAttendance(userId, "entry")}
                                disabled={!!record?.entryTime}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <UserCheck className="h-4 w-4 mr-1" />
                                Entry
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAttendance(userId, "exit")}
                                disabled={
                                  !record?.entryTime || !!record?.exitTime
                                }
                              >
                                <UserX className="h-4 w-4 mr-1" />
                                Exit
                              </Button>
                            </TableCell>
                            <TableCell>
                              <select
                                value={record?.status || "ABSENT"}
                                onChange={(e) =>
                                  handleStatusChange(
                                    userId,
                                    e.target.value as any
                                  )
                                }
                                className="border rounded px-2 py-1"
                              >
                                <option value="PRESENT">Present</option>
                                <option value="ABSENT">Absent</option>
                                <option value="PARTIAL">Partial</option>
                              </select>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    : (filteredParticipants as Group[]).map((group) => {
                        const leaderUserId = getUserId(group.leader);
                        const leaderRecord = getAttendanceStatus(leaderUserId);
                        return (
                          <React.Fragment key={group.groupId}>
                            <TableRow>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleToggleGroup(group.groupId)
                                  }
                                  className="mr-2"
                                >
                                  {openGroups[group.groupId] ? "▼" : "▶"}
                                </Button>
                                {group.leader.name} (Leader)
                              </TableCell>
                              <TableCell>{group.leader.email}</TableCell>
                              <TableCell>
                                {leaderRecord?.entryTime
                                  ? new Date(
                                      leaderRecord.entryTime
                                    ).toLocaleString()
                                  : "Not marked"}
                              </TableCell>
                              <TableCell>
                                {leaderRecord?.exitTime
                                  ? new Date(
                                      leaderRecord.exitTime
                                    ).toLocaleString()
                                  : "Not marked"}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    leaderRecord?.status === "PRESENT"
                                      ? "default"
                                      : leaderRecord?.status === "PARTIAL"
                                      ? "secondary"
                                      : "destructive"
                                  }
                                >
                                  {leaderRecord?.status || "ABSENT"}
                                </Badge>
                              </TableCell>
                              <TableCell className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    markAttendance(leaderUserId, "entry")
                                  }
                                  disabled={!!leaderRecord?.entryTime}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  Entry
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    markAttendance(leaderUserId, "exit")
                                  }
                                  disabled={
                                    !leaderRecord?.entryTime ||
                                    !!leaderRecord?.exitTime
                                  }
                                >
                                  <UserX className="h-4 w-4 mr-1" />
                                  Exit
                                </Button>
                              </TableCell>
                              <TableCell>
                                <select
                                  value={leaderRecord?.status || "ABSENT"}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      leaderUserId,
                                      e.target.value as any
                                    )
                                  }
                                  className="border rounded px-2 py-1"
                                >
                                  <option value="PRESENT">Present</option>
                                  <option value="ABSENT">Absent</option>
                                  <option value="PARTIAL">Partial</option>
                                </select>
                              </TableCell>
                            </TableRow>
                            {openGroups[group.groupId] &&
                              group.members.length > 0 && (
                                <>
                                  {group.members.map((member) => {
                                    const memberUserId = getUserId(member);
                                    const memberRecord =
                                      getAttendanceStatus(memberUserId);
                                    return (
                                      <TableRow
                                        key={member._id}
                                        className="bg-gray-50"
                                      >
                                        <TableCell className="pl-12">
                                          {member.name}
                                        </TableCell>
                                        <TableCell>{member.email}</TableCell>
                                        <TableCell>
                                          {memberRecord?.entryTime
                                            ? new Date(
                                                memberRecord.entryTime
                                              ).toLocaleString()
                                            : "Not marked"}
                                        </TableCell>
                                        <TableCell>
                                          {memberRecord?.exitTime
                                            ? new Date(
                                                memberRecord.exitTime
                                              ).toLocaleString()
                                            : "Not marked"}
                                        </TableCell>
                                        <TableCell>
                                          <Badge
                                            variant={
                                              memberRecord?.status === "PRESENT"
                                                ? "default"
                                                : memberRecord?.status ===
                                                  "PARTIAL"
                                                ? "secondary"
                                                : "destructive"
                                            }
                                          >
                                            {memberRecord?.status || "ABSENT"}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="flex gap-2">
                                          <Button
                                            size="sm"
                                            onClick={() =>
                                              markAttendance(
                                                memberUserId,
                                                "entry"
                                              )
                                            }
                                            disabled={!!memberRecord?.entryTime}
                                            className="bg-green-600 hover:bg-green-700"
                                          >
                                            <UserCheck className="h-4 w-4 mr-1" />
                                            Entry
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                              markAttendance(
                                                memberUserId,
                                                "exit"
                                              )
                                            }
                                            disabled={
                                              !memberRecord?.entryTime ||
                                              !!memberRecord?.exitTime
                                            }
                                          >
                                            <UserX className="h-4 w-4 mr-1" />
                                            Exit
                                          </Button>
                                        </TableCell>
                                        <TableCell>
                                          <select
                                            value={
                                              memberRecord?.status || "ABSENT"
                                            }
                                            onChange={(e) =>
                                              handleStatusChange(
                                                memberUserId,
                                                e.target.value as any
                                              )
                                            }
                                            className="border rounded px-2 py-1"
                                          >
                                            <option value="PRESENT">
                                              Present
                                            </option>
                                            <option value="ABSENT">
                                              Absent
                                            </option>
                                            <option value="PARTIAL">
                                              Partial
                                            </option>
                                          </select>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </>
                              )}
                          </React.Fragment>
                        );
                      })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
