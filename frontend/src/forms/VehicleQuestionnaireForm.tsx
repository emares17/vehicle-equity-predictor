import React, { useState } from 'react';
import { Car, AlertCircle } from 'lucide-react';
import { useVehicle } from "../context/VehicleDataContext";
import { useNavigate } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import axios from 'axios';

/**
 * Renders the user questionnaire form for vehicle data input.
 * This data will be combined with vehicle data fetched from the NHTSA API
 * to create the payload sent to the backend to generate the prediction.
 */

export default function VehicleQuestionnaireForm() {
  // State for form inputs, loading, and error handling
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { vehicleData } = useVehicle();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // Redirect to home if no vehicle data is present in the context
    if (!vehicleData) {
        return <Navigate to="/" replace />;
    }

    // Form state, will hold all user inputs from the form
    const [formData, setFormData] = useState({
        mileage: '',
        zip: '',
        exterior_color: '',
        interior_color: '',
        first_owner: false,
        frame_damage: false,
        has_accidents: false,
        salvage_title: false,
        theft_title: false,
    });

    // Handles changes to form inputs and updates the formData state
    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ 
            ...prev, 
            [field]: value === 'yes' ? true : value === 'no' ? false : value
        }));
    };

    // Handles form submission, constructs payload, and sends to backend
    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        // Constructs the final payload combining NHTSA vehicle data and user inputs.
        const vehicleDataPayload = {
            // NHTSA VIN LOOKUP data
            year: vehicleData.year || null,
            make_name: vehicleData.make_name?.toLowerCase() || 'unknown',
            model_name: vehicleData.model_name?.toLowerCase() || 'unknown',
            trim_name: vehicleData.trim?.toLowerCase() || 'unknown',
            body_type: vehicleData.body_type?.toLowerCase() || 'unknown',
            engine_type: vehicleData.engine_type?.toLowerCase() || 'unknown',
            fuel_type: vehicleData.fuel_type?.toLowerCase() || 'unknown',
            horsepower: vehicleData.horsepower || null,
            transmission: vehicleData.transmission?.toLowerCase() || "unknown",
            wheel_system_display: vehicleData.wheel_system_display?.toLowerCase() || 'unknown',

            // Fields required for model but not available from NHTSA API, setting to null to allow model to handle missing data
            torque: null,
            city_fuel_economy: null,
            highway_fuel_economy: null,
            combine_fuel_economy: null,

            // Form Inputs
            mileage: parseInt(formData.mileage.replace(/\D/g, '')),
            dealer_zip: formData.zip || '00000',
            exterior_color: formData.exterior_color.trim().toLowerCase() || 'unknown',
            interior_color: formData.interior_color.trim().toLowerCase() || 'unknown',
            exterior_color_base: formData.exterior_color.trim().toLowerCase() || 'unknown',
            interior_color_base: formData.interior_color.trim().toLowerCase() || 'unknown',
            owner_count: formData.first_owner ? 1 : 2,
            frame_damaged: formData.frame_damage ? 'TRUE' : 'FALSE',
            has_accidents: formData.has_accidents ? 'TRUE' : 'FALSE',
            salvage: formData.salvage_title ? 'TRUE' : 'FALSE',
            theft_title: formData.theft_title ? 'TRUE' : 'FALSE',
            is_new: vehicleData.year === new Date().getFullYear() ? 'TRUE' : 'FALSE',

            // Need to review this, model is trained with this but it doesnt apply here for all use cases.
            // Currently the model expects this field, but for improvement the model should be retrained without it.
            daysonmarket: 30,

            vin: vehicleData.vin
        };

        try {
            setIsLoading(true);
            setError('');
            const response = await axios.post(`${API_URL}/api/predict`, vehicleDataPayload);

            const prediction_id = response.data.prediction_id;
            // On successful submission, navigate to results page with the returned prediction ID
            navigate(`/results/${prediction_id}`);
        } catch (error) {
            setError('Failed to generate a prediction, please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
              <form onSubmit={handleSubmit}>
                <div className="mb-8 pb-8 border-b border-slate-700/50">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mr-3">
                      <Car className="w-5 h-5 text-slate-900" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Vehicle Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-slate-300 mb-2 font-medium">
                        Current Odometer Reading
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.mileage}
                          onChange={(e) => handleInputChange('mileage', e.target.value)}
                          className="w-full h-12 px-4 pr-16 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-amber-500 focus:outline-none text-white placeholder-slate-500 transition-all duration-300"
                          placeholder="0"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">miles</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-300 mb-2 font-medium">
                        Zip Code
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.zip}
                          placeholder='Enter Zip Code'
                          onChange={(e) => handleInputChange('zip', e.target.value)}
                          className="w-full h-12 px-4 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-amber-500 focus:outline-none text-white placeholder-slate-500 transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-300 mb-2 font-medium">
                        Exterior Color
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.exterior_color}
                          placeholder='Enter Exterior Color'
                          onChange={(e) => handleInputChange('exterior_color', e.target.value)}
                          className="w-full h-12 px-4 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-amber-500 focus:outline-none text-white placeholder-slate-500 transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-300 mb-2 font-medium">
                        Interior Color
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.interior_color}
                          placeholder='Enter Interior Color'
                          onChange={(e) => handleInputChange('interior_color', e.target.value)}
                          className="w-full h-12 px-4 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-amber-500 focus:outline-none text-white placeholder-slate-500 transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-300 mb-2 font-medium">
                        First Owner?
                      </label>
                      <select
                        value={formData.first_owner ? 'yes' : 'no'}
                        onChange={(e) => handleInputChange('first_owner', e.target.value === 'yes')}
                        className="w-full h-12 px-4 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-amber-500 focus:outline-none text-white appearance-none transition-all duration-300 cursor-pointer"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-300 mb-2 font-medium">
                        Frame Damage?
                      </label>
                      <select
                        value={formData.frame_damage ? 'yes' : 'no'}
                        onChange={(e) => handleInputChange('frame_damage', e.target.value === 'yes')}
                        className="w-full h-12 px-4 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-amber-500 focus:outline-none text-white appearance-none transition-all duration-300 cursor-pointer"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-300 mb-2 font-medium">
                        Previous Accidents?
                      </label>
                      <select
                        value={formData.has_accidents ? 'yes' : 'no'}
                        onChange={(e) => handleInputChange('has_accidents', e.target.value === 'yes')}
                        className="w-full h-12 px-4 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-amber-500 focus:outline-none text-white appearance-none transition-all duration-300 cursor-pointer"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-300 mb-2 font-medium">
                        Salvage Title?
                      </label>
                      <select
                        value={formData.salvage_title ? 'yes' : 'no'}
                        onChange={(e) => handleInputChange('salvage_title', e.target.value === 'yes')}
                        className="w-full h-12 px-4 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-amber-500 focus:outline-none text-white appearance-none transition-all duration-300 cursor-pointer"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-300 mb-2 font-medium">
                        Theft Title?
                      </label>
                      <select
                        value={formData.theft_title ? 'yes' : 'no'}
                        onChange={(e) => handleInputChange('theft_title', e.target.value === 'yes')}
                        className="w-full h-12 px-4 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-amber-500 focus:outline-none text-white appearance-none transition-all duration-300 cursor-pointer"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="flex items-start space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-6">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full h-14 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-900 text-lg font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40"
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Calculating...</span>
                      </>
                    ) : (
                      <span>Calculate My Vehicle Value</span>
                    )}
                  </span>
                </button>
              </form>
            </div>
        </div>
    )
}