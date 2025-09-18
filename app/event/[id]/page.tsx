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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Download,
  Search,
  UserCheck,
  UserX,
  Plus,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Participant {
  _id: string;
  userId: string;
  name: string;
  email: string;
  enrollmentNo?: string;
  phoneNumber?: string; // <-- Add this line
  isTemporary?: boolean;
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

interface TempGroup {
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

  const [tempParticipants, setTempParticipants] = useState<Participant[]>([]);
  const [tempGroups, setTempGroups] = useState<TempGroup[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newParticipant, setNewParticipant] = useState({ name: "", email: "" });
  const [newGroup, setNewGroup] = useState({
    leader: { name: "", email: "" },
    members: [{ name: "", email: "" }],
  });
  const [deletedParticipants, setDeletedParticipants] = useState<Set<string>>(
    new Set()
  );

  const handleToggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

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

      // Remove duplicate participants
      const uniqueParticipants = removeDuplicateParticipants(
        data.participants || []
      );
      setParticipants(uniqueParticipants);
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

      // Remove duplicate attendance records and keep only the latest one for each user
      const uniqueAttendance = removeDuplicateAttendance(data.attendance || []);
      setAttendance(uniqueAttendance);
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

  const removeDuplicateParticipants = (
    participants: Participant[] | Group[]
  ): Participant[] | Group[] => {
    if (!participants.length) return participants;

    // Check if it's a solo event (array of participants) or group event
    if ("groupId" in participants[0]) {
      // Group event - remove duplicate groups and duplicate members within groups
      const groups = participants as Group[];
      const uniqueGroups: Group[] = [];
      const seenGroups = new Set<string>();
      const seenLeaderEmails = new Set<string>();

      groups.forEach((group) => {
        // Use email as primary identifier for group deduplication
        const leaderEmail = group.leader?.email?.toLowerCase();
        const groupIdentifier = `${group.groupId}-${leaderEmail}`;

        if (
          leaderEmail &&
          !seenGroups.has(groupIdentifier) &&
          !seenLeaderEmails.has(leaderEmail)
        ) {
          seenGroups.add(groupIdentifier);
          seenLeaderEmails.add(leaderEmail);

          // Remove duplicate members within the group using email
          const uniqueMembers: Participant[] = [];
          const seenMemberEmails = new Set<string>();

          group.members.forEach((member) => {
            const memberEmail = member.email?.toLowerCase();
            if (memberEmail && !seenMemberEmails.has(memberEmail)) {
              seenMemberEmails.add(memberEmail);
              uniqueMembers.push(member);
            }
          });

          uniqueGroups.push({
            ...group,
            members: uniqueMembers,
          });
        }
      });

      return uniqueGroups;
    } else {
      // Solo event - remove duplicate participants using email
      const soloParticipants = participants as Participant[];
      const uniqueParticipants: Participant[] = [];
      const seenEmails = new Set<string>();

      soloParticipants.forEach((participant) => {
        const email = participant.email?.toLowerCase();
        if (email && !seenEmails.has(email)) {
          seenEmails.add(email);
          uniqueParticipants.push(participant);
        }
      });

      return uniqueParticipants;
    }
  };

  const removeDuplicateAttendance = (
    attendanceRecords: AttendanceRecord[]
  ): AttendanceRecord[] => {
    const uniqueRecords: AttendanceRecord[] = [];
    const seenEmails = new Set<string>();

    // Sort by creation time (assuming _id contains timestamp) to keep the latest record
    const sortedRecords = attendanceRecords.sort(
      (a, b) => new Date(b._id).getTime() - new Date(a._id).getTime()
    );

    sortedRecords.forEach((record) => {
      const email = record.userId.email?.toLowerCase();
      if (email && !seenEmails.has(email)) {
        seenEmails.add(email);
        uniqueRecords.push(record);
      }
    });

    return uniqueRecords;
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

  const getAttendanceStatus = (participant: Participant) => {
    return attendance.find((record) => {
      const recordEmail = record.userId.email?.toLowerCase();
      const participantEmail = participant.email?.toLowerCase();
      return recordEmail === participantEmail;
    });
  };

  const addTempParticipant = () => {
    if (event?.eventType === "SOLO") {
      addTempSoloParticipant();
    } else {
      addTempGroup();
    }
  };

  const addTempSoloParticipant = () => {
    if (!newParticipant.name.trim() || !newParticipant.email.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both name and email",
        variant: "destructive",
      });
      return;
    }

    // Check if email already exists in participants or temp participants
    const allParticipants = participants as Participant[];
    const emailExists = [...allParticipants, ...tempParticipants].some(
      (p) => p.email.toLowerCase() === newParticipant.email.toLowerCase()
    );

    if (emailExists) {
      toast({
        title: "Error",
        description: "A participant with this email already exists",
        variant: "destructive",
      });
      return;
    }

    const tempParticipant: Participant = {
      _id: `temp_${Date.now()}`,
      userId: `temp_${Date.now()}`,
      name: newParticipant.name,
      email: newParticipant.email,
      isTemporary: true,
    };

    setTempParticipants((prev) => [...prev, tempParticipant]);

    const tempAttendanceRecord: AttendanceRecord = {
      _id: `temp_attendance_${Date.now()}`,
      userId: {
        _id: tempParticipant.userId,
        name: tempParticipant.name,
        email: tempParticipant.email,
      },
      status: "PRESENT",
      entryTime: new Date().toISOString(),
    };

    setAttendance((prev) => [...prev, tempAttendanceRecord]);

    setNewParticipant({ name: "", email: "" });
    setIsAddDialogOpen(false);

    toast({
      title: "Success",
      description: "Temporary participant added as PRESENT",
    });
  };

  const addTempGroup = () => {
    if (!newGroup.leader.name.trim() || !newGroup.leader.email.trim()) {
      toast({
        title: "Error",
        description: "Please fill in leader name and email",
        variant: "destructive",
      });
      return;
    }

    if (newGroup.members.length < (event?.minMember || 1) - 1) {
      toast({
        title: "Error",
        description: `Group must have at least ${
          (event?.minMember || 1) - 1
        } members (excluding leader)`,
        variant: "destructive",
      });
      return;
    }

    if (newGroup.members.length > (event?.maxMember || 10) - 1) {
      toast({
        title: "Error",
        description: `Group cannot have more than ${
          (event?.maxMember || 10) - 1
        } members (excluding leader)`,
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate emails within the group
    const allGroupEmails = [
      newGroup.leader.email,
      ...newGroup.members.map((m) => m.email),
    ];
    const uniqueEmails = new Set(
      allGroupEmails.map((email) => email.toLowerCase())
    );
    if (uniqueEmails.size !== allGroupEmails.length) {
      toast({
        title: "Error",
        description: "Duplicate emails found within the group",
        variant: "destructive",
      });
      return;
    }

    // Check if any email already exists in participants or temp participants/groups
    const allParticipants = participants as Group[];
    const existingEmails = new Set();

    // Add existing participants emails
    allParticipants.forEach((group) => {
      if (group.leader?.email) {
        existingEmails.add(group.leader.email.toLowerCase());
      }
      group.members?.forEach((member) => {
        if (member.email) {
          existingEmails.add(member.email.toLowerCase());
        }
      });
    });

    // Add temp participants emails
    tempParticipants.forEach((p) => {
      if (p.email) {
        existingEmails.add(p.email.toLowerCase());
      }
    });

    // Add temp groups emails
    tempGroups.forEach((group) => {
      if (group.leader?.email) {
        existingEmails.add(group.leader.email.toLowerCase());
      }
      group.members?.forEach((member) => {
        if (member.email) {
          existingEmails.add(member.email.toLowerCase());
        }
      });
    });

    const hasExistingEmail = allGroupEmails.some((email) =>
      existingEmails.has(email.toLowerCase())
    );
    if (hasExistingEmail) {
      toast({
        title: "Error",
        description: "One or more emails already exist in the participant list",
        variant: "destructive",
      });
      return;
    }

    const groupId = `temp_group_${Date.now()}`;
    const tempGroup: TempGroup = {
      groupId,
      leader: {
        _id: `temp_leader_${Date.now()}`,
        userId: `temp_leader_${Date.now()}`,
        name: newGroup.leader.name,
        email: newGroup.leader.email,
        isTemporary: true,
      },
      members: newGroup.members.map((member, index) => ({
        _id: `temp_member_${Date.now()}_${index}`,
        userId: `temp_member_${Date.now()}_${index}`,
        name: member.name,
        email: member.email,
        isTemporary: true,
      })),
    };

    setTempGroups((prev) => [...prev, tempGroup]);

    const tempAttendanceRecords: AttendanceRecord[] = [
      // Leader attendance
      {
        _id: `temp_attendance_leader_${Date.now()}`,
        userId: {
          _id: tempGroup.leader.userId,
          name: tempGroup.leader.name,
          email: tempGroup.leader.email,
        },
        status: "PRESENT",
        entryTime: new Date().toISOString(),
      },
      // Members attendance
      ...tempGroup.members.map((member, index) => ({
        _id: `temp_attendance_member_${Date.now()}_${index}`,
        userId: {
          _id: member.userId,
          name: member.name,
          email: member.email,
        },
        status: "PRESENT" as const,
        entryTime: new Date().toISOString(),
      })),
    ];

    setAttendance((prev) => [...prev, ...tempAttendanceRecords]);

    setNewGroup({
      leader: { name: "", email: "" },
      members: [{ name: "", email: "" }],
    });
    setIsAddDialogOpen(false);

    toast({
      title: "Success",
      description: "Temporary group added with all members as PRESENT",
    });
  };

  const addMemberField = () => {
    if (event?.maxMember && newGroup.members.length + 1 >= event.maxMember) {
      toast({
        title: "Error",
        description: `Cannot add more members. Maximum group size is ${event.maxMember}`,
        variant: "destructive",
      });
      return;
    }
    setNewGroup((prev) => ({
      ...prev,
      members: [...prev.members, { name: "", email: "" }],
    }));
  };

  const removeMemberField = (index: number) => {
    if (newGroup.members.length <= 1) {
      toast({
        title: "Error",
        description: "Group must have at least one member besides the leader",
        variant: "destructive",
      });
      return;
    }
    setNewGroup((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
  };

  const updateMember = (
    index: number,
    field: "name" | "email",
    value: string
  ) => {
    setNewGroup((prev) => ({
      ...prev,
      members: prev.members.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      ),
    }));
  };

  const deleteParticipant = (
    participantId: string,
    email: string,
    context?: string
  ) => {
    const safeParticipantId =
      participantId ||
      `fallback_${email.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}`;

    if (!safeParticipantId) {
      console.error("[v0] Unable to generate participant ID for email:", email);
      toast({
        title: "Error",
        description: "Unable to delete participant - invalid ID",
        variant: "destructive",
      });
      return;
    }

    // If it's a temporary participant, remove it completely
    if (safeParticipantId.startsWith("temp_")) {
      setTempParticipants((prev) =>
        prev.filter((p) => p._id !== safeParticipantId)
      );
    } else {
      // For regular participants, create a unique row identifier
      // Format: email_context (e.g., "user@email.com_leader" or "user@email.com_member_groupId")
      const rowIdentifier = context
        ? `${email.toLowerCase()}_${context}`
        : email.toLowerCase();
      setDeletedParticipants((prev) => new Set([...prev, rowIdentifier]));
    }

    toast({
      title: "Success",
      description: "Participant removed from this view and CSV export",
    });
  };

  const getAllParticipants = () => {
    if (event?.eventType === "SOLO") {
      const regularParticipants = (participants as Participant[]).filter(
        (p) => !deletedParticipants.has(p.email.toLowerCase())
      );
      const filteredTempParticipants = tempParticipants.filter(
        (p) => !deletedParticipants.has(p.email.toLowerCase())
      );
      console.log("[v0] Regular participants:", regularParticipants.length);
      console.log("[v0] Temp participants:", filteredTempParticipants.length);
      console.log(
        "[v0] Deleted participants:",
        Array.from(deletedParticipants)
      );
      return [...regularParticipants, ...filteredTempParticipants];
    } else {
      const regularGroups = participants as Group[];
      const tempGroupsAsGroups: Group[] = tempGroups.map((tg) => ({
        groupId: tg.groupId,
        leader: tg.leader,
        members: tg.members,
      }));
      console.log("[v0] Regular groups:", regularGroups.length);
      console.log("[v0] Temp groups:", tempGroupsAsGroups.length);
      return [...regularGroups, ...tempGroupsAsGroups];
    }
  };

  const filteredParticipants = (() => {
    if (event?.eventType === "SOLO") {
      const allParticipants = getAllParticipants() as Participant[];

      return allParticipants.filter(
        (p) =>
          !deletedParticipants.has(p.email.toLowerCase()) &&
          ((p.name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
            (p.email?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
            (p.enrollmentNo?.toLowerCase() ?? "").includes(
              searchTerm.toLowerCase()
            ) ||
            (p.phoneNumber?.toLowerCase() ?? "").includes(
              searchTerm.toLowerCase()
            ))
      );
    } else {
      // For GROUP events
      const regularGroups = participants as Group[];
      const allGroups = [...regularGroups, ...tempGroups];

      if (!searchTerm) {
        // If no search term, return all groups with filtered members
        return allGroups
          .map((group) => {
            const filteredMembers = group.members.filter((member) => {
              const memberRowId = `${member.email.toLowerCase()}_member_${
                group.groupId
              }`;
              return !deletedParticipants.has(memberRowId);
            });

            return {
              ...group,
              members: filteredMembers,
            };
          })
          .filter((group) => {
            if (!group.leader?.email) return false;
            const leaderRowId = `${group.leader.email.toLowerCase()}_leader_${
              group.groupId
            }`;
            return !deletedParticipants.has(leaderRowId);
          });
      }

      // If there's a search term, filter groups and members
      return allGroups
        .map((group) => {
          // Check if leader matches search
          const leaderMatches =
            (group.leader.name?.toLowerCase() ?? "").includes(
              searchTerm.toLowerCase()
            ) ||
            (group.leader.email?.toLowerCase() ?? "").includes(
              searchTerm.toLowerCase()
            ) ||
            (group.leader.enrollmentNo?.toLowerCase() ?? "").includes(
              searchTerm.toLowerCase()
            ) ||
            (group.leader.phoneNumber?.toLowerCase() ?? "").includes(
              searchTerm.toLowerCase()
            );

          // Filter members based on search and deletion status
          const filteredMembers = group.members.filter((member) => {
            const memberRowId = `${member.email.toLowerCase()}_member_${
              group.groupId
            }`;
            const isDeleted = deletedParticipants.has(memberRowId);

            if (isDeleted) return false;

            const memberMatches =
              (member.name?.toLowerCase() ?? "").includes(
                searchTerm.toLowerCase()
              ) ||
              (member.email?.toLowerCase() ?? "").includes(
                searchTerm.toLowerCase()
              ) ||
              (member.enrollmentNo?.toLowerCase() ?? "").includes(
                searchTerm.toLowerCase()
              ) ||
              (member.phoneNumber?.toLowerCase() ?? "").includes(
                searchTerm.toLowerCase()
              );

            return memberMatches;
          });

          // Include group if leader matches or any member matches
          if (leaderMatches || filteredMembers.length > 0) {
            return {
              ...group,
              members: leaderMatches ? group.members : filteredMembers,
            };
          }

          return null;
        })
        .filter((group) => group !== null) as Group[];
    }
  })();

  const exportToCSV = () => {
    const rows: string[][] = [
      [
        "Name",
        "Email",
        "Enrollment No",
        "Phone Number",
        "Signature", // <-- Blank column
        // "Entry Time",
        // "Exit Time",
        // "Status",
      ],
    ];

    if (event?.eventType === "SOLO") {
      const allParticipants = getAllParticipants() as Participant[];
      allParticipants
        .filter((p) => !deletedParticipants.has(p.email.toLowerCase()))
        .forEach((p) => {
          // const userId = getUserId(p);
          // const record = getAttendanceStatus(p);
          rows.push([
            p.name,
            p.email,
            p.enrollmentNo || "—",
            p.phoneNumber || "—",
            "", // Signature column blank
            // record?.entryTime
            //   ? new Date(record.entryTime).toLocaleString()
            //   : "Not marked",
            // record?.exitTime
            //   ? new Date(record.exitTime).toLocaleString()
            //   : "Not marked",
            // record?.status || "ABSENT",
          ]);
        });
    } else {
      (participants as Group[]).forEach((group) => {
        // Leader
        if (group.leader && group.leader.email) {
          const leaderRowId = `${group.leader.email.toLowerCase()}_leader_${
            group.groupId
          }`;
          if (!deletedParticipants.has(leaderRowId)) {
            // const leaderUserId = getUserId(group.leader);
            // const leaderRecord = getAttendanceStatus(group.leader);
            rows.push([
              group.leader.name + " (Leader)",
              group.leader.email,
              group.leader.enrollmentNo || "—",
              group.leader.phoneNumber || "—",
              "", // Signature column blank
              // leaderRecord?.entryTime
              //   ? new Date(leaderRecord.entryTime).toLocaleString()
              //   : "Not marked",
              // leaderRecord?.exitTime
              //   ? new Date(leaderRecord.exitTime).toLocaleString()
              //   : "Not marked",
              // leaderRecord?.status || "ABSENT",
            ]);
          }
        }
        // Members
        group.members.forEach((member) => {
          if (member && member.email) {
            const memberRowId = `${member.email.toLowerCase()}_member_${
              group.groupId
            }`;
            if (!deletedParticipants.has(memberRowId)) {
              // const memberUserId = getUserId(member);
              // const memberRecord = getAttendanceStatus(member);
              rows.push([
                member.name,
                member.email,
                member.enrollmentNo || "—",
                member.phoneNumber || "—",
                "", // Signature column blank
                // memberRecord?.entryTime
                //   ? new Date(memberRecord.entryTime).toLocaleString()
                //   : "Not marked",
                // memberRecord?.exitTime
                //   ? new Date(memberRecord.exitTime).toLocaleString()
                //   : "Not marked",
                // memberRecord?.status || "ABSENT",
              ]);
            }
          }
        });
        // Add a blank row after each group
        rows.push([""]);
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

  const getUniqueParticipantCount = () => {
    if (event?.eventType === "SOLO") {
      return (getAllParticipants() as Participant[]).filter(
        (p) => !deletedParticipants.has(p.email.toLowerCase())
      ).length;
    } else {
      return (participants as Group[]).reduce((acc, group) => {
        if (!group.leader?.email) return acc;

        const leaderRowId = `${group.leader.email.toLowerCase()}_leader_${
          group.groupId
        }`;
        const leaderCount = deletedParticipants.has(leaderRowId) ? 0 : 1;

        const memberCount =
          group.members?.filter((m) => {
            if (!m.email) return false;
            const memberRowId = `${m.email.toLowerCase()}_member_${
              group.groupId
            }`;
            return !deletedParticipants.has(memberRowId);
          }).length || 0;

        return acc + leaderCount + memberCount;
      }, 0);
    }
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

  const totalParticipantCount = getUniqueParticipantCount();
  const presentCount = attendance.filter((r) => r.status === "PRESENT").length;
  const absentCount = totalParticipantCount - presentCount;
  const attendanceRate =
    totalParticipantCount > 0
      ? Math.round((presentCount / totalParticipantCount) * 100)
      : 0;

  const allParticipants = getAllParticipants();
  console.log("[v0] All participants for rendering:", allParticipants.length);

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
                  onClick={() => setIsAddDialogOpen(true)}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Participant
                </Button>
                <Button
                  onClick={exportToCSV}
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent"
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
                    <TableHead>Enrollment No</TableHead>
                    <TableHead>Phone Number</TableHead>{" "}
                    {/* <-- Add this line */}
                    <TableHead>Entry Time</TableHead>
                    <TableHead>Exit Time</TableHead>
                    <TableHead>Status</TableHead>
                    {/* ...other columns... */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {event?.eventType === "SOLO"
                    ? (filteredParticipants as Participant[]).map((p) => {
                        const userId = getUserId(p);
                        const record = getAttendanceStatus(p);
                        return (
                          <TableRow key={`${p.email}-${userId}`}>
                            <TableCell>
                              {p.name}
                              {p.isTemporary && (
                                <Badge
                                  variant="secondary"
                                  className="ml-2 text-xs"
                                >
                                  TEMP
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{p.email}</TableCell>
                            <TableCell>{p.enrollmentNo || "—"}</TableCell>
                            <TableCell>{p.phoneNumber || "—"}</TableCell>
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
                                disabled={!!record?.entryTime || p.isTemporary}
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
                                  !record?.entryTime ||
                                  !!record?.exitTime ||
                                  p.isTemporary
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
                                    e.target.value as
                                      | "PRESENT"
                                      | "ABSENT"
                                      | "PARTIAL"
                                  )
                                }
                                disabled={p.isTemporary}
                                className="border rounded px-2 py-1 text-sm"
                              >
                                <option value="PRESENT">Present</option>
                                <option value="ABSENT">Absent</option>
                                <option value="PARTIAL">Partial</option>
                              </select>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  deleteParticipant(p._id || p.email, p.email)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    : (filteredParticipants as Group[]).map((group) => {
                        const leaderUserId = getUserId(group.leader);
                        const leaderRecord = getAttendanceStatus(group.leader);
                        return (
                          <React.Fragment
                            key={`group-${group.groupId}-${group.leader.email}`}
                          >
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
                                {group.leader.enrollmentNo || "—"}
                              </TableCell>
                              <TableCell>
                                {group.leader.phoneNumber || "—"}
                              </TableCell>
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
                                      e.target.value as
                                        | "PRESENT"
                                        | "ABSENT"
                                        | "PARTIAL"
                                    )
                                  }
                                  className="border rounded px-2 py-1 text-sm"
                                >
                                  <option value="PRESENT">Present</option>
                                  <option value="ABSENT">Absent</option>
                                  <option value="PARTIAL">Partial</option>
                                </select>
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    deleteParticipant(
                                      group.leader._id || group.leader.email,
                                      group.leader.email,
                                      `leader_${group.groupId}`
                                    )
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                            {openGroups[group.groupId] &&
                              group.members.length > 0 && (
                                <>
                                  {group.members
                                    .filter(
                                      (member) =>
                                        !deletedParticipants.has(
                                          `${member.email.toLowerCase()}_member_${
                                            group.groupId
                                          }`
                                        )
                                    )
                                    .map((member) => {
                                      const memberUserId = getUserId(member);
                                      const memberRecord =
                                        getAttendanceStatus(member);
                                      return (
                                        <TableRow
                                          key={`member-${member.email}-${memberUserId}`}
                                          className="bg-gray-50"
                                        >
                                          <TableCell className="pl-12">
                                            {member.name}
                                          </TableCell>
                                          <TableCell>{member.email}</TableCell>
                                          <TableCell>
                                            {member.enrollmentNo || "—"}
                                          </TableCell>
                                          <TableCell>
                                            {member.phoneNumber || "—"}
                                          </TableCell>
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
                                                memberRecord?.status ===
                                                "PRESENT"
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
                                              disabled={
                                                !!memberRecord?.entryTime
                                              }
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
                                                  e.target.value as
                                                    | "PRESENT"
                                                    | "ABSENT"
                                                    | "PARTIAL"
                                                )
                                              }
                                              className="border rounded px-2 py-1 text-sm"
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
                                          <TableCell>
                                            <Button
                                              size="sm"
                                              variant="destructive"
                                              onClick={() =>
                                                deleteParticipant(
                                                  member._id || member.email,
                                                  member.email,
                                                  `member_${group.groupId}`
                                                )
                                              }
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
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

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent
            className={
              event?.eventType === "GROUP"
                ? "sm:max-w-2xl max-h-[80vh] overflow-y-auto"
                : "sm:max-w-md"
            }
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Temporary{" "}
                {event?.eventType === "SOLO" ? "Participant" : "Group"}
              </DialogTitle>
              <DialogDescription>
                {event?.eventType === "SOLO"
                  ? "Add a participant temporarily. This will not affect the database but will be included in CSV exports."
                  : `Add a group temporarily. Group size must be between ${
                      event?.minMember || 1
                    } and ${
                      event?.maxMember || "unlimited"
                    } members (including leader).`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {event?.eventType === "SOLO" ? (
                <>
                  <Input
                    placeholder="Participant Name"
                    value={newParticipant.name}
                    onChange={(e) =>
                      setNewParticipant((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                  <Input
                    type="email"
                    placeholder="Participant Email"
                    value={newParticipant.email}
                    onChange={(e) =>
                      setNewParticipant((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </>
              ) : (
                <>
                  {/* Leader Section */}
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <h4 className="font-semibold text-blue-800 mb-3">
                      Group Leader
                    </h4>
                    <div className="space-y-2">
                      <Input
                        placeholder="Leader Name"
                        value={newGroup.leader.name}
                        onChange={(e) =>
                          setNewGroup((prev) => ({
                            ...prev,
                            leader: { ...prev.leader, name: e.target.value },
                          }))
                        }
                      />
                      <Input
                        type="email"
                        placeholder="Leader Email"
                        value={newGroup.leader.email}
                        onChange={(e) =>
                          setNewGroup((prev) => ({
                            ...prev,
                            leader: { ...prev.leader, email: e.target.value },
                          }))
                        }
                      />
                    </div>
                  </div>

                  {/* Members Section */}
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">Group Members</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addMemberField}
                        disabled={
                          event?.maxMember
                            ? newGroup.members.length + 1 >= event.maxMember
                            : false
                        }
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Member
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {newGroup.members.map((member, index) => (
                        <div key={index} className="flex gap-2 items-end">
                          <div className="flex-1 space-y-2">
                            <Input
                              placeholder={`Member ${index + 1} Name`}
                              value={member.name}
                              onChange={(e) =>
                                updateMember(index, "name", e.target.value)
                              }
                            />
                            <Input
                              type="email"
                              placeholder={`Member ${index + 1} Email`}
                              value={member.email}
                              onChange={(e) =>
                                updateMember(index, "email", e.target.value)
                              }
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeMemberField(index)}
                            disabled={newGroup.members.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Total members:{" "}
                      {newGroup.members.filter(
                        (m) => m.name.trim() && m.email.trim()
                      ).length + 1}
                      {event?.minMember && ` (min: ${event.minMember})`}
                      {event?.maxMember && ` (max: ${event.maxMember})`}
                    </p>
                  </div>
                </>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={addTempParticipant}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Add {event?.eventType === "SOLO" ? "Participant" : "Group"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setNewParticipant({ name: "", email: "" });
                    setNewGroup({
                      leader: { name: "", email: "" },
                      members: [{ name: "", email: "" }],
                    });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
