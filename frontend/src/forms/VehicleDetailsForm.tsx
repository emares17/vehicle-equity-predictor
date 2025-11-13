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
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="flex items-center mb-6">
                <div className="w-24 h-16 bg-gray-300 rounded-md flex items-center justify-center mr-8">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-normal text-gray-900 leading-loose">
                    {vehicleData.year} {changeToTitleCase(vehicleData.make_name)} {changeToTitleCase(vehicleData.model_name)}
                  </h2>
                  <p className="text-lg text-gray-600 leading-7">{changeToTitleCase(vehicleData.trim)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 border-t border-gray-200 pt-6">
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Year</div>
                    <div className="text-lg text-gray-900 leading-7">{vehicleData.year}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Make</div>
                    <div className="text-lg text-gray-900 leading-7">{changeToTitleCase(vehicleData.make_name)}</div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Model</div>
                    <div className="text-lg text-gray-900 leading-7">{changeToTitleCase(vehicleData.model_name)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Trim</div>
                    <div className="text-lg text-gray-900 leading-7">{changeToTitleCase(vehicleData.trim)}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-8">
              <div className="flex items-start">
                <CheckCircle className="w-4 h-4 text-gray-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <div className="text-sm leading-tight mb-1">
                    <span className="text-gray-800 font-bold">VIN Verified: </span>
                    <span className="text-gray-800">{vehicleData.vin}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-none">
                    Vehicle details have been automatically populated from the NHTSA database.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mb-4">
              <button
                onClick={handleBackToVin}
                className="flex-1 h-12 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md flex items-center justify-center transition-colors duration-200"
              >
                <ArrowLeft className="w-3.5 h-4 mr-2" />
                Back to VIN Entry
              </button>
              <button
                onClick={handleContinue}
                className="flex-1 h-12 bg-gray-600 hover:bg-gray-700 text-white rounded-md flex items-center justify-center transition-colors duration-200"
              >
                Continue to Questionnaire
                <ArrowRight className="w-3.5 h-4 ml-2" />
              </button>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-500">Wrong vehicle? </span>
              <button
                onClick={handleBackToVin}
                className="text-sm text-gray-700 underline hover:text-gray-900"
              >
                Try a different VIN
              </button>
            </div> 
      </>
    );
}