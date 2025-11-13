import { TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
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
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-normal text-gray-900 mb-2">
          Vehicle Insights
        </h2>
        <p className="text-sm text-gray-600">
          Factors affecting your vehicle's value
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-600 mb-1">Projected Annual Mileage</div>
            <div className="text-lg font-medium text-gray-900">
              ~{parseInt(prediction?.prediction_results.future_values[4].projected_mileage).toLocaleString()} mi
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Annual Depreciation</div>
            <div className="text-lg font-medium text-gray-900">
              ${formatCurrencyValues((prediction?.prediction_results.current_value - prediction?.prediction_results.future_values[4].value) / 5)}/yr
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start">
          <CheckCircle className="w-5 h-5 text-gray-600 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Mileage Impact
            </h3>
            <p className="text-xs text-gray-600">
              Your annual mileage of {formatCurrencyValues(prediction?.prediction_results.annual_mileage)} miles is 
              {prediction?.prediction_results.annual_mileage > 15000 ? ' above' : ' below'} average, 
              which {prediction?.prediction_results.annual_mileage > 15000 ? 'accelerates' : 'slows'} depreciation.
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <TrendingDown className="w-5 h-5 text-gray-600 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Depreciation Pattern
            </h3>
            <p className="text-xs text-gray-600">
              Most vehicles depreciate fastest in years 1-3. Your {prediction?.vehicle_data.year} model 
              is past the steepest decline period.
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-gray-600 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Value Retention Tips
            </h3>
            <p className="text-xs text-gray-600">
              Regular maintenance records, avoiding accidents, and keeping mileage moderate 
              can help preserve resale value.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}