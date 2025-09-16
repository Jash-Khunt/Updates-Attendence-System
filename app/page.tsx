"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Users, User, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Event {
  _id: string;
  name: string;
  eventType: "SOLO" | "GROUP";
  minMember?: number;
  maxMember?: number;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [password, setPassword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      const data = await response.json();

      setEvents(data.events);

      // 👉 Log all event names in the console
      if (Array.isArray(data.events)) {
        console.log(
          "Fetched events:",
          data.events.map((e: Event) => e.name)
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEventAccess = async () => {
    if (!selectedEvent || !password) {
      toast({
        title: "Error",
        description: "Please enter the password",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventName: selectedEvent.name,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/event/${selectedEvent._id}`);
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid password for this event",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify password",
        variant: "destructive",
      });
    }

    setPassword("");
    setIsDialogOpen(false);
  };

  const openEventDialog = (event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Updates 2K25 - Attendance System
          </h1>
          <p className="text-lg text-gray-600">Event Coordinator Dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card
              key={event._id}
              className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-800 capitalize">
                    {event.name}
                  </CardTitle>
                  <Badge
                    variant={
                      event.eventType === "SOLO" ? "default" : "secondary"
                    }
                  >
                    {event.eventType}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2 text-gray-600">
                  {event.eventType === "SOLO" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Users className="h-4 w-4" />
                  )}
                  {event.eventType === "GROUP"
                    ? `Team Size: ${event.minMember}-${event.maxMember} members`
                    : "Individual Event"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => openEventDialog(event)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Access Event
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Event Access Verification
              </DialogTitle>
              <DialogDescription>
                Enter the coordinator password for{" "}
                <strong>{selectedEvent?.name}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Enter event password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleEventAccess()}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleEventAccess}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Access Event
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
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
