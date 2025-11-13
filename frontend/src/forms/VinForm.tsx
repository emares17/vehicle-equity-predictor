import { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import { useVehicle } from '../context/VehicleDataContext';

/**
 * Provides a form for users to input a VIN number.
 * After input, the value is sent to the backend for validation and vehicle data retrieval.
 * On success, vehicle data is stored in context and user is navigated to vehicle details page.
 */

export default function VinForm() {
    // State for VIN input, loading status, error messages, and navigation
    const [vin, setVin] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    // Access to vehicle data context to set vehicle data after successful VIN lookup
    const { setVehicleData } = useVehicle();

    // Frontend validation for the VIN format, addidional validation is done in the backend.
    const validateVin = (vin: string): boolean => {
        const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
        return vinRegex.test(vin);
    }

    // Async function to fetch data from the backend /api/vin-lookup endpoint, returns vehicle data or throws error.
    const fetchVinData = async(vin: string) => {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/vin-lookup", {
                    vin: vin
            });

            // Handle unsuccessful responses if backend return 'success: false' in response
            if (!response.data.success) {
                throw new Error(response.data.error || "Vin lookup failed");
            }
            return response.data.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.error || "Error connecting to the server");
            }
            throw error;
        }
    }

    // Handles the form submission, validates VIN, fetches vehicle data, updates context, and navigates.
    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        // validation for VIN format
        if (!validateVin(vin)) {
            setError('Invalid VIN format');
            return;
        }
        // Set loading state and clear previous errors, initialize vehicle data to null
        setIsLoading(true);
        setError('');
        setVehicleData(null);
        
        try {
            // Fetch vehicle data from backend
            const vinData = await fetchVinData(vin);
            // Update vehicle data context and navigate to vehicle details page on success
            setVehicleData({ ...vinData, vin });
            navigate('/vehicle-details')
        } catch (error) {
            // Set error message if fetching fails
            setError(error instanceof Error ? error.message : "Something went wrong while fetching VIN Data.");
        } finally {
            // Reset loading state regardless of success or failure
            setIsLoading(false);
        }
    }

    return (
            <form onSubmit={handleSubmit}>  
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 mb-8">
                    <div className="mb-6">
                        <label className="block text-sm text-gray-700 text-center mb-4">
                        Vehicle Identification Number (VIN)
                        </label>
                        <input
                        type="text"
                        value={vin}
                        onChange={(e) => setVin(e.target.value.toUpperCase())}
                        placeholder="Enter 17-character VIN"
                        maxLength={17}
                        className="w-full h-14 px-4 text-lg bg-white border border-gray-300 rounded-md focus:border-gray-500 focus:outline-none text-gray-900 placeholder-gray-400 tracking-wide"
                        />
                        {error && <p className="text-red-500 text-sm mt-2"> {error}</p>}
                        <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
                        <span>VIN is typically found on your dashboard, driver's door, or registration.</span>
                        </div>
                    </div>
                    <button 
                        type="submit"  
                        className="w-full h-12 bg-gray-600 hover:bg-gray-700 text-white text-lg font-normal rounded-md transition-colors duration-200"
                        disabled={vin.length !== 17 || !validateVin(vin) || isLoading}
                        >
                        {isLoading ? "Analyzing..." : "Get My Vehicle Value Prediction"}
                    </button>
                </div>
            </form>  
    )
}