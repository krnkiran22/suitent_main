export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-sui-dark">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sui-mist text-sm">
            © 2026 SuiTent. Built for HackMoney 2026.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sui-mist hover:text-white transition-colors text-sm">
              Docs
            </a>
            <a href="#" className="text-sui-mist hover:text-white transition-colors text-sm">
              Twitter
            </a>
            <a href="#" className="text-sui-mist hover:text-white transition-colors text-sm">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
