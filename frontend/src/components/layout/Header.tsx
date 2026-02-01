export default function Header() {
  return (
    <div className="relative w-full h-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b-2 border-amber-500/30 overflow-hidden">
      {/* Animated background stripes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-shimmer"></div>
      </div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)', backgroundSize: '50px 50px'}}>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 h-full relative z-10">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-4 group">
            {/* Logo icon */}
            <div className="relative">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 transition-transform duration-300 group-hover:scale-105">
                <svg className="w-7 h-7 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
            </div>
            
            {/* Brand text */}
            <div>
              <div className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                ValueTrack
              </div>
              <div className="text-xs text-amber-500/70 tracking-wider uppercase -mt-1">
                AI-Powered Predictions
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-800/50 border border-amber-500/20">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-sm text-amber-100/80">Live Data</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  );
}