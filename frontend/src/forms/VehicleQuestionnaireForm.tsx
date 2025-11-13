import React, { useState } from 'react';
import { Car } from 'lucide-react';
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
    const { vehicleData, clearVehicleData } = useVehicle();
    const navigate = useNavigate();

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
            const response = await axios.post('http://localhost:5000/api/predict', vehicleDataPayload);

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
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-8 pb-8 border-b border-gray-200">
                  <div className="flex items-center mb-6">
                    <Car className="w-4 h-4 text-gray-600 mr-2" />
                    <h2 className="text-lg font-normal text-gray-900">Vehicle Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Current Odometer Reading
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.mileage}
                          onChange={(e) => handleInputChange('mileage', e.target.value)}
                          className="w-full h-12 px-4 bg-white border border-gray-300 rounded-md focus:border-gray-500 focus:outline-none text-gray-900"
                        />
                        <span className="absolute right-4 top-3 text-base text-gray-500">miles</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Zip Code
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.zip}
                          placeholder='Enter Zip Code'
                          onChange={(e) => handleInputChange('zip', e.target.value)}
                          className="w-full h-12 px-4 bg-white border border-gray-300 rounded-md focus:border-gray-500 focus:outline-none text-gray-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Exterior Color
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.exterior_color}
                          placeholder='Enter Exterior Color'
                          onChange={(e) => handleInputChange('exterior_color', e.target.value)}
                          className="w-full h-12 px-4 bg-white border border-gray-300 rounded-md focus:border-gray-500 focus:outline-none text-gray-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Interior Color
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.interior_color}
                          placeholder='Enter Interior Color'
                          onChange={(e) => handleInputChange('interior_color', e.target.value)}
                          className="w-full h-12 px-4 bg-white border border-gray-300 rounded-md focus:border-gray-500 focus:outline-none text-gray-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        First Owner?
                      </label>
                      <select
                        value={formData.first_owner ? 'yes' : 'no'}
                        onChange={(e) => handleInputChange('first_owner', e.target.value === 'yes')}
                        className="w-full h-12 px-3 bg-white border border-gray-300 rounded-md focus:border-gray-500 focus:outline-none text-gray-800 appearance-none"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Frame Damage?
                      </label>
                      <select
                        value={formData.frame_damage ? 'yes' : 'no'}
                        onChange={(e) => handleInputChange('frame_damage', e.target.value === 'yes')}
                        className="w-full h-12 px-3 bg-white border border-gray-300 rounded-md focus:border-gray-500 focus:outline-none text-gray-800 appearance-none"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Previous Accidents?
                      </label>
                      <select
                        value={formData.has_accidents ? 'yes' : 'no'}
                        onChange={(e) => handleInputChange('has_accidents', e.target.value === 'yes')}
                        className="w-full h-12 px-3 bg-white border border-gray-300 rounded-md focus:border-gray-500 focus:outline-none text-gray-800 appearance-none"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Salvage Title?
                      </label>
                      <select
                        value={formData.salvage_title ? 'yes' : 'no'}
                        onChange={(e) => handleInputChange('salvage_title', e.target.value === 'yes')}
                        className="w-full h-12 px-3 bg-white border border-gray-300 rounded-md focus:border-gray-500 focus:outline-none text-gray-800 appearance-none"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Theft Title?
                      </label>
                      <select
                        value={formData.theft_title ? 'yes' : 'no'}
                        onChange={(e) => handleInputChange('theft_title', e.target.value === 'yes')}
                        className="w-full h-12 px-3 bg-white border border-gray-300 rounded-md focus:border-gray-500 focus:outline-none text-gray-800 appearance-none"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full h-12 bg-gray-600 hover:bg-gray-700 text-white text-lg font-normal rounded-md transition-colors duration-200"
                >
                  Calculate My Vehicle Value
                </button>
              </form>
            </div>
        </div>
    )
}