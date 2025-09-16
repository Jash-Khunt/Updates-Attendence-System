import { type NextRequest, NextResponse } from "next/server"
import { eventPasswords } from "@/lib/event-passwords"

export async function POST(request: NextRequest) {
  try {
    const { eventName, password } = await request.json()

    if (!eventName || !password) {
      return NextResponse.json({ success: false, message: "Event name and password are required" }, { status: 400 })
    }

    // Check if the password matches for the given event
    const correctPassword = eventPasswords[eventName.toLowerCase()]

    if (correctPassword && correctPassword === password) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 })
    }
  } catch (error) {
    console.error("Error verifying password:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
