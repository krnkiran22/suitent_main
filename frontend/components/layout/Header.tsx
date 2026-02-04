"use client";
import Link from "next/link";
import { ConnectButton } from "../wallet/ConnectButton"; 

export function Header() {
  const navLinks = ["Swap", "Intent", "Demo"];

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center w-full px-4 pointer-events-none">
      
      {/* GLASS PILL CONTAINER */}
      {/* Added 'min-w-[320px] md:min-w-[600px]' to stop collapsing */}
      <div className="pointer-events-auto flex items-center justify-between min-w-[320px] md:min-w-[600px] py-2 pl-2 pr-2 rounded-full bg-[#0a0a0f]/60 backdrop-blur-xl border border-white/10 shadow-2xl">
        
        {/* LEFT: Logo & Links */}
        <div className="flex items-center gap-8">
            {/* Logo Circle */}
            <Link href="/" className="flex items-center justify-center w-10 h-10 bg-white rounded-full ml-1 hover:scale-105 transition-transform">
               <div className="w-4 h-4 bg-sui-blue rounded-full"></div>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
                <Link 
                key={link} 
                href={`/${link.toLowerCase()}`}
                className="text-sm font-semibold text-white/80 hover:text-white transition-colors"
                >
                {link}
                </Link>
            ))}
            </nav>
        </div>

        {/* RIGHT: Connect Button (Styled like 'Docs') */}
        <div className="[&_button]:bg-white [&_button]:text-black [&_button]:px-5 [&_button]:py-2.5 [&_button]:rounded-full [&_button]:font-bold [&_button]:text-xs [&_button]:hover:bg-gray-200 [&_button]:transition-colors">
            <ConnectButton />
        </div>
      </div>
    </header>
  );
}
