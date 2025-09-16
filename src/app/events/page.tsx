"use client";

import React from "react";
import Link from "next/link";
import { MatrixBackground } from "@/components/matrix-background";
import GradientAnimatedText from "../../components/GradientAnimatedText";
import Card from "../../components/event-card";
import events from "../../lib/events";
import { DecryptionText } from "@/components/decryption-text"
const page = () => {
  return (
    <main className=" min-h-screen bg-background text-foreground">
      <div className="pt-20 pb-8">
      {/* Matrix-style animated background */}
      <MatrixBackground />
      <div className="relative z-10 max-w-7xl mx-auto mb-48 min-h-screen">
      <DecryptionText text="EVENTS_ACCESS_GRANTED" className="text-center text-sm text-cyan-400 mb-4" />
          

      {/* Foreground content */}
      <div className="relative z-10 max-w-7xl mx-auto pt-20 mb-36 px-6">
        {/* Animated Title */}
        <GradientAnimatedText className="mb-10 tracking-tighter xl:text-4xl/none text-center">
          SYSTEM EVENTS
        </GradientAnimatedText>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mx-auto w-fit">
          {events.map((data) => (
            <Link href={`/event/${data.id}`} key={data.id}>
              <Card
                title={data.name}
                tagline={data.Tagline}
                coverImage={data.logo}
              />
            </Link>
          ))}
        </div>
      </div>
      </div>
      </div>
    </main>
  );
};

export default page;
