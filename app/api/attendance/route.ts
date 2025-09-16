import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/db"
import Attendance from "@/models/attendance.model"

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Import User model after DB connection
    const User = (await import("@/models/user.model")).default;

    const { userId, eventId, action } = await request.json()

    
    if (!userId || !eventId || !action) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Find existing attendance record
    let attendance = await Attendance.findOne({ userId, eventId })

    if (!attendance) {
      // Create new attendance record
      attendance = new Attendance({
        userId,
        eventId,
        entryTime: action === "entry" ? new Date() : null,
        exitTime: null,
        status: action === "entry" ? "PRESENT" : "ABSENT",
      })
    } else {
      // Update existing record
      if (action === "entry" && !attendance.entryTime) {
        attendance.entryTime = new Date()
        attendance.status = "PRESENT"
      } else if (action === "exit" && attendance.entryTime && !attendance.exitTime) {
        attendance.exitTime = new Date()
        attendance.status = "PRESENT"
      }
    }

    await attendance.save()

    return NextResponse.json({
      success: true,
      attendance: attendance,
    })
  } catch (error) {
    console.error("Error recording attendance:", error)
    return NextResponse.json({ success: false, message: "Failed to record attendance" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Import User model after DB connection
    const User = (await import("@/models/user.model")).default

    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get("eventId")

    if (!eventId) {
      return NextResponse.json({ success: false, message: "Event ID is required" }, { status: 400 })
    }

    const attendanceRecords = await Attendance.find({ eventId })
      .populate("userId", "name email avatar")
      .sort({ entryTime: -1 })

    return NextResponse.json({
      success: true,
      attendance: attendanceRecords,
    })
  } catch (error) {
    console.error("Error fetching attendance:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch attendance" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { userId, eventId, status } = await request.json();

    if (!userId || !eventId || !status) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const attendance = await Attendance.findOne({ userId, eventId });
    if (!attendance) {
      return NextResponse.json({ success: false, message: "Attendance record not found" }, { status: 404 });
    }

    attendance.status = status;
    if (status === "ABSENT") {
      attendance.entryTime = null;
      attendance.exitTime = null;
    }
    await attendance.save();

    return NextResponse.json({ success: true, attendance });
  } catch (error) {
    console.error("Error updating attendance:", error);
    return NextResponse.json({ success: false, message: "Failed to update attendance" }, { status: 500 });
  }
}
