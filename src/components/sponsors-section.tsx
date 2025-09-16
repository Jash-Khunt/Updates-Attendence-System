import { Card, CardContent } from "@/components/ui/card"

export function SponsorsSection() {
  const sponsors = {
    title: [
      { name: "CodeWinglet", logo: "/codewinglet-logo.png" },
      { name: "V.S. Overseas", logo: "/vs-overseas-logo.png" },
    ],
    tech: [{ name: "MSI", logo: "/msi-logo.png" }],
    co: [{ name: "IMS", logo: "/ims-trusted-for-success-logo.png" }],
    gifting: [{ name: "LA MONT PERFUMES", logo: "/la-mont-perfumes-logo.png" }],
    supportive: [
      { name: "SOLEX ENERGY", logo: "/solex-energy-logo.png" },
      { name: "CRDMY ELECTRICALS", logo: "/crdmy-electricals-logo.png" },
      { name: "HARSH ENTERPRISES", logo: "/harsh-enterprises-samsung-logo.png" },
      { name: "CHAPARTHON", logo: "/chaparthon-logo.png" },
    ],
  }

  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-gray-900/5 to-black/30" />
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Title Sponsors */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-teal-300 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-6 font-mono tracking-wider">
            Title Sponsors
          </h2>
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {sponsors.title.map((sponsor, index) => (
              <Card key={index} className="bg-white p-6 hover:scale-105 transition-transform duration-300">
                <CardContent className="p-0">
                  <img
                    src={sponsor.logo || "/placeholder.svg"}
                    alt={sponsor.name}
                    className="h-20 w-auto object-contain"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tech Partner & Co Sponsor */}
        <div className="grid md:grid-cols-2 gap-16 mb-16">
          <div className="text-center">
            <h3 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-teal-300 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-6 font-mono tracking-wider">
             
              Tech Partner
            </h3>
            <Card className="bg-white p-6 hover:scale-105 transition-transform duration-300 inline-block">
              <CardContent className="p-0">
                <img
                  src={sponsors.tech[0].logo || "/placeholder.svg"}
                  alt={sponsors.tech[0].name}
                  className="h-16 w-auto object-contain"
                />
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
             <h3 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-teal-300 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-6 font-mono tracking-wider">
             
              Co Sponsor
            </h3>
            <Card className="bg-white p-6 hover:scale-105 transition-transform duration-300 inline-block">
              <CardContent className="p-0">
                <img
                  src={sponsors.co[0].logo || "/placeholder.svg"}
                  alt={sponsors.co[0].name}
                  className="h-16 w-auto object-contain"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Gifting Sponsor */}
        <div className="text-center mb-16">
           <h3 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-teal-300 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-6 font-mono tracking-wider">
             
            Gifting Sponsor
          </h3>
          <Card className="bg-white p-6 hover:scale-105 transition-transform duration-300 inline-block">
            <CardContent className="p-0">
              <img
                src={sponsors.gifting[0].logo || "/placeholder.svg"}
                alt={sponsors.gifting[0].name}
                className="h-16 w-auto object-contain"
              />
            </CardContent>
          </Card>
        </div>

        {/* Supportive Sponsors */}
        <div className="text-center">
           <h3 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-teal-300 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-6 font-mono tracking-wider">
             
            Supportive Sponsors
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            {sponsors.supportive.map((sponsor, index) => (
              <Card key={index} className="bg-white p-4 hover:scale-105 transition-transform duration-300">
                <CardContent className="p-0">
                  <img
                    src={sponsor.logo || "/placeholder.svg"}
                    alt={sponsor.name}
                    className="h-12 w-auto object-contain"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
