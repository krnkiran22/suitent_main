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
    // Changed bg-sui-dark to bg-white
    <section className="relative w-full bg-white py-32 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            {/* Dark Text for White Background */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Explore the <span className="text-sui-blue">SuiTent Ecosystem</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-xl leading-relaxed">
              The power of a professional trading terminal, accessible through a simple chat interface.
            </p>
          </div>
          <button className="text-sui-blue border-b border-sui-blue/30 pb-1 hover:border-sui-blue font-semibold transition-colors flex items-center gap-2">
            View Documentation <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              // Light Card Styles: Gray background, Hover Shadow, Dark Text
              className="group p-10 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-xl hover:shadow-sui-blue/5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-2xl mb-8 group-hover:scale-110 transition-transform text-sui-blue">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
