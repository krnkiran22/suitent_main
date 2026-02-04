import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRightIcon, DocsIcon } from "@/components/icons/HeroIcons";
import { Features } from "@/components/home/Features";

export default function Home() {
  return (
    <>
      <Header />
      <main className="relative min-h-screen w-full flex flex-col bg-sui-dark overflow-x-hidden">
        
        {/* 1. HERO SECTION */}
        <section className="relative h-screen w-full flex flex-col items-center justify-center">
        
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
          {/* Gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-sui-dark/30 via-transparent to-sui-dark" />
        </div>

        {/* Content Layer */}
        {/* Added 'pt-20' to push content down away from navbar */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl px-4 pt-20">
          
          {/* Badge */}
          <div className="mb-6 animate-fade-in-up">
              <span className="px-4 py-1.5 rounded-full border border-sui-blue/30 bg-sui-blue/10 text-sui-blue text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-[0_0_20px_rgba(77,162,255,0.3)]">
              Intent Layer
              </span>
          </div>

          {/* Title */}
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white drop-shadow-2xl mb-6">
            SuiTent
          </h1>

          {/* Headline - Direct and Powerful */}
          <h2 className="text-5xl md:text-7xl font-bold text-[#4DA2FF] mb-8 leading-tight drop-shadow-[0_0_35px_rgba(77,162,255,0.6)]">
            Intent Engine <span className="text-white">on Sui.</span>
          </h2>

          {/* Description */}
          <p className="text-xl text-sui-steel mb-10 max-w-2xl font-medium drop-shadow-md bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5">
            Don&apos;t just swap. <span className="text-white font-bold">Speak.</span> SuiTent translates natural language into complex on-chain strategies instantly.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-5">
              <button className="group flex items-center gap-3 px-8 py-4 bg-sui-blue text-white rounded-full text-lg font-bold hover:bg-blue-500 transition-all shadow-[0_0_40px_rgba(77,162,255,0.4)] hover:scale-105">
                  Start Trading
                  <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>

              <button className="flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full text-lg font-semibold hover:bg-white/20 transition-all hover:scale-105">
                  <DocsIcon className="w-5 h-5" />
                  Read Whitepaper
              </button>
          </div>

        </div>
      </section>

      {/* 2. NEW FEATURES SECTION */}
      <Features />

      {/* 3. FOOTER */}
      <Footer />

    </main>
    </>
  );
}
