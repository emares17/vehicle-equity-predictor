import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { Search, FileText, BarChart3 } from 'lucide-react';
import VinForm from '../forms/VinForm';

/**
 * Home page component that includes a header, footer, and the vin form.
 * All functionality is in the VinForm component.
 */

export default function Home() {

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header/>
      <div className="flex-1 bg-gray-50">
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center max-w-4xl mx-auto">
            
              <h1 className="text-4xl font-normal text-gray-900 leading-10 mb-6">
                Discover Your Vehicle's Future Value
              </h1>
              <p className="text-xl text-gray-600 leading-7 mb-4">
                See your projected vehicle value over a 5-year timeline
              </p>
              <p className="text-sm text-gray-500 leading-tight mb-12">
                Enter your VIN to see your projected vehicle value 
              </p>
              <div className="max-w-md mx-auto">
                <VinForm/>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white py-5">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-normal text-gray-900 leading-9 mb-6">
                How Vehicle Value Projections Works
              </h2>
              <p className="text-lg text-gray-600 leading-7">
                Get accurate value projections in three simple steps
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-xl font-normal text-gray-900 leading-7 mb-4">
                  1. Enter Your VIN
                </h3>
                <p className="text-base text-gray-600 leading-normal">
                  Simply enter your 17-character VIN and we'll automatically identify your vehicle's make, model, year, and trim.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-xl font-normal text-gray-900 leading-7 mb-4">
                  2. Quick Details
                </h3>
                <p className="text-base text-gray-600 leading-normal">
                  Answer a few quick questions about your vehicle.
                </p>
              </div>
          
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-xl font-normal text-gray-900 leading-7 mb-4">
                  3. View Projections
                </h3>
                <p className="text-base text-gray-600 leading-normal">
                  See your current and projected value with detailed timeline visualization.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-normal text-gray-900 leading-9">
                Why Know Your Vehicle Value?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <h3 className="text-xl font-normal text-gray-900 mb-4">
                  Smart Financial Planning
                </h3>
                <p className="text-base text-gray-600 leading-normal">
                  Understand your vehicle's future value to make informed decisions about refinancing, selling, or trading.
                </p>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <h3 className="text-xl font-normal text-gray-900 mb-4">
                  Better Trade-in Timing
                </h3>
                <p className="text-base text-gray-600 leading-normal">
                  Know the optimal time to trade in your vehicle to maximize your value and minimize losses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}