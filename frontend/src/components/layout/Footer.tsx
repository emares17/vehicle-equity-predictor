export default function Footer() {
  return (
    <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border-t-2 border-amber-500/30 py-12 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)', backgroundSize: '50px 50px'}}>
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <svg className="w-6 h-6 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
              </div>
              <div>
                <div className="text-lg font-bold text-amber-400">ValueTrack</div>
                <div className="text-xs text-amber-500/60 -mt-1">AI Predictions</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Powered by advanced machine learning to predict your vehicle's future value with precision.
            </p>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-slate-500">
              © 2024 ValueTrack. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-slate-600">Predictions updated in real-time</span>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
