import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { ArrowRightIcon, DocsIcon } from "@/components/icons/HeroIcons";

export default function Home() {
  return (
    <>
      <Header />
      <main className="relative min-h-screen w-full flex flex-col overflow-hidden bg-sui-dark">
        
        {/* 1. Background Layer (The Generated Image) */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/suitentbg.png"
            alt="SuiTent Liquid Digital Landscape"
            fill
            priority
            className="object-cover object-[center_40%]"
            quality={100}
            style={{ transform: 'scale(1.1)' }}
          />
          {/* Gradient Overlay: Crucial for text visibility */}
          {/* Fades from transparent top to dark blue bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-sui-dark via-sui-dark/40 to-transparent" />
        </div>

        {/* 2. Hero Content Layer (Centered) */}
        <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center pb-32 px-4 max-w-5xl mx-auto w-full h-full">
          
          {/* Branding Title */}
          <div className="flex items-center justify-center gap-3 mb-6">
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white drop-shadow-2xl">
              SuiTent
              </h1>
              <span className="px-3 py-1 rounded-full border border-sui-blue/50 bg-sui-blue/10 text-sui-blue text-xs font-bold uppercase tracking-widest backdrop-blur-md">
              Intent Layer
              </span>
          </div>

          {/* Main Value Proposition */}
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 max-w-4xl leading-none drop-shadow-xl">
            The First AI-Powered <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sui-blue to-cyan-400">Intent Engine</span> on Sui.
          </h2>

          {/* Informative Description */}
          <p className="text-xl md:text-2xl text-sui-mist mb-12 max-w-2xl leading-relaxed font-medium drop-shadow-lg mx-auto">
            Don&apos;t just swap. <span className="text-white font-bold">Speak.</span> Translate natural language into complex on-chain strategies instantly.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
              {/* Primary Action */}
              <button className="group flex items-center gap-3 px-8 py-4 bg-sui-blue text-white rounded-full text-lg font-bold hover:bg-blue-500 transition-all shadow-lg shadow-sui-blue/30 hover:scale-105">
                  Start Trading
                  <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Secondary Action */}
              <button className="flex items-center gap-3 px-8 py-4 bg-white/5 backdrop-blur-lg border border-white/10 text-white rounded-full text-lg font-semibold hover:bg-white/10 transition-all hover:scale-105">
                  <DocsIcon className="w-5 h-5" />
                  Read Whitepaper
              </button>
          </div>

        </div>
      </main>
    </>
  );
}
