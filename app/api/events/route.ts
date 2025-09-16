import { NextResponse } from "next/server"
import { connectDB } from "@/db"
import Event from "@/models/event.model"

export async function GET() {
  try {
    await connectDB()
    const events = await Event.find({})

    return NextResponse.json({
      success: true,
      events: events,
    })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch events" }, { status: 500 })
  }
}
