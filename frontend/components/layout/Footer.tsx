import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#05060A] border-t border-white/5 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-sui-blue to-purple-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(77,162,255,0.3)]">
                 <div className="w-4 h-5 bg-white rounded-b-full"></div>
              </div>
              <span className="text-2xl font-black text-white tracking-tight">SuiTent</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              The first AI-powered intent engine on Sui. Trade at the speed of thought.
            </p>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-white font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/swap" className="hover:text-sui-blue transition-colors">Swap</Link></li>
              <li><Link href="/chat" className="hover:text-sui-blue transition-colors">Chat</Link></li>
              <li><Link href="/portfolio" className="hover:text-sui-blue transition-colors">Portfolio</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-sui-blue transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-sui-blue transition-colors">API Reference</Link></li>
              <li><Link href="#" className="hover:text-sui-blue transition-colors">Community</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Connect</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-sui-blue transition-colors">Twitter / X</Link></li>
              <li><Link href="#" className="hover:text-sui-blue transition-colors">Discord</Link></li>
              <li><Link href="#" className="hover:text-sui-blue transition-colors">GitHub</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">© 2026 SuiTent. Built for Sui HackMoney.</p>
          <div className="flex gap-6 text-xs text-gray-600">
            <Link href="#" className="hover:text-gray-400">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-400">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
