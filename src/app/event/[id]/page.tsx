import connectDB from "../../../db";
import Event from "../../../models/event.model";
import mongoose from "mongoose";
import React from "react";
import RegisterSoloButton from "./_components/RegisterSoloButton";
import { redirect } from "next/navigation";
import GroupRegistration from "../../../models/groupRegistration.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/authOptions";
import SoloRegistration from "../../../models/soloRegistration.model";
import Image from "next/image";
import BlurFade from "../../../components/magicui/blur-fade";
import GroupRegistrationForm, { EmailOption } from "./_components/GroupForm";
import User from "../../../models/user.model";
import events from "../../../lib/events";
import GradientAnimatedText from "../../../components/GradientAnimatedText";
import { Metadata } from "next";
import UserDetail from "../../../models/userdetails.model";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const eventId = params.id;
  const currEvent = events.find((event) => event.id === eventId);

  if (!currEvent) {
    return { title: "Event Not Found" };
  }

  return {
    title: `${currEvent.name} | Updates 2k24`,
    description: currEvent.Tagline,
    openGraph: {
      title: currEvent.name,
      description: currEvent.Tagline,
      images: [
        {
          url: currEvent.coverImage,
          width: 1200,
          height: 630,
          alt: currEvent.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: currEvent.name,
      description: currEvent.Tagline,
      images: [currEvent.coverImage],
    },
  };
}

const Page = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/auth/login");

  const eventId = params.id;

  const currEvent = events.find((event) => event.id === eventId);
  if (!currEvent) return redirect("/events");

  await connectDB();

  const userDetails = await UserDetail.findOne({
    userId: new mongoose.Types.ObjectId(session.user.id),
  });
  const isDetailsAvailable = !!userDetails;

  // Try to find the event in DB by its "name"
  let eventData = await Event.findOne({ name: currEvent.name });

  // If not found in DB, auto-create it from static events array
  if (!eventData) {
    eventData = await Event.create({
      name: currEvent.name,
      id: currEvent.id, // keep both id and name if your schema has both
      Tagline: currEvent.Tagline,
      coverImage: currEvent.coverImage,
      eventType: currEvent.eventType || "SOLO", // default if missing
      minMember: currEvent.minMember || 1,
      maxMember: currEvent.maxMember || 1,
      prizePool: currEvent.prizePool || [],
      rounds: currEvent.rounds || [],
      // add other required fields of your schema here
    });
  }

  let isSoloAlreadyRegistered = false;
  let dataOfMembers: any[] = [];
  let emailOptions: EmailOption[] = [];

  if (eventData.eventType === "SOLO") {
    const alreadyRegistered = await SoloRegistration.find({
      userId: session.user.id,
      eventId: eventData._id,
    });
    isSoloAlreadyRegistered = alreadyRegistered.length > 0;
  }

  if (eventData.eventType === "GROUP") {
    const allRegistration = await GroupRegistration.find({
      eventId: eventData._id,
    });

    const existedUsers = allRegistration.map((gp) => gp.userId);
    const alreadyRegisterIds = [session.user.id, ...existedUsers];

    const userdata = await User.find({
      _id: { $nin: alreadyRegisterIds },
    }).sort({ email: 1 });

    emailOptions = userdata.map((user) => ({
      label: user.email,
      value: user._id.toString(),
    }));

    const data = await GroupRegistration.find({
      userId: session.user.id,
      eventId: eventData._id,
    });

    const groupId = data[0]?.groupId;
    if (groupId) {
      const pipeline = [
        { $match: { groupId: new mongoose.Types.ObjectId(groupId) } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "result",
            pipeline: [{ $project: { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 } }],
          },
        },
        { $addFields: { user: { $first: "$result" } } },
        {
          $project: {
            _id: 0,
            groupId: 0,
            result: 0,
            userId: 0,
            eventId: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
          },
        },
      ];
      dataOfMembers = await GroupRegistration.aggregate(pipeline);
    }
  }

  return (
    <div className="px-8 max-w-7xl mx-auto mb-36">
      <GradientAnimatedText className="mt-12 text-3xl font-black xl:text-4xl/none text-center">
        {currEvent.name}
      </GradientAnimatedText>
      <BlurFade inView>
        <p className="italic text-center text-violet-100 mb-12 mt-2">
          &quot;{currEvent.Tagline}&quot;
        </p>

        {eventData.eventType === "SOLO" ? (
          <div className="flex items-center justify-center">
            <RegisterSoloButton
              eventId={eventData._id.toString()}
              isAlredyRegister={isSoloAlreadyRegistered}
              isDetailsAvailable={isDetailsAvailable}
            />
          </div>
        ) : dataOfMembers.length === 0 ? (
          <GroupRegistrationForm
            mini={eventData.minMember}
            maxi={eventData.maxMember}
            eventId={eventData._id.toString()}
            emailOptions={emailOptions}
            isDetailsAvailable={isDetailsAvailable}
          />
        ) : (
          <div className="p-4 w-full bg-gradient-to-br from-red-950/30 to-red-800/30 rounded-lg border border-red-900/70">
            <p className="italic text-sm text-violet-50/60 mb-4">
              *You have already registered for this event
            </p>
            <h4 className="text-lg font-bold text-white">Team Members:</h4>
            <ul className="list-disc list-inside text-muted-foreground">
              {dataOfMembers.map((data) => (
                <li key={data.user.name} className="flex items-center gap-3 ml-4 mt-0.5">
                  <div>
                    <p>{data.user.name}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Keep your existing images, rules, prize table, coordinators, volunteers UI below */}
      </BlurFade>
    </div>
  );
};

export default Page;
