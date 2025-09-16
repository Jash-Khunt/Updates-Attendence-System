import mongoose, { Schema, type Document } from "mongoose"

export interface IEvent extends Document {
  name: string
  eventType: "SOLO" | "GROUP"
  minMember?: number
  maxMember?: number
  createdAt: Date
  updatedAt: Date
}

const EventSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    eventType: {
      type: String,
      enum: ["SOLO", "GROUP"],
      required: true,
    },
    minMember: {
      type: Number,
      required: function (this: IEvent) {
        return this.eventType === "GROUP"
      },
    },
    maxMember: {
      type: Number,
      required: function (this: IEvent) {
        return this.eventType === "GROUP"
      },
    },
  },
  {
    timestamps: true,
  },
)

const Event = mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema)

export default Event
