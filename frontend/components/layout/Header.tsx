"use client";

import Link from "next/link";
import { ConnectButton } from "../wallet/ConnectButton"; 

export function Header() {
  const navLinks = ["Research", "Learn", "Build", "Ecosystem"];

  return (
    <header className="fixed top-8 left-0 right-0 z-50 flex justify-center w-full px-4">
      {/* The Glass Pill Container */}
      <div className="flex items-center gap-2 p-1.5 rounded-full bg-sui-dark/30 backdrop-blur-xl border border-white/10 shadow-2xl">
        
        {/* Logo Area */}
        <Link href="/" className="flex items-center justify-center w-10 h-10 bg-white rounded-full ml-1">
           {/* Simple abstract logo */}
           <div className="w-4 h-4 bg-sui-blue rounded-full"></div>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center px-4 gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link} 
              href={`/${link.toLowerCase()}`}
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              {link}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 pl-2">
            <Link href="/docs" className="px-4 py-2 text-sm font-semibold text-sui-dark bg-white rounded-full hover:bg-gray-100 transition-colors">
                Docs
            </Link>
            <div className="scale-90">
                <ConnectButton />
            </div>
        </div>
      </div>
    </header>
  );
}
