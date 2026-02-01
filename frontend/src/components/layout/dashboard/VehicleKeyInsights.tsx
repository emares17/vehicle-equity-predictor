import { TrendingDown, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';
import type { PredictionData } from '../../../pages/VehicleResults';

// Define the props for the component, which is the prediction data.
interface KeyInsightsProps {
    prediction: PredictionData;
}

// Fromat currency values; this shouldve been turned into a helper function as its used across multiple files
const formatCurrencyValues = (value: number | undefined): string => {
    if (value === undefined) return '0.00';

    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

// Displays a summary of key insights about the vehicle's value and depreciation factors.
export default function KeyInsights({ prediction }: KeyInsightsProps) {

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mr-3">
            <Lightbulb className="w-4 h-4 text-slate-900" />
          </div>
          <h2 className="text-xl font-bold text-white">
            Vehicle Insights
          </h2>
        </div>
        <p className="text-sm text-slate-400 ml-11">
          Factors affecting your vehicle's value
        </p>
      </div>

      {/* Stats Grid */}
      <div className="bg-slate-900/50 rounded-xl p-6 mb-6 border border-slate-700/30">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Projected Annual Mileage</div>
            <div className="text-lg font-bold text-white">
              ~{parseInt(prediction?.prediction_results.future_values[4].projected_mileage).toLocaleString()} mi
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Annual Depreciation</div>
            <div className="text-lg font-bold text-white">
              ${formatCurrencyValues((prediction?.prediction_results.current_value - prediction?.prediction_results.future_values[4].value) / 5)}/yr
            </div>
          </div>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {/* Mileage Impact */}
        <div className="flex items-start p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:border-green-500/30 transition-all duration-300">
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mr-4 flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-1">
              Mileage Impact
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your annual mileage of {formatCurrencyValues(prediction?.prediction_results.annual_mileage)} miles is 
              {prediction?.prediction_results.annual_mileage > 15000 ? ' above' : ' below'} average, 
              which {prediction?.prediction_results.annual_mileage > 15000 ? 'accelerates' : 'slows'} depreciation.
            </p>
          </div>
        </div>

        {/* Depreciation Pattern */}
        <div className="flex items-start p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:border-amber-500/30 transition-all duration-300">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mr-4 flex-shrink-0">
            <TrendingDown className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-1">
              Depreciation Pattern
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Most vehicles depreciate fastest in years 1-3. Your {prediction?.vehicle_data.year} model 
              is past the steepest decline period.
            </p>
          </div>
        </div>

        {/* Value Retention Tips */}
        <div className="flex items-start p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:border-blue-500/30 transition-all duration-300">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-4 flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-1">
              Value Retention Tips
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Regular maintenance records, avoiding accidents, and keeping mileage moderate 
              can help preserve resale value.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}