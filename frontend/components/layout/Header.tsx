"use client";
import Link from "next/link";
import { ConnectButton } from "../wallet/ConnectButton"; 

export function Header() {
  // Updated Links
  const navLinks = ["Swap", "Intent", "Demo"];

  return (
    <header className="fixed top-8 left-0 right-0 z-50 flex justify-center w-full px-4 pointer-events-none">
      {/* Pointer events auto re-enables clicking on the pill */}
      <div className="pointer-events-auto flex items-center gap-2 p-1.5 rounded-full bg-sui-dark/40 backdrop-blur-xl border border-white/10 shadow-2xl">
        
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center w-10 h-10 bg-white rounded-full ml-1">
           <div className="w-4 h-4 bg-sui-blue rounded-full"></div>
        </Link>

        {/* Updated Nav Links */}
        <nav className="hidden md:flex items-center px-6 gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link} 
              href={`/${link.toLowerCase()}`}
              className="text-sm font-semibold text-white/90 hover:text-[#4DA2FF] transition-colors tracking-wide"
            >
              {link}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 pl-2">
            <div className="scale-90">
                <ConnectButton />
            </div>
        </div>
      </div>
    </header>
  );
}
