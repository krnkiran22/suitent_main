interface TokenBalanceItemProps {
  coinType: string;
  symbol: string;
  name: string;
  balance: string;
  iconUrl: string | null;
}

export function TokenBalanceItem({ symbol, name, balance, iconUrl }: TokenBalanceItemProps) {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/5 transition-colors">
      <div className="flex items-center gap-3">
        {/* Token Icon */}
        <div className="w-8 h-8 rounded-full bg-sui-blue/20 flex items-center justify-center overflow-hidden">
          {iconUrl ? (
            <img src={iconUrl} alt={symbol} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-bold text-sui-blue">{symbol[0]}</span>
          )}
        </div>
        
        {/* Token Info */}
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">{symbol}</span>
          <span className="text-xs text-gray-400">{name}</span>
        </div>
      </div>
      
      {/* Balance */}
      <div className="text-right">
        <span className="text-sm font-bold text-white">{balance}</span>
      </div>
    </div>
  );
}
