"use client";
import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "../wallet/ConnectButton"; 

export function Header() {
  const navLinks = ["Swap", "Trade", "Chat", "Portfolio", "Orders", "History"];

  return (
    // 1. Fixed positioning z-50 ensures it's always on top of the Hero image
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center w-full px-4 pointer-events-none">
      
      {/* 2. The Glass Pill - Dark Background (bg-black/80) for maximum text visibility */}
      <div className="pointer-events-auto flex items-center justify-between min-w-[320px] md:min-w-[650px] py-3 px-5 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        
        {/* LEFT: Logo */}
        <div className="flex-shrink-0">
            <Link href="/" className="hover:scale-105 transition-transform">
               <Image 
                 src="/suitentlogo.png" 
                 alt="SuiTent Logo" 
                 width={40} 
                 height={40} 
                 className="rounded-full object-cover shadow-lg shadow-sui-blue/20"
               />
            </Link>
        </div>

        {/* CENTER: Nav Links - Always Visible with Z-Index */}
        <nav className="flex items-center justify-center gap-6 flex-1 relative z-20">
            {navLinks.map((link) => (
                <Link 
                key={link} 
                href={`/${link.toLowerCase()}`}
                className="text-base font-extrabold text-white hover:text-sui-blue transition-colors tracking-wide relative z-20"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
                >
                {link}
                </Link>
            ))}
        </nav>

        {/* RIGHT: Connect Button */}
        <div className="flex-shrink-0">
            {/* Style override to make the Turnkey button look like a white pill */}
            <div className="[&_button]:bg-white [&_button]:text-black [&_button]:px-6 [&_button]:py-2.5 [&_button]:rounded-full [&_button]:font-bold [&_button]:text-sm [&_button]:hover:bg-gray-200 [&_button]:transition-all [&_button]:shadow-lg">
                <ConnectButton />
            </div>
        </div>

      </div>
    </header>
  );
}
