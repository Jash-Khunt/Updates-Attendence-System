import { MatrixBackground } from "@/components/matrix-background"
import { InteractiveLogo } from "@/components/interactive-logo"
import { CyberpunkNav } from "@/components/cyberpunk-nav"
import { DecryptionText } from "@/components/decryption-text"
import { InteractiveText } from "@/components/interactive-text"
import FingerprintScanner from "@/components/fingerprint-scanner"
import InteractiveEvent from "@/components/interactive-event"
import FeaturedEvents from "@/components/FeaturedEvents"
import SponserSection from "@/components/SponserSection"
import { ChatWidget } from "@/components/chat-widget"



import Link from "next/link"

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Matrix background effect */}
      <MatrixBackground />

     

      {/* Main content */}
      <div className="relative z-10">
        <section id="home" className="min-h-screen flex items-center justify-center relative">
          <div className="text-center">
            <InteractiveLogo />
            <div className="mt-8">
              <InteractiveText variant="access">
                <DecryptionText
                  text="CYBERPUNK UPDATES SYSTEM"
                  className="text-primary text-xl font-mono"
                  delay={1000}
                />
              </InteractiveText>
            </div>
            <div className="mt-8">
              <FingerprintScanner className="hover:scale-105 transition-transform duration-300" />
            </div>
          </div>
        </section>

        <section id="about" className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-4xl mx-auto text-center">
            
          <SponserSection/>
          </div>
        </section>
          
        <section id="updates" className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-6xl mx-auto">
            
            
              <FeaturedEvents/>
           
            

          </div>
        </section>
      </div>
      
<ChatWidget/>
    </main>
  )
}
