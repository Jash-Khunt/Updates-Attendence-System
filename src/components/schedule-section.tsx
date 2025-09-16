import { HyperText } from "@/components/magicui/hyper-text"
import { Card, CardContent } from "@/components/ui/card"

export function ScheduleSection() {
  const scheduleData = {
    friday: {
      date: "FRIDAY 20/09/2024",
      events: [
        {
          time: "8:30 A.M. - 10:30 A.M.",
          event: "DEV BATTLE\nROUND ( 1 , 2 )\nCO - PHASE ( 1 , 2 , 3 )",
          color: "bg-purple-500",
        },
        {
          time: "10:30 A.M. - 11:30 A.M.",
          event: "STOCK X STAKE - ROUND ( 1 )\n( C - 202 , 203 , 204 )",
          color: "bg-pink-500",
        },
        {
          time: "11:30 A.M. - 12:30 P.M.",
          event: "CINEVERSE\nROUND ( 1 )\n( C - 202 , 203 ,\n204 )",
          color: "bg-gray-400",
        },
        { time: "12:30 P.M. - 1:00 P.M.", event: "DATA LOOM - ROUND ( 1 )\nCO - PHASE ( 1 , 2)", color: "bg-blue-500" },
        { time: "1:00 P.M. - 1:30 P.M.", event: "L\nU\nN\nC\nH", color: "bg-yellow-400" },
        {
          time: "1:30 P.M. - 2:30 P.M.",
          event: "ESCAPE\nROOM\nROUND ( 1 )\nCO - PHASE\n( 3 , 2)",
          color: "bg-green-500",
        },
        { time: "2:30 P.M. - 3:30 P.M.", event: "HUMAN OR AI - ROUND ( 1 )\n( C - 201 , 202 )", color: "bg-red-500" },
        { time: "3:30 P.M. - 4:30 P.M.", event: "MEME FEST\nROUND ( 1 )\n( C - 203 , 204 )", color: "bg-purple-400" },
      ],
    },
    saturday: {
      date: "SATURDAY 21/09/2024",
      events: [
        {
          time: "9:00 A.M. - 10:00 A.M.",
          event: "SPLIT OR STEAL - ROUND ( 1 )\n( C - 203 , 204 )",
          color: "bg-green-400",
        },
        { time: "10:00 A.M. - 11:00 A.M.", event: "DATA LOOM -\nROUND ( 2 ) CO -\nPHASE ( 3 )", color: "bg-blue-400" },
        { time: "11:00 A.M. - 12:00 P.M.", event: "STOCK X STAKE\nROUND ( 2 )\n( C - 204 )", color: "bg-pink-400" },
        { time: "12:00 P.M. - 1:00 P.M.", event: "CINEVERSE\nROUND ( 2 )\n( C - 204 )", color: "bg-gray-300" },
        { time: "1:00 P.M. - 1:30 P.M.", event: "B\nR\nE\nA\nK", color: "bg-yellow-300" },
        { time: "1:30 P.M. - 2:30 P.M.", event: "SPLIT OR\nSTEAL\nROUND ( 2 )\n( C - 203 )", color: "bg-green-300" },
        { time: "3:00 P.M. - 4:00 P.M.", event: "VALIDICTORY\nCEREMONY", color: "bg-blue-600" },
        { time: "4:00 P.M. - 5:00 P.M.", event: "", color: "bg-blue-600" },
      ],
    },
  }

  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-gray-900/5 to-black/30" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
           <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-teal-300 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-6 font-mono tracking-wider">
             
            Schedule
         </h1>
          <div className="bg-purple-600 text-white text-2xl font-bold py-4 rounded-lg mb-8">UPDATES 2K24</div>
        </div>

        <div className="space-y-12">
          {/* Friday Schedule */}
          <div className="bg-gray-900/50 rounded-lg p-6 border border-cyan-400/30">
            <div className="text-cyan-400 font-bold text-xl mb-4 font-mono">{scheduleData.friday.date}</div>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-2">
              {scheduleData.friday.events.map((event, index) => (
                <Card key={index} className={`${event.color} text-white border-0 min-h-[120px]`}>
                  <CardContent className="p-3 text-center">
                    <div className="text-xs font-bold mb-2 text-white">{event.time}</div>
                    <div className="text-xs whitespace-pre-line font-semibold">{event.event}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Saturday Schedule */}
          <div className="bg-gray-900/50 rounded-lg p-6 border border-cyan-400/30">
            <div className="text-cyan-400 font-bold text-xl mb-4 font-mono">{scheduleData.saturday.date}</div>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-2">
              {scheduleData.saturday.events.map((event, index) => (
                <Card key={index} className={`${event.color} text-white border-0 min-h-[120px]`}>
                  <CardContent className="p-3 text-center">
                    <div className="text-xs font-bold mb-2 text-white">{event.time}</div>
                    <div className="text-xs whitespace-pre-line font-semibold">{event.event}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
