import GradientAnimatedText from "../../components/GradientAnimatedText"
import { MatrixBackground } from "@/components/matrix-background"
import { CyberpunkNav } from "@/components/cyberpunk-nav"
import { DecryptionText } from "@/components/decryption-text"
import Marquee from "../../components/magicui/marquee"
import {
  decorationTeam,
  graphicsTeam,
  imageData,
  mainCoordinators,
  marketingTeam,
  specialThanks,
  updatesLeads,
  webTeam,
} from "../../lib/static"
import { cn } from "../../lib/utils"
import Image from "next/image"
import type { PersonProps } from "@/types" // Declare PersonProps

const page = () => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <MatrixBackground />
      

      <div className="relative z-10 max-w-7xl mx-auto mb-48 min-h-screen">
        <div className="pt-20 pb-8">
          <DecryptionText text="GALLERY_ACCESS_GRANTED" className="text-center text-sm text-cyan-400 mb-4" />
          <GradientAnimatedText className="text-3xl mt-8 mb-2 font-bold tracking-tighter sm:text-3xl xl:text-4xl/none text-center">
            Gallery
          </GradientAnimatedText>
          <p className="text-center text-pretty tracking-tighter text-lg sm:text-xl xl:text-2xl/none italic text-cyan-300/70 mt-4">
            Glimpse from Updates 2k25
          </p>
        </div>

        <div className="container mx-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {imageData.map((image, index) => (
              <div
                key={index}
                className={`
                  ${index === 0 ? "col-span-2 row-span-2" : ""}
                  ${index === 5 ? "col-span-1" : ""}
                  ${index === 6 ? "col-span-1" : ""}
                  overflow-hidden rounded-lg shadow-lg group cursor-pointer
                  transition-all duration-300 hover:scale-105
                  border border-cyan-500/20 hover:border-cyan-400/60
                  hover:shadow-cyan-400/25 hover:shadow-2xl
                `}
              >
                <div className="relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent 
                                translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 z-10"
                  />

                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.alt}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover object-center rounded 
                             transition-all duration-300 group-hover:brightness-110 group-hover:contrast-110"
                  />

                  <div
                    className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-cyan-400 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <div
                    className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-cyan-400 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <div
                    className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-cyan-400 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <div
                    className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-cyan-400 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <GradientAnimatedText className="text-2xl mt-16 mb-2 text-center font-bold tracking-tighter sm:text-3xl xl:text-4xl/none">
          Main Coordinators
        </GradientAnimatedText>
        <PersonCardList data={mainCoordinators} />

        <GradientAnimatedText className="text-2xl mt-8 mb-2 text-center font-bold tracking-tighter sm:text-3xl xl:text-4xl/none">
          Updates Leads
        </GradientAnimatedText>
        <PersonCardList data={updatesLeads} />

        <GradientAnimatedText className="text-2xl mt-10 mb-2 text-center font-bold tracking-tighter sm:text-3xl xl:text-4xl/none">
          Web Team
        </GradientAnimatedText>
        <PersonCardList data={webTeam} />

        <GradientAnimatedText className="text-2xl mt-10 mb-2 text-center font-bold tracking-tighter sm:text-3xl xl:text-4xl/none">
          Special Thanks
        </GradientAnimatedText>
        <PersonCardList data={specialThanks} />

        <GradientAnimatedText className="text-2xl mt-10 mb-2 text-center font-bold tracking-tighter sm:text-3xl xl:text-4xl/none">
          Marketing Team
        </GradientAnimatedText>
        <MarqueeTeams data={marketingTeam} />

        <GradientAnimatedText className="text-2xl mt-10 mb-2 text-center font-bold tracking-tighter sm:text-3xl xl:text-4xl/none">
          Graphics Team
        </GradientAnimatedText>
        <MarqueeTeams data={graphicsTeam} />

        <GradientAnimatedText className="text-2xl mt-10 mb-2 text-center font-bold tracking-tighter sm:text-3xl xl:text-4xl/none">
          Decoration Team
        </GradientAnimatedText>
        <MarqueeTeams data={decorationTeam} />
      </div>
    </div>
  )
}

const PersonCardList = ({ data }: { data: PersonProps[] }) => {
  return (
    <div className={cn("grid grid-cols-3 mx-8 mt-6 gap-3 md:gap-6 md:grid-cols-3 md:max-w-xl md:mx-auto")}>
      {data.map((person, index) => {
        return (
          <div className="mx-auto group cursor-pointer" key={person.image}>
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md opacity-0 
                            group-hover:opacity-100 transition-opacity duration-300 scale-110"
              />

              <Image
                alt={person.name}
                src={`/photos/${person.image ? person.image : "avatar.png"}`}
                width={512}
                height={512}
                className="rounded-full shadow-lg shadow-cyan-400/15 border-2 border-cyan-400/50 
                         mx-auto size-20 md:size-28 object-cover object-center relative z-10
                         transition-all duration-300 group-hover:border-cyan-400 group-hover:scale-105
                         group-hover:shadow-cyan-400/30"
                loading="lazy"
              />

              <div
                className="absolute top-0 left-0 w-2 h-2 border-l border-t border-cyan-400 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div
                className="absolute top-0 right-0 w-2 h-2 border-r border-t border-cyan-400 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>

            <p
              className="text-center text-cyan-300/70 text-sm w-20 md:w-28 mx-auto mt-2 mb-6 capitalize
                         group-hover:text-cyan-300 transition-colors duration-300"
            >
              {person.name}
            </p>
          </div>
        )
      })}
    </div>
  )
}

const MarqueeTeams = ({ data }: { data: PersonProps[] }) => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black"></div>
      </div>
      <Marquee pauseOnHover className="[--duration:22s] max-w-7xl mx-auto">
        {data.map((person) => (
          <div className="mx-auto group cursor-pointer" key={person.image}>
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full bg-cyan-400/10 blur-md opacity-0 
                            group-hover:opacity-100 transition-opacity duration-300 scale-110"
              />

              <Image
                alt={person.name}
                src={`/photos/${person.image ? person.image : "avatar.png"}`}
                width={512}
                height={512}
                className="rounded-full border-2 border-cyan-300/50 mx-auto size-16 md:size-24 
                         object-cover object-center relative z-10
                         transition-all duration-300 group-hover:border-cyan-400 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <p
              className="text-center w-20 md:w-28 text-cyan-300/70 text-sm mt-2 mb-6 capitalize
                         group-hover:text-cyan-300 transition-colors duration-300"
            >
              {person.name}
            </p>
          </div>
        ))}
      </Marquee>
    </div>
  )
}

export default page
