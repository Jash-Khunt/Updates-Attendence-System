/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils"
import { Marquee } from "@/components/magicui/marquee"

const securityAlerts = [
  {
    name: "Firewall-Alpha",
    username: "@fw_alpha",
    body: "Intrusion attempt blocked. Neural network patterns detected and neutralized successfully.",
    img: "/cybersecurity-shield-icon.png",
  },
  {
    name: "Quantum-Guard",
    username: "@q_guard",
    body: "Encryption protocols updated. 256-bit quantum resistance now active across all channels.",
    img: "/quantum-security-lock.png",
  },
  {
    name: "Threat-Hunter",
    username: "@t_hunter",
    body: "Advanced persistent threat eliminated. Behavioral analysis prevented data exfiltration.",
    img: "/cyber-threat-detection.png",
  },
  {
    name: "Bio-Auth",
    username: "@bio_auth",
    body: "Biometric verification complete. Multi-factor authentication secured all access points.",
    img: "/biometric-fingerprint-scanner.png",
  },
  {
    name: "Neural-Net",
    username: "@neural_ai",
    body: "Machine learning model updated. Threat prediction accuracy increased to 99.97%.",
    img: "/ai-neural-network-brain.png",
  },
  {
    name: "Crypto-Shield",
    username: "@crypto_sh",
    body: "Zero-knowledge proof verified. Anonymous transactions secured with quantum encryption.",
    img: "/cryptocurrency-blockchain-security.png",
  },
]

const firstRow = securityAlerts.slice(0, Math.ceil(securityAlerts.length / 2))
const secondRow = securityAlerts.slice(Math.ceil(securityAlerts.length / 2))
const thirdRow = securityAlerts.slice(0, Math.ceil(securityAlerts.length / 2))
const fourthRow = securityAlerts.slice(Math.ceil(securityAlerts.length / 2))

const SecurityCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-fit sm:w-36 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-green-400/30 bg-gray-900/50 hover:bg-gray-800/70 shadow-[0_0_15px_rgba(0,255,65,0.1)]",
        "hover:border-green-400 hover:shadow-[0_0_25px_rgba(0,255,65,0.2)] transition-all duration-300",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img
          className="rounded-full border border-green-400/50"
          width="32"
          height="32"
          alt=""
          src={img || "/placeholder.svg"}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-green-400 font-mono">{name}</figcaption>
          <p className="text-xs font-medium text-green-300/60 font-mono">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-green-300/80 font-mono leading-relaxed">{body}</blockquote>
    </figure>
  )
}

export function Marquee3D() {
  return (
    <div className="relative flex h-96 w-full flex-row items-center justify-center gap-4 overflow-hidden [perspective:300px]">
      <div
        className="flex flex-row items-center gap-4"
        style={{
          transform:
            "translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)",
        }}
      >
        <Marquee pauseOnHover vertical className="[--duration:20s]">
          {firstRow.map((alert) => (
            <SecurityCard key={alert.username} {...alert} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:20s]" vertical>
          {secondRow.map((alert) => (
            <SecurityCard key={alert.username} {...alert} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:20s]" vertical>
          {thirdRow.map((alert) => (
            <SecurityCard key={alert.username} {...alert} />
          ))}
        </Marquee>
        <Marquee pauseOnHover className="[--duration:20s]" vertical>
          {fourthRow.map((alert) => (
            <SecurityCard key={alert.username} {...alert} />
          ))}
        </Marquee>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black"></div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black"></div>
    </div>
  )
}
