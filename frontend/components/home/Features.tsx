import { ArrowRightIcon } from "@/components/icons/HeroIcons";

const features = [
  {
    title: "Natural Language Swaps",
    description: "Type 'Swap 100 SUI for USDC' and let our AI handle the routing, slippage, and execution instantly.",
    icon: "💬"
  },
  {
    title: "Conditional Orders",
    description: "Set limit orders, DCA strategies, or stop-losses using plain English. No complex dashboards needed.",
    icon: "⚡"
  },
  {
    title: "Non-Custodial Security",
    description: "Your assets never leave your wallet until execution. Built on Sui's safe & fast infrastructure.",
    icon: "🛡️"
  }
];

export function Features() {
  return (
    <section className="relative w-full bg-sui-dark py-32 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Explore the <span className="text-sui-blue">SuiTent Ecosystem</span>
            </h2>
            <p className="text-sui-mist text-lg max-w-xl">
              The power of a professional trading terminal, accessible through a simple chat interface.
            </p>
          </div>
          <button className="text-white border-b border-sui-blue pb-1 hover:text-sui-blue transition-colors flex items-center gap-2">
            View Documentation <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-sui-blue/50 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-full bg-sui-blue/20 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-sui-mist leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
