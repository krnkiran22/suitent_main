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

        {/* 2. Hero Content Layer (Bottom Left Alignment) */}
        <div className="relative z-10 flex-1 flex flex-col justify-end pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
          
          {/* Branding Title */}
          <div className="flex items-baseline gap-4 mb-2">
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-lg">
              SuiTent
              </h1>
              <span className="px-4 py-1 rounded-full border border-white/30 text-white/90 text-xs uppercase tracking-widest backdrop-blur-md">
              Intent Layer
              </span>
          </div>

          {/* Main Value Proposition */}
          <h2 className="text-4xl md:text-5xl font-light text-white/90 mb-8 max-w-2xl leading-tight">
            The First AI-Powered <br />
            <span className="text-sui-blue font-semibold">Intent Execution Engine</span> on Sui.
          </h2>

          {/* Informative Description (Addresses "people need to know what this is") */}
          <p className="text-lg md:text-xl text-sui-steel mb-10 max-w-xl leading-relaxed drop-shadow-md">
            Don&apos;t just swap. <strong>Speak.</strong> SuiTent translates your natural language into complex on-chain strategies, limit orders, and yield farming actions instantly.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-4">
              {/* Primary Action */}
              <button className="group flex items-center gap-3 px-8 py-4 bg-white text-sui-dark rounded-full text-lg font-bold hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  Start Trading
                  <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Secondary Action */}
              <button className="flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-lg font-medium hover:bg-white/20 transition-all">
                  <DocsIcon className="w-5 h-5" />
                  Read the Whitepaper
              </button>
          </div>

        </div>
      </main>
    </>
  );
}
