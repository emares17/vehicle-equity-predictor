import { ArrowLeft, Car, Info, Lock} from 'lucide-react';
import { useVehicle } from "../context/VehicleDataContext";
import { useNavigate } from "react-router-dom";
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import VehicleUserQuestionnaire from '../forms/VehicleUserQuestionnaire';

export default function VehicleQuestionnaire() {
    const { vehicleData, clearVehicleData } = useVehicle();
    const navigate = useNavigate();

    if (!vehicleData) {
        navigate('/');
        return null;
    }

    const handleBackToVin = () => {
        clearVehicleData();
        navigate('/');
    };

    const changeToTitleCase = (str: string | undefined): string => {
        if (!str) return '';

        return str.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    }

  return (
    <div className="min-h-screen bg-white flex flex-col">
    <Header/>

    <div className="flex-1 bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-8">
          <button 
            onClick={handleBackToVin}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-3.5 h-4 mr-2" />
            <span className="text-base">Back to VIN Entry</span>
          </button>
          
          <h1 className="text-3xl font-normal text-gray-900 leading-9 mb-4">
            Vehicle Details & Loan Information
          </h1>
          <p className="text-lg text-gray-600 leading-7">
            Please provide the following information to calculate your vehicle equity projection
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
          <VehicleUserQuestionnaire/>

      
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Car className="w-6 h-4 text-gray-600 mr-3" />
                <h3 className="text-lg font-normal text-gray-900">Your Vehicle</h3>
              </div>
              <div className="bg-gray-100 rounded-lg h-32 mb-6 flex items-center justify-center">
                <p className="text-base text-gray-500">
                  {vehicleData.year} {changeToTitleCase(vehicleData.make_name)} {changeToTitleCase(vehicleData.model_name)} {changeToTitleCase(vehicleData.trim)}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-base text-gray-600">Year:</span>
                  <span className="text-base text-gray-900">{vehicleData.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base text-gray-600">Make:</span>
                  <span className="text-base text-gray-900">{changeToTitleCase(vehicleData.make_name)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base text-gray-600">Model:</span>
                  <span className="text-base text-gray-900">{changeToTitleCase(vehicleData.model_name)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base text-gray-600">Trim:</span>
                  <span className="text-base text-gray-900">{changeToTitleCase(vehicleData.trim)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base text-gray-600">VIN:</span>
                  <span className="text-sm text-gray-900">{vehicleData.vin}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <Lock className="w-3.5 h-3.5 mr-2" />
                  <span>Vehicle verified successfully</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="flex items-center mb-4">
                <Info className="w-3.5 h-3.5 text-gray-700 mr-2" />
                <h4 className="text-sm font-normal text-gray-700">Why we need this information</h4>
              </div>

              <ul className="space-y-2 text-xs text-gray-600">
                <li>• Mileage affects depreciation rate</li>
                <li>• Condition impacts current value</li>
                <li>• Loan details calculate payoff timeline</li>
                <li>• Location affects regional market values</li>
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