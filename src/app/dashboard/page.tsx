import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/authOptions"
import { redirect } from "next/navigation"
import connectDB from "../../db"
import UserDetail from "../../models/userdetails.model"
import SoloRegistration from "../../models/soloRegistration.model"
import GroupRegistration from "../../models/groupRegistration.model"
import Event from "../../models/event.model"
import Group from "../../models/group.model"
import mongoose from "mongoose"
import { MatrixBackground } from "../../components/matrix-background"
import { DecryptionText } from "../../components/decryption-text"
import GradientAnimatedText from "../../components/GradientAnimatedText"
import DashboardContent from "./_components/DashboardContent"

const DashboardPage = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user.id) {
    return redirect("/signin")
  }

  await connectDB()

  // Fetch user details
  const userDetail = await UserDetail.findOne({
    userId: new mongoose.Types.ObjectId(session.user.id),
  }).lean()

  // Fetch solo registrations with event details
  const soloRegistrations = await SoloRegistration.find({
    userId: new mongoose.Types.ObjectId(session.user.id),
  })
    .populate("eventId", "name eventType")
    .lean()

  // Fetch group registrations with event and group details
  const groupRegistrations = await GroupRegistration.find({
    userId: new mongoose.Types.ObjectId(session.user.id),
  })
    .populate("eventId", "name eventType")
    .populate("groupId", "ownerId")
    .lean()

  // Fetch groups owned by user
  const ownedGroups = await Group.find({
    ownerId: new mongoose.Types.ObjectId(session.user.id),
  })
    .populate("eventId", "name eventType")
    .lean()

  // Get total event count for statistics
  const totalEvents = await Event.countDocuments()

  const dashboardData = {
    user: {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    },
    userDetail: userDetail
      ? {
          department: userDetail.department,
          year: userDetail.year,
          semester: userDetail.semester,
          enrollmentNo: userDetail.enrollmentNo,
          phoneNumber: userDetail.phoneNumber,
        }
      : null,
    soloRegistrations: soloRegistrations.map((reg) => ({
      id: reg._id.toString(),
      event: {
        id: reg.eventId._id.toString(),
        name: reg.eventId.name,
        type: reg.eventId.eventType,
      },
      registeredAt: reg.createdAt,
    })),
    groupRegistrations: groupRegistrations.map((reg) => ({
      id: reg._id.toString(),
      event: {
        id: reg.eventId._id.toString(),
        name: reg.eventId.name,
        type: reg.eventId.eventType,
      },
      group: {
        id: reg.groupId._id.toString(),
        isOwner: reg.groupId.ownerId.toString() === session.user.id,
      },
      registeredAt: reg.createdAt,
    })),
    ownedGroups: ownedGroups.map((group) => ({
      id: group._id.toString(),
      event: {
        id: group.eventId._id.toString(),
        name: group.eventId.name,
        type: group.eventId.eventType,
      },
      createdAt: group.createdAt,
    })),
    statistics: {
      totalRegistrations: soloRegistrations.length + groupRegistrations.length,
      soloEvents: soloRegistrations.length,
      groupEvents: groupRegistrations.length,
      groupsOwned: ownedGroups.length,
      totalEvents,
    },
  }

  return (
    <main className="min-h-screen bg-background text-foreground relative">
      <MatrixBackground />

      <div className="relative z-10 max-w-7xl mx-auto pt-20 pb-32 px-6">
        <div className="text-center mb-8">
          <DecryptionText text="USER_DASHBOARD_ACCESS_GRANTED" className="text-center text-sm text-cyan-400 mb-4" />
          <GradientAnimatedText className="text-3xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none">
            SYSTEM DASHBOARD
          </GradientAnimatedText>
          <p className="text-cyan-300/70 text-lg mt-4 font-mono">Welcome back, {session.user.name}</p>
        </div>

        <DashboardContent data={dashboardData} />
      </div>
    </main>
  )
}

export default DashboardPage
