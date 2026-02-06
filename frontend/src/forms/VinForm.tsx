import { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import { useVehicle } from '../context/VehicleDataContext';
import { Sparkles, AlertCircle } from 'lucide-react';

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
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // Frontend validation for the VIN format, addidional validation is done in the backend.
    const validateVin = (vin: string): boolean => {
        const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
        return vinRegex.test(vin);
    }

    // Async function to fetch data from the backend /api/vin-lookup endpoint, returns vehicle data or throws error.
    const fetchVinData = async(vin: string) => {
        try {
            const response = await axios.post(`${API_URL}/api/vin-lookup`, {
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
            <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 shadow-2xl shadow-amber-500/5">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                <div className="relative z-10">
                    <label className="flex items-center justify-center space-x-2 text-sm text-slate-300 mb-4">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Vehicle Identification Number (VIN)</span>
                    </label>
                    
                    <div className="relative mb-4">
                        <input
                            type="text"
                            value={vin}
                            onChange={(e) => setVin(e.target.value.toUpperCase())}
                            placeholder="Enter 17-character VIN"
                            maxLength={17}
                            className="w-full h-14 px-4 text-lg bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-amber-500 focus:outline-none text-white placeholder-slate-500 tracking-widest font-mono transition-all duration-300"
                        />
                        
                        {/* Character counter */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                            <span className={`text-xs font-medium ${vin.length === 17 ? 'text-green-400' : 'text-slate-500'}`}>
                                {vin.length}/17
                            </span>
                        </div>
                    </div>
                    
                    {/* Error message */}
                    {error && (
                        <div className="flex items-start space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}
                    
                    {/* Info text */}
                    <div className="flex items-center justify-center mb-6 text-xs text-slate-500">
                        <span>VIN is typically found on your dashboard, driver's door, or registration.</span>
                    </div>
                    
                    {/* Submit button */}
                    <button 
                        type="submit"  
                        className="group relative w-full h-14 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-900 text-lg font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40"
                        disabled={vin.length !== 17 || !validateVin(vin) || isLoading}
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
                                    <span>Analyzing...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    <span>Get My Vehicle Value Prediction</span>
                                </>
                            )}
                        </span>
                    </button>
                </div>
            </div>
        </form>  
    )
}