import BlurFade from "../../components/magicui/blur-fade";
import DetailForm from "./_components/Form";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import UserDetail from "../../models/userdetails.model";
import mongoose from "mongoose";
import connectDB from "../../db";
import GradientAnimatedText from "../../components/GradientAnimatedText";
import Image from "next/image";

type Props = {};

const Page = async (props: Props) => {
  const session = await getServerSession(authOptions);

  if (!session?.user.id && !session?.user.email) {
    return redirect("/");
  }
  console.log(session);

  await connectDB();

  const data = await UserDetail.findOne({
    userId: new mongoose.Types.ObjectId(session?.user.id),
  }).select("-userId -createdAt -updatedAt -_id -__v");
  let userData = {};
  if (data) {
    userData = {
      department: data?.department,
      year: data?.year,
      semester: data?.semester,
      enrollmentNo: data?.enrollmentNo,
      phoneNumber: data?.phoneNumber,
    };
  }

  return (
    <section className="min-h-screen bg-gradient-to-r from-gray-900 via-emerald-950 to-gray-900 max-w-7xl mx-auto relative mb-36 grid grid-cols-1 gap-8 border-2 border-emerald-700 shadow-lg shadow-blue-500/50 rounded-lg p-4">
      <GradientAnimatedText className="font-bold tracking-tighter text-3xl xl:text-4xl/none text-center text-white">
        Let&apos;s Get You Started
      </GradientAnimatedText>
      <BlurFade inView className="my-8 mx-8">
        <div className="mx-auto flex flex-col justify-center items-center mt-6">
          <Image
            src={session.user.image || ""}
            alt={session.user.name || "user"}
            height={75}
            width={75}
            className="rounded-full"
          />
          <div className="mt-2 text-lg text-white">Hi, {session.user.name}</div>
        </div>
      </BlurFade>
      <BlurFade inView delay={0.2} className="font-bold text-xl md:text-2xl uppercase text-white drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
        <DetailForm userDetails={userData} />
      </BlurFade>
    </section>
  );
};

export default Page;
