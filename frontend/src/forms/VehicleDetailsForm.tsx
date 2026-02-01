import { useVehicle } from "../context/VehicleDataContext";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { CheckCircle, ArrowLeft, ArrowRight, Car } from 'lucide-react';

/**
 * Displays the vehicle details fetched from VIN entered by the user in the home page.
 * Provides options to go back to VIN entry or continue to the vehicle questionnaire.
 * If no vehicle data is present, redirects the user back to the home page.
 */

export default function VehicleDetailsForm() {
    // Provide access to vehicle data context and navigation
    const { vehicleData, clearVehicleData } = useVehicle();
    const navigate = useNavigate();

    // If no vehicle data, redirect to home page
    if (!vehicleData) {
        return <Navigate to="/" replace />;
    }

    // Handler for return to home button, clear vehicle data and navigate.
    const handleBackToVin = (): void => {
        clearVehicleData();
        navigate('/');
    }

    // Handler to continue to vehicle questionnaire page
    const handleContinue = (): void => {
      navigate('/vehicle-questionnaire');
    }

    // Helper function to convert strings to Title Case
    const changeToTitleCase = (str: string | undefined): string => {
      if (!str) return '';

      return str.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    }

    return (
       <>
        {/* Vehicle Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-24 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center mr-6 border border-slate-600/30">
              <Car className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white leading-tight">
                {vehicleData.year} {changeToTitleCase(vehicleData.make_name)} {changeToTitleCase(vehicleData.model_name)}
              </h2>
              <p className="text-lg text-slate-400 mt-1">{changeToTitleCase(vehicleData.trim)}</p>
            </div>
          </div>

          {/* Vehicle Details Grid */}
          <div className="grid grid-cols-2 gap-8 border-t border-slate-700/50 pt-6">
            <div className="space-y-6">
              <div>
                <div className="text-sm text-slate-500 mb-1 uppercase tracking-wider">Year</div>
                <div className="text-lg text-white font-medium">{vehicleData.year}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1 uppercase tracking-wider">Make</div>
                <div className="text-lg text-white font-medium">{changeToTitleCase(vehicleData.make_name)}</div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <div className="text-sm text-slate-500 mb-1 uppercase tracking-wider">Model</div>
                <div className="text-lg text-white font-medium">{changeToTitleCase(vehicleData.model_name)}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1 uppercase tracking-wider">Trim</div>
                <div className="text-lg text-white font-medium">{changeToTitleCase(vehicleData.trim)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* VIN Verification Badge */}
        <div className="bg-green-500/10 rounded-xl border border-green-500/20 p-4 mb-8">
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3 flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-sm leading-tight mb-1">
                <span className="text-green-400 font-bold">VIN Verified: </span>
                <span className="text-green-300 font-mono">{vehicleData.vin}</span>
              </div>
              <p className="text-xs text-green-400/70 leading-relaxed">
                Vehicle details have been automatically populated from the NHTSA database.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleBackToVin}
            className="flex-1 h-12 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl flex items-center justify-center transition-all duration-200 border border-slate-600/30 hover:border-slate-500/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to VIN Entry
          </button>
          <button
            onClick={handleContinue}
            className="group flex-1 h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-900 font-bold rounded-xl flex items-center justify-center transition-all duration-200 overflow-hidden relative shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40"
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative z-10 flex items-center">
              Continue to Questionnaire
              <ArrowRight className="w-4 h-4 ml-2" />
            </span>
          </button>
        </div>

        {/* Wrong Vehicle Link */}
        <div className="text-center">
          <span className="text-sm text-slate-500">Wrong vehicle? </span>
          <button
            onClick={handleBackToVin}
            className="text-sm text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors duration-200"
          >
            Try a different VIN
          </button>
        </div> 
      </>
    );
}