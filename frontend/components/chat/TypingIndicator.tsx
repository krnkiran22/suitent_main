export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-transparent border border-white/10 rounded-2xl rounded-tl-md px-4 py-3">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-sui-mist animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-sui-mist animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-sui-mist animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
