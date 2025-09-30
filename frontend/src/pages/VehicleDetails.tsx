import { Car } from 'lucide-react';
import VehicleDetails from '../forms/VehicleDetailsForm';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function App() {

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="w-full h-16 bg-white border-b border-gray-200">
        <Header/>
      </div>

      <div className="flex-1 bg-gray-50 flex items-center justify-center py-16">
        <div className="max-w-3xl mx-auto px-8 w-full">
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Car className="w-5 h-6 text-gray-600" />
              </div>
              <h1 className="text-3xl font-normal text-gray-900 leading-9 mb-4">
                We Found Your Vehicle!
              </h1>
              <p className="text-lg text-gray-600 leading-7">
                Please confirm the details below are correct
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
             <VehicleDetails/>
             </div>
          </div>   
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg text-gray-900 mb-6">What's Next?</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-sm">2</span>
                </div>
                <span className="text-base text-gray-700">Provide loan and vehicle details</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                  <span className="text-gray-600 text-sm">3</span>
                </div>
                <span className="text-base text-gray-500">View your equity analysis</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                  <span className="text-gray-600 text-sm">4</span>
                </div>
                <span className="text-base text-gray-500">Email results (optional)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
}