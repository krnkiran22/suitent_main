"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/common/Button";
import { ArrowRight, Zap, Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-sui-dark">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
          {/* Hero Glow Background */}
          <div className="absolute inset-0 bg-hero-glow opacity-40" />
          
          {/* Animated Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sui-blue/10 border border-sui-blue/30 mb-8">
                <Sparkles size={16} className="text-sui-blue" />
                <span className="text-sm font-medium text-sui-blue">
                  Built on Sui Network
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white mb-6 leading-none">
                Intent-Based
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sui-blue to-blue-400">
                  Trading
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-sui-mist max-w-2xl mx-auto mb-12">
                Trade at the <span className="text-white font-semibold">Speed of Thought</span>.
                <br />
                Just tell us what you want to do.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/chat">
                  <Button size="lg" className="group">
                    Start Trading
                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/portfolio">
                  <Button size="lg" variant="secondary">
                    View Portfolio
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid md:grid-cols-3 gap-6 mt-32 max-w-5xl mx-auto"
            >
              {[
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  description: "Execute trades instantly with Sui's parallel processing"
                },
                {
                  icon: Shield,
                  title: "Self-Custody",
                  description: "Your keys, your coins. Powered by Turnkey MPC"
                },
                {
                  icon: Sparkles,
                  title: "AI-Powered",
                  description: "Natural language trading with Claude AI"
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-sui-blue/50 transition-all"
                >
                  <feature.icon className="text-sui-blue mb-4" size={32} />
                  <h3 className="text-lg font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sui-mist text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
