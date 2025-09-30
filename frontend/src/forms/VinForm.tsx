import { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import { useVehicle } from '../context/VehicleDataContext';

export default function VinForm() {
    const [vin, setVin] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setVehicleData } = useVehicle();

    const validateVin = (vin: string): boolean => {
        const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
        return vinRegex.test(vin);
    }

    const fetchVinData = async(vin: string) => {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/vin-lookup", {
                    vin: vin
            });

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

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        if (!validateVin(vin)) {
            setError('Invalid VIN format');
            return;
        }
        setIsLoading(true);
        setError('');
        setVehicleData(null);
        
        try {
            const vinData = await fetchVinData(vin);
            setVehicleData({ ...vinData, vin });
            navigate('/vehicle-details')
        } catch (error) {
            setError(error instanceof Error ? error.message : "Something went wrong while fetching VIN Data.");
        } finally {
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
                        <div className="w-3 h-3 bg-gray-500 rounded mr-2"></div>
                        <span>VIN is typically found on your dashboard, driver's door, or registration</span>
                        </div>
                    </div>
                    <button 
                        type="submit"  
                        className="w-full h-12 bg-gray-600 hover:bg-gray-700 text-white text-lg font-normal rounded-md transition-colors duration-200"
                        disabled={vin.length !== 17 || !validateVin(vin) || isLoading}
                        >
                        {isLoading ? "Analyzing..." : "Get My Vehicle Equity Prediction"}
                    </button>
                </div>
            </form>  
    )
}