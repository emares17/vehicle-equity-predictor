import { Car, CheckCircle2, ClipboardList, TrendingUp } from 'lucide-react';
import VehicleDetailsForm from '../forms/VehicleDetailsForm';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

/**
 * Displays the fetched vehicle details from the VIN entered by the user.
 * Provides a summary of the next steps in the process.
 * The functionality in this page is inside the VehicleDetailsForm component.
 */

export default function VehicleDetails() {

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header/>

      <div className="flex-1 bg-slate-900 flex items-center justify-center py-16">
        <div className="max-w-3xl mx-auto px-8 w-full">
          {/* Main Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 mb-6">
            <div className="text-center mb-12">
              {/* Success Icon */}
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
                  <Car className="w-3 h-3 text-slate-900" />
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                We Found Your Vehicle!
              </h1>
              <p className="text-lg text-slate-400">
                Please confirm the details below are correct
              </p>
            </div>
            
            {/* Vehicle Details Form */}
            <div className="bg-slate-900/50 rounded-xl p-6 mb-8 border border-slate-700/30">
              <VehicleDetailsForm/>
            </div>
          </div>   
          
          {/* What's Next Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mr-3">
                <span className="text-slate-900 text-sm font-bold">→</span>
              </div>
              What's Next?
            </h3>
            
            <div className="space-y-4">
              {/* Step 2 - Active */}
              <div className="flex items-center p-4 bg-slate-700/30 rounded-xl border border-amber-500/30">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mr-4 shadow-lg shadow-amber-500/20">
                  <span className="text-slate-900 text-base font-bold">2</span>
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-base text-white font-medium">Provide additional vehicle details</span>
                  <ClipboardList className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              
              {/* Step 3 - Upcoming */}
              <div className="flex items-center p-4 bg-slate-700/10 rounded-xl border border-slate-700/30">
                <div className="w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center mr-4">
                  <span className="text-slate-400 text-base font-bold">3</span>
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-base text-slate-400">View your value prediction analysis</span>
                  <TrendingUp className="w-5 h-5 text-slate-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
}