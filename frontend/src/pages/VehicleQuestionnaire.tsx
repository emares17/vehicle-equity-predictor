import { ArrowLeft, Car, Info, Lock} from 'lucide-react';
import { useVehicle } from "../context/VehicleDataContext";
import { useNavigate } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import VehicleQuestionnaireForm from '../forms/VehicleQuestionnaireForm';

/**
 * Renders the vehicle questionnaire for the user.
 * This page will display the questionnaire form and a brief vehicle summary.
 * The user inputs from this page will create the payload sent to the backend to generate a prediction.
 */

export default function VehicleQuestionnaire() {
  // Access and clear vehicle data
    const { vehicleData, clearVehicleData } = useVehicle();
    const navigate = useNavigate();
    // Check if there is vehicle data, else navigate home.
    if (!vehicleData) {
      return <Navigate to="/" replace />;
    }
    // Functionality for the back button, Clear vehicle data and navigate back home.
    const handleBackToVin = () => {
        clearVehicleData();
        navigate('/');
    };

    //  Helper function to format string into title case.
    const changeToTitleCase = (str: string | undefined): string => {
        if (!str) return '';

        return str.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header/>

      <div className="flex-1 bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-8">
            <button 
              onClick={handleBackToVin}
              className="flex items-center text-slate-400 hover:text-amber-400 mb-6 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="text-base">Back to VIN Entry</span>
            </button>
            
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Vehicle Questionnaire
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Please provide the following information to calculate your vehicle value projection
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <VehicleQuestionnaireForm/>

            <div className="space-y-6">
              {/* Vehicle Summary Card */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mr-3">
                    <Car className="w-5 h-5 text-slate-900" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Your Vehicle</h3>
                </div>
                
                {/* Vehicle Image Placeholder */}
                <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl h-32 mb-6 flex items-center justify-center border border-slate-600/30">
                  <p className="text-base text-slate-300 font-medium text-center px-4">
                    {vehicleData.year} {changeToTitleCase(vehicleData.make_name)} {changeToTitleCase(vehicleData.model_name)} {changeToTitleCase(vehicleData.trim)}
                  </p>
                </div>

                {/* Vehicle Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                    <span className="text-sm text-slate-400">Year:</span>
                    <span className="text-sm text-white font-medium">{vehicleData.year}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                    <span className="text-sm text-slate-400">Make:</span>
                    <span className="text-sm text-white font-medium">{changeToTitleCase(vehicleData.make_name)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                    <span className="text-sm text-slate-400">Model:</span>
                    <span className="text-sm text-white font-medium">{changeToTitleCase(vehicleData.model_name)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                    <span className="text-sm text-slate-400">Trim:</span>
                    <span className="text-sm text-white font-medium">{changeToTitleCase(vehicleData.trim)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-400">VIN:</span>
                    <span className="text-xs text-slate-300 font-mono">{vehicleData.vin}</span>
                  </div>
                </div>

                {/* Verification Badge */}
                <div className="pt-4 border-t border-slate-700/50">
                  <div className="flex items-center text-sm">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mr-3">
                      <Lock className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-green-400 font-medium">Vehicle verified successfully</span>
                  </div>
                </div>
              </div>

              {/* Info Card */}
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/30 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center mr-3">
                    <Info className="w-4 h-4 text-amber-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Why we need this</h4>
                </div>

                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-2">•</span>
                    <span>Mileage affects depreciation rate</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-2">•</span>
                    <span>Condition impacts current value</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-2">•</span>
                    <span>Exterior and interior color affect vehicle value</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-2">•</span>
                    <span>Location affects regional market values</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer/>
    </div>
  )
}