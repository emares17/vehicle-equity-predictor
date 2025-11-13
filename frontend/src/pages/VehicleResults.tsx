import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ValueTimeline from '../components/layout/dashboard/ValueTimeline';
import KeyInsights from '../components/layout/dashboard/VehicleKeyInsights';
import axios from 'axios';
import { useVehicle } from "../context/VehicleDataContext";
import { useNavigate } from "react-router-dom";
import { Navigate } from 'react-router-dom';

// Defines the full prediction data fetched from the API, used in the ValueTimeline and VehicleKeyInsights components.
export interface PredictionData {
    id: string;
    vin: string;
    vehicle_data: any;
    user_inputs: any;
    prediction_results: any;
  }

/**
 * Renders the generated predictions for the user.
 * Fetches the generated results from the API after they have been stored in the DB.
 * The prediction data is then used to also populate the value timeline, and key insights.
 */  

export default function VehicleResults() {
  // Get the prediction ID from the URL.
  const { id } = useParams();
  // State to hold and set the prediction data.
  const [ prediction, setPrediction ] = useState<PredictionData | null>(null);
  const [ error, setError ] = useState('');
  const [ loading, setLoading ] = useState(true);
  // Provide access to vehicle data context and navigation
  const { vehicleData, clearVehicleData } = useVehicle();
  const navigate = useNavigate();


  // This effect runs to fetch the prediction from the backend API.
  useEffect(() => {
    const fetchPrediction = async() => {
      try {
        const response = await axios.get(`http://localhost:5000/api/results/${id}`);
        const data = response.data.data;
        setPrediction(data);
      } catch (error) {
        setError('Failed to load prediction results. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, [id]);

   if (!vehicleData) {
        return <Navigate to="/" replace />;
    }

  // Handler for return to home button, clear vehicle data and navigate.
    const handleBackToVin = (): void => {
        clearVehicleData();
        navigate('/');
    }

  // Helper function to format currency values
  const formatCurrencyValues = (value: number | undefined): string => {
    if (value === undefined) return '0.00';

    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  //  Helper function to format string into title case.
  const changeToTitleCase = (str: string | undefined): string => {
        if (!str) return '';

        return str.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header/>
      <div className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-4xl font-normal text-gray-900 leading-tight mb-3">
                    Your Vehicle Value Projection
                  </h1>
                  <p className="text-lg text-gray-600">
                  {prediction?.vehicle_data.year} {changeToTitleCase(prediction?.vehicle_data.make_name)} {changeToTitleCase(prediction?.vehicle_data.model_name)} {changeToTitleCase(prediction?.vehicle_data.trim_name)}
                  </p>
            </div>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                    <div className="text-base text-gray-600 mb-3">Current Value</div>
                    <div className="text-4xl font-normal text-gray-900 mb-3">
                      ${formatCurrencyValues(prediction?.prediction_results.current_value)}
                    </div>
                    <div className="text-sm text-gray-500">As of {new Date().toLocaleDateString()}</div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                    <div className="text-base text-gray-600 mb-3">Projected Value (5 Years)</div>
                    <div className="text-4xl font-normal text-gray-600 mb-3">
                      ${formatCurrencyValues(prediction?.prediction_results.future_values[4].value)}
                    </div>
                    <div className="text-sm text-gray-500">In 60 Months</div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                    <div className="text-base text-gray-600 mb-3">Expected Depreciation</div>
                    <div className="text-4xl font-normal text-gray-900 mb-3">
                      -${formatCurrencyValues((prediction?.prediction_results.current_value - prediction?.prediction_results.future_values[4].value))}
                    </div>
                    <div className="text-sm text-gray-500">Over 60 months</div>
                  </div>
              </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {prediction && <ValueTimeline prediction = {prediction}/>}

            {prediction && <KeyInsights prediction = {prediction}/>}
          </div>
          <div className="flex justify-end mb-4">
            <button
                onClick={handleBackToVin}
                className="px-6 h-12 bg-gray-600 hover:bg-gray-700 text-white rounded-md flex items-center justify-center transition-colors duration-200"
              >
                Generate New Prediction
            </button>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}