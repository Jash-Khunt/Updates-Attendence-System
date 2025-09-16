"use client";
import Link from "next/link";
import SiginInButton from "./_components/SiginInButton";
import GradientAnimatedText from "../../../components/GradientAnimatedText";
import { MatrixBackground } from "../../../components/matrix-background";
import { DecryptionText } from "../../../components/decryption-text";
import FingerprintScanner from "../../../components/fingerprint-scanner";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function Signin() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "InvalidDomain") {
      setError(
        "ACCESS DENIED: Please login with your college ID (@scet.ac.in)"
      );
    }
  }, [searchParams]);

  return (
    <div className="w-full min-h-screen h-screen relative flex flex-col bg-black overflow-hidden">
      <MatrixBackground />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,rgba(0,255,204,0.03)_25px,rgba(0,255,204,0.03)_26px,transparent_27px,transparent_74px,rgba(0,255,204,0.03)_75px,rgba(0,255,204,0.03)_76px,transparent_77px),linear-gradient(rgba(0,255,204,0.03)_50%,transparent_50%)] bg-[size:100px_100px]"></div>

      <div className="flex-1 flex items-center justify-center z-10 relative">
        <div className="mx-auto grid w-[400px] gap-8 text-center relative">
          <div className="absolute -inset-4 border border-cyan-500/30 rounded-lg">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 rounded-br-lg"></div>
          </div>

          <div className="grid gap-4 p-8 bg-black/50 backdrop-blur-sm rounded-lg border border-cyan-500/20">
            <div className="grid gap-2">
              <GradientAnimatedText className="font-bold tracking-tighter text-4xl xl:text-5xl pt-4 pb-2">
                ACCESS TERMINAL
              </GradientAnimatedText>
              <DecryptionText
                text="AUTHENTICATE TO ENTER UPDATES 2K25 SYSTEM"
                className="text-cyan-400/80 text-sm font-mono"
              />
            </div>

            {error && (
              <div className="p-3 border border-red-500/50 bg-red-500/10 rounded-lg">
                <DecryptionText
                  text={error}
                  className="text-red-400 text-xs font-mono"
                />
              </div>
            )}

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-green-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <SiginInButton
                className="relative w-full bg-black border border-cyan-500/50 hover:border-cyan-400 text-cyan-400 hover:text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,204,0.5)]"
                text="INITIALIZE GOOGLE AUTH"
              />
            </div>

            <div className="mt-4 text-sm font-mono">
              <DecryptionText
                text="RETURN TO MAIN SYSTEM"
                className="text-cyan-400/60"
              />
              <br />
              <Link
                href="/"
                className="text-cyan-400 hover:text-white underline hover:shadow-[0_0_10px_rgba(0,255,204,0.5)] transition-all duration-300"
              >
                [HOME_DIRECTORY]
              </Link>
            </div>
            <div className="py-6">
              <FingerprintScanner />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
