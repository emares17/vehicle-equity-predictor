import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { Search, FileText, BarChart3, Zap, Shield, TrendingUp } from 'lucide-react';
import VinForm from '../forms/VinForm';

/**
 * Home page component that includes a header, footer, and the vin form.
 * All functionality is in the VinForm component.
 */

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header/>
      
      <div className="flex-1">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 py-20 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500 rounded-full filter blur-[100px] animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-orange-500 rounded-full filter blur-[100px] animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-amber-600 rounded-full filter blur-[100px] animate-blob animation-delay-4000"></div>
          </div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" 
               style={{backgroundImage: 'linear-gradient(rgba(251,191,36,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,.1) 1px, transparent 1px)', backgroundSize: '50px 50px'}}>
          </div>
          
          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6 animate-fade-in">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-amber-400 font-medium">AI-Powered Vehicle Valuation</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6 animate-fade-in-up">
                Discover Your Vehicle's
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
                  Future Value
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 leading-relaxed mb-4 animate-fade-in-up animation-delay-200">
                See your projected vehicle value over a 5-year timeline
              </p>
              
              <p className="text-sm text-slate-500 leading-tight mb-12 animate-fade-in-up animation-delay-400">
                Enter your VIN to see your projected vehicle value 
              </p>
              
              <div className="max-w-md mx-auto animate-fade-in-up animation-delay-600">
                <VinForm/>
              </div>
              
              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-10 animate-fade-in animation-delay-800">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-slate-400">Bank-Grade Security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  <span className="text-sm text-slate-400">95% Accuracy Rate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-slate-400">Instant Results</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-slate-900 py-20 relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
          
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white leading-tight mb-4">
                How Vehicle Value Projections Works
              </h2>
              <p className="text-lg text-slate-400">
                Get accurate value projections in three simple steps
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group relative">
                {/* Connector line for desktop */}
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-amber-500/50 to-transparent -z-10"></div>
                
                <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 hover:border-amber-500/30 transition-all duration-300 hover:transform hover:-translate-y-1 h-full">
                  {/* Step number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-slate-900 shadow-lg shadow-amber-500/30">
                    01
                  </div>
                  
                  <div className="w-16 h-16 bg-slate-700/50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500/10 transition-colors duration-300">
                    <Search className="w-7 h-7 text-amber-400" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">
                    1. Enter Your VIN
                  </h3>
                  
                  <p className="text-base text-slate-400 leading-relaxed">
                    Simply enter your 17-character VIN and we'll automatically identify your vehicle's make, model, year, and trim.
                  </p>
                </div>
              </div>

              <div className="group relative">
                {/* Connector line for desktop */}
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-amber-500/50 to-transparent -z-10"></div>
                
                <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 hover:border-amber-500/30 transition-all duration-300 hover:transform hover:-translate-y-1 h-full">
                  {/* Step number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-slate-900 shadow-lg shadow-amber-500/30">
                    02
                  </div>
                  
                  <div className="w-16 h-16 bg-slate-700/50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500/10 transition-colors duration-300">
                    <FileText className="w-7 h-7 text-amber-400" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">
                    2. Quick Details
                  </h3>
                  
                  <p className="text-base text-slate-400 leading-relaxed">
                    Answer a few quick questions about your vehicle.
                  </p>
                </div>
              </div>

              <div className="group relative">
                <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 hover:border-amber-500/30 transition-all duration-300 hover:transform hover:-translate-y-1 h-full">
                  {/* Step number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-slate-900 shadow-lg shadow-amber-500/30">
                    03
                  </div>
                  
                  <div className="w-16 h-16 bg-slate-700/50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500/10 transition-colors duration-300">
                    <BarChart3 className="w-7 h-7 text-amber-400" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">
                    3. View Projections
                  </h3>
                  
                  <p className="text-base text-slate-400 leading-relaxed">
                    See your current and projected value with detailed timeline visualization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Section */}
        <div className="bg-slate-950 py-20 relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
          
          <div className="max-w-6xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white">
                Why Know Your Vehicle Value?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="relative group bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl border border-amber-500/20 p-8 hover:border-amber-400/40 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <h3 className="text-xl font-bold text-white mb-4 relative z-10">
                  Smart Financial Planning
                </h3>
                
                <p className="text-base text-slate-300 leading-relaxed relative z-10">
                  Understand your vehicle's future value to make informed decisions about refinancing, selling, or trading.
                </p>
              </div>
              
              <div className="relative group bg-gradient-to-br from-orange-500/10 to-amber-500/10 backdrop-blur-sm rounded-2xl border border-orange-500/20 p-8 hover:border-amber-400/40 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <h3 className="text-xl font-bold text-white mb-4 relative z-10">
                  Better Trade-in Timing
                </h3>
                
                <p className="text-base text-slate-300 leading-relaxed relative z-10">
                  Know the optimal time to trade in your vehicle to maximize your value and minimize losses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer/>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
          animation-fill-mode: both;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
          animation-fill-mode: both;
        }
        
        .animation-delay-800 {
          animation-delay: 0.8s;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}