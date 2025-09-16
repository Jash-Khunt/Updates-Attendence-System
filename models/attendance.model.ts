import mongoose, { Schema, type Document } from "mongoose"

export interface IAttendance extends Document {
  userId: mongoose.Types.ObjectId
  eventId: mongoose.Types.ObjectId
  entryTime?: Date
  exitTime?: Date
  status: "PRESENT" | "ABSENT" | "PARTIAL"
  createdAt: Date
  updatedAt: Date
}

const AttendanceSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    entryTime: {
      type: Date,
      default: null,
    },
    exitTime: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["PRESENT", "ABSENT", "PARTIAL"],
      default: "ABSENT",
    },
  },
  {
    timestamps: true,
  },
)

// Compound index to ensure one attendance record per user per event
AttendanceSchema.index({ userId: 1, eventId: 1 }, { unique: true })

const Attendance = mongoose.models.Attendance || mongoose.model<IAttendance>("Attendance", AttendanceSchema)

export default Attendance
