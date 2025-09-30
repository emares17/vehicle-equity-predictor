import React, { useState } from 'react';
import { Car, DollarSign } from 'lucide-react';
import { useVehicle } from "../context/VehicleDataContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function VehicleUserQuestionnaire() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { vehicleData, clearVehicleData } = useVehicle();
    const navigate = useNavigate();

    if (!vehicleData) {
        navigate('/');
        return null;
    }

    const [formData, setFormData] = useState({
        mileage: '',
        city: '',
        exterior_color: '',
        interior_color: '',
        first_owner: false,
        frame_damage: false,
        has_accidents: false,
        salvage_title: false,
        theft_title: false,
        
        // Loan Analysis still needs to be implemented and added to payload
        has_loan: false,
        loanBalance: '',
        monthlyPayment: '',
        interestRate: '',
        remainingMonths: ''
    });

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ 
            ...prev, 
            [field]: value === 'yes' ? true : value === 'no' ? false : value
        }));
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        const vehicleDataPayload = {
            // NHTSA VIN LOOKUP data
            year: vehicleData.year || null,
            make_name: vehicleData.make_name?.toLowerCase() || 'Unknown',
            model_name: vehicleData.model_name?.toLowerCase() || 'Unknown',
            trim_name: vehicleData.trim?.toLowerCase() || 'Unknown',
            body_type: vehicleData.body_type?.toLowerCase() || 'Unknown',
            engine_type: vehicleData.engine_type?.toLowerCase() || 'Unknown',
            fuel_type: vehicleData.fuel_type?.toLowerCase() || 'Unknown',
            horsepower: vehicleData.horsepower || null,
            transmission: vehicleData.transmission?.toLowerCase() || "Unknown",
            wheel_system_display: vehicleData.wheel_system_display?.toLowerCase() || 'Unknown',

            torque: null,
            city_fuel_economy: null,
            highway_fuel_economy: null,
            combine_fuel_economy: null,

            // Form Inputs
            mileage: parseInt(formData.mileage),
            city: formData.city.toLowerCase() || 'Unknown',
            exterior_color: formData.exterior_color.toLowerCase() || 'Unknown',
            interior_color: formData.interior_color.toLowerCase() || 'Unknown',
            exterior_color_base: formData.exterior_color.toLowerCase() || 'Unknown',
            interior_color_base: formData.interior_color.toLowerCase() || 'Unknown',
            owner_count: formData.first_owner ? 1 : 2,
            frame_damaged: formData.frame_damage ? 'TRUE' : 'FALSE',
            has_accidents: formData.has_accidents ? 'TRUE' : 'FALSE',
            salvage: formData.salvage_title ? 'TRUE' : 'FALSE',
            theft_title: formData.theft_title ? 'TRUE' : 'FALSE',
            has_loan: formData.has_loan ? 'TRUE' : 'FALSE',

            is_new: vehicleData.year === new Date().getFullYear() ? 'TRUE' : 'FALSE',

            // Need to review this, model is trained with this but it doesnt apply here for all use cases.
            daysonmarket: 30
        };

        try {
            setIsLoading(true);
            const response = await axios.post('http://localhost:5000/api/predict', vehicleDataPayload);
            navigate('/results', { state: { 
              prediction: response.data,
              userInputs: formData,
              vehicleInfo: vehicleData
            } 
          });
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
                        City
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.city}
                          placeholder='Enter City'
                          onChange={(e) => handleInputChange('city', e.target.value)}
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

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Does this vehicle have a current loan?
                      </label>
                      <select
                        value={formData.has_loan ? 'yes' : 'no'}
                        onChange={(e) => handleInputChange('has_loan', e.target.value === 'yes')}
                        className="w-full h-12 px-3 bg-white border border-gray-300 rounded-md focus:border-gray-500 focus:outline-none text-gray-800 appearance-none"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                  </div>
                </div>

                {formData.has_loan && (
                  <div className="mb-8">
                    <div className="flex items-center mb-6">
                      <DollarSign className="w-5 h-4 text-gray-600 mr-2" />
                      <h2 className="text-lg font-normal text-gray-900">Loan Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Loan Balance
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-base text-gray-500">$</span>
                          <input
                            type="text"
                            value={formData.loanBalance}
                            onChange={(e) => handleInputChange('loanBalance', e.target.value)}
                            className="w-full h-12 pl-8 pr-4 bg-white border border-gray-300 rounded-md focus:border-gray-500 focus:outline-none text-gray-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Monthly Payment 
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-base text-gray-500">$</span>
                          <input
                            type="text"
                            value={formData.monthlyPayment}
                            onChange={(e) => handleInputChange('monthlyPayment', e.target.value)}
                            className="w-full h-12 pl-8 pr-4 bg-white border border-gray-300 rounded-md focus:border-gray-500 focus:outline-none text-gray-900"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Interest Rate
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.interestRate}
                            onChange={(e) => handleInputChange('interestRate', e.target.value)}
                            className="w-full h-12 px-4 bg-white border border-gray-300 rounded-md focus:border-gray-500 focus:outline-none text-gray-900"
                          />
                          <span className="absolute right-3 top-3 text-base text-gray-500">%</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Remaining Months
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.remainingMonths}
                            onChange={(e) => handleInputChange('remainingMonths', e.target.value)}
                            className="w-full h-12 px-4 bg-white border border-gray-300 rounded-md focus:border-gray-500 focus:outline-none text-gray-900"
                          />
                          <span className="absolute right-4 top-3 text-base text-gray-500">months</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full h-12 bg-gray-600 hover:bg-gray-700 text-white text-lg font-normal rounded-md transition-colors duration-200"
                >
                  Calculate My Vehicle Equity
                </button>
              </form>
            </div>
        </div>
    )
}