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
import { DollarSign, TrendingDown, Calendar, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header/>
      
      <div className="flex-1 bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-8">
          {/* Page Header */}
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mr-3">
                <Sparkles className="w-5 h-5 text-slate-900" />
              </div>
              <h1 className="text-4xl font-bold text-white leading-tight">
                Your Vehicle Value Projection
              </h1>
            </div>
            <p className="text-lg text-slate-400 ml-13">
              {prediction?.vehicle_data.year} {changeToTitleCase(prediction?.vehicle_data.make_name)} {changeToTitleCase(prediction?.vehicle_data.model_name)} {changeToTitleCase(prediction?.vehicle_data.trim_name)}
            </p>
          </div>

          {/* Value Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Current Value Card */}
            <div className="relative group bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 text-center overflow-hidden hover:border-green-500/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <div className="text-sm text-slate-400 uppercase tracking-wider mb-3 font-semibold">Current Value</div>
                <div className="text-4xl font-bold text-white mb-3">
                  ${formatCurrencyValues(prediction?.prediction_results.current_value)}
                </div>
                <div className="text-sm text-slate-500">As of {new Date().toLocaleDateString()}</div>
              </div>
            </div>

            {/* Projected Value Card */}
            <div className="relative group bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 text-center overflow-hidden hover:border-amber-500/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-amber-400" />
                  </div>
                </div>
                <div className="text-sm text-slate-400 uppercase tracking-wider mb-3 font-semibold">Projected Value (5 Years)</div>
                <div className="text-4xl font-bold text-slate-300 mb-3">
                  ${formatCurrencyValues(prediction?.prediction_results.future_values[4].value)}
                </div>
                <div className="text-sm text-slate-500">In 60 Months</div>
              </div>
            </div>

            {/* Expected Depreciation Card */}
            <div className="relative group bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 text-center overflow-hidden hover:border-red-500/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-red-400" />
                  </div>
                </div>
                <div className="text-sm text-slate-400 uppercase tracking-wider mb-3 font-semibold">Expected Depreciation</div>
                <div className="text-4xl font-bold text-white mb-3">
                  -${formatCurrencyValues((prediction?.prediction_results.current_value - prediction?.prediction_results.future_values[4].value))}
                </div>
                <div className="text-sm text-slate-500">Over 60 months</div>
              </div>
            </div>
          </div>

          {/* Timeline and Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {prediction && <ValueTimeline prediction={prediction}/>}
            {prediction && <KeyInsights prediction={prediction}/>}
          </div>

          {/* Action Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handleBackToVin}
              className="group relative px-8 h-14 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-900 font-bold rounded-xl flex items-center justify-center transition-all duration-300 overflow-hidden shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <span className="relative z-10 flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>Generate New Prediction</span>
              </span>
            </button>
          </div>
        </div>
      </div>
      
      <Footer/>
    </div>
  );
}