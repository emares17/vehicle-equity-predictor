import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, FileText, Car, Calendar } from 'lucide-react';
import { useVehicle } from "../context/VehicleDataContext";
import { useNavigate } from "react-router-dom";
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import EquityTimeline from '../components/layout/dashboard/EquityTimeline';
import KeyInsights from '../components/layout/dashboard/VehicleKeyInsights';

export default function App() {
  const [email, setEmail] = useState('');
  const { vehicleData, clearVehicleData } = useVehicle();
  const navigate = useNavigate();
  const location = useLocation();
  const { prediction, userInputs, vehicleInfo } = location.state || {};

  if (!vehicleData) {
        navigate('/');
        return null;
  }

  const handleEmailSubmit = () => {
    console.log('Email report to:', email);
  };

  const handleEmailResults = () => {
    console.log('Email results clicked');
  };

  const formatCurrencyValues = (value: number): string => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
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
          {/* Header Section */}
          <div className="flex justify-between items-start mb-8">
            <div>
              {userInputs.has_loan ? (
                <>
                  <h1 className="text-3xl font-normal text-gray-900 leading-9 mb-2">
                    Your Vehicle Equity Analysis
                  </h1>
                  <p className="text-base text-gray-600">
                  {vehicleInfo.year} {changeToTitleCase(vehicleInfo.make_name)} {changeToTitleCase(vehicleInfo.model_name)} {changeToTitleCase(vehicleData.trim)}
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-normal text-gray-900 leading-9 mb-2">
                    Your Vehicle Value Projection
                  </h1>
                  <p className="text-base text-gray-600">
                  {vehicleInfo.year} {changeToTitleCase(vehicleInfo.make_name)} {changeToTitleCase(vehicleInfo.model_name)} {changeToTitleCase(vehicleData.trim)}
                  </p>
                </>
              )}
            </div>
            <button
              onClick={handleEmailResults}
              className="flex items-center h-10 px-6 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email Results
            </button>
          </div>
          {userInputs.has_loan ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                  <div className="text-sm text-gray-600 mb-2">Current Equity</div>
                  <div className="text-3xl font-normal text-gray-900 mb-2">
                    $Pending
                  </div>
                  <div className="text-sm text-gray-500">As of Pending</div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                  <div className="text-sm text-gray-600 mb-2">Projected Equity at Payoff</div>
                  <div className="text-3xl font-normal text-gray-600 mb-2">
                    $Pending
                  </div>
                  <div className="text-sm text-gray-500">Pending</div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                  <div className="text-sm text-gray-600 mb-2">Equity Growth</div>
                  <div className="text-3xl font-normal text-gray-900 mb-2">
                    +$Pending
                  </div>
                  <div className="text-sm text-gray-500">Over Pending months</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                  <div className="text-sm text-gray-600 mb-2">Current Value</div>
                  <div className="text-3xl font-normal text-gray-900 mb-2">
                    ${formatCurrencyValues(prediction.data.current_value)}
                  </div>
                  <div className="text-sm text-gray-500">As of {new Date().toLocaleDateString()}</div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                  <div className="text-sm text-gray-600 mb-2">Projected Value (5 Years)</div>
                  <div className="text-3xl font-normal text-gray-600 mb-2">
                    ${formatCurrencyValues(prediction.data.future_values[4].value)}
                  </div>
                  <div className="text-sm text-gray-500">In 60 Months</div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                  <div className="text-sm text-gray-600 mb-2">Expected Depreciation</div>
                  <div className="text-3xl font-normal text-gray-900 mb-2">
                    -${formatCurrencyValues((prediction.data.current_value - prediction.data.future_values[4].value))}
                  </div>
                  <div className="text-sm text-gray-500">Over 60 months</div>
                </div>
              </div>
           </>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <EquityTimeline/>

            <KeyInsights/>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {userInputs.has_loan ? (
                <>
                  <div>
                    <div className="bg-gray-50 rounded-lg h-20 flex items-center justify-center mb-6">
                      <div className="text-center">
                        <FileText className="w-4 h-6 text-gray-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-700">Loan Details</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current Balance:</span>
                        <span className="text-gray-900">$Pending</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Monthly Payment:</span>
                        <span className="text-gray-900">$Pending</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Remaining Months:</span>
                        <span className="text-gray-900">Pending</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="bg-gray-50 rounded-lg h-20 flex items-center justify-center mb-6">
                      <div className="text-center">
                        <FileText className="w-4 h-6 text-gray-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-700">Loan Details</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current Balance:</span>
                        <span className="text-gray-900">Not Applicable</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Monthly Payment:</span>
                        <span className="text-gray-900">Not Applicable</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Remaining Months:</span>
                        <span className="text-gray-900">Not Applicable</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div>
                <div className="bg-gray-50 rounded-lg h-20 flex items-center justify-center mb-6">
                  <div className="text-center">
                    <Car className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-700">Vehicle Details</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current Value:</span>
                    <span className="text-gray-900">${formatCurrencyValues(prediction.data.current_value)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mileage:</span>
                    <span className="text-gray-900">{parseInt(userInputs.mileage).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Location:</span>
                    <span className="text-gray-900">{userInputs.city}</span>
                  </div>
                </div>
              </div>
              {userInputs.has_loan ? (
                <>
                  <div>
                    <div className="bg-gray-50 rounded-lg h-20 flex items-center justify-center mb-6">
                      <div className="text-center">
                        <Calendar className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-700">Projections</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Value at Payoff:</span>
                        <span className="text-gray-900">$Pending</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Final Mileage:</span>
                        <span className="text-gray-900">~Pending</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Payoff Date:</span>
                        <span className="text-gray-900">Pending</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="bg-gray-50 rounded-lg h-20 flex items-center justify-center mb-6">
                      <div className="text-center">
                        <Calendar className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-700">Projections</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Value in 5 Years:</span>
                        <span className="text-gray-900">${formatCurrencyValues(prediction.data.future_values[4].value)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Projected Mileage:</span>
                        <span className="text-gray-900">~{parseInt(prediction.data.future_values[4].projected_mileage).toLocaleString()} Miles</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Yearly Depreciation:</span>
                        <span className="text-gray-900">${formatCurrencyValues(((prediction.data.current_value - prediction.data.future_values[4].value) / 5))}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
            <h3 className="text-lg text-gray-900 mb-2">Want these results emailed to you?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Get a detailed PDF report with your equity analysis and insights.
            </p>
            <div className="flex max-w-2xl mx-auto gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 h-10 px-4 bg-white border border-gray-300 rounded-md focus:border-gray-500 focus:outline-none text-gray-900"
              />
              <button
                onClick={handleEmailSubmit}
                className="px-6 h-10 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200"
              >
                Send Report
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}