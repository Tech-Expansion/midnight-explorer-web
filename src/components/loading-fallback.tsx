export function LoadingFallback() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo/icon */}
        <div className="relative">
          {/* Outer ring */}
          <div className="w-20 h-20 border-4 border-primary/20 rounded-full"></div>
          {/* Spinning ring */}
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
          {/* Inner pulse */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Text */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-semibold text-foreground">Midnight Explorer</h2>
          <p className="text-sm text-muted-foreground">✨ Exploring the midnight blockchain 🌙</p>
        </div>
      </div>
    </div>
  );
}
