import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { Lock, Clock, TrendingUp, Search, FileText, BarChart3 } from 'lucide-react';
import VinForm from '../forms/VinForm';

export default function App() {

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header/>
      <div className="flex-1 bg-gray-50">
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center max-w-4xl mx-auto">
            
              <h1 className="text-4xl font-normal text-gray-900 leading-10 mb-6">
                Discover Your Vehicle's Future Equity
              </h1>
              <p className="text-xl text-gray-600 leading-7 mb-4">
                See your projected vehicle equity when your loan is paid off
              </p>
              <p className="text-sm text-gray-500 leading-tight mb-12">
                Enter your VIN to see your projected vehicle equity when your loan is paid off
              </p>
              <div className="max-w-md mx-auto">
                <VinForm/>
                <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Lock className="w-3.5 h-3.5 mr-2" />
                    <span>Secure & Private</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-2" />
                    <span>Results in 30 seconds</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-3.5 h-3.5 mr-2" />
                    <span>Accurate Projections</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-normal text-gray-900 leading-9 mb-6">
                How Vehicle Equity Calculator Works
              </h2>
              <p className="text-lg text-gray-600 leading-7">
                Get accurate equity projections in three simple steps
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
                  Answer a few quick questions about your loan balance, payments, mileage, and vehicle condition.
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
                  See your current equity and projected equity when your loan is paid off, with detailed timeline visualization.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-normal text-gray-900 leading-9">
                Why Know Your Vehicle Equity?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <div className="w-7 h-7 bg-gray-600 rounded mx-auto mb-4"></div>
                <h3 className="text-xl font-normal text-gray-900 mb-4">
                  Smart Financial Planning
                </h3>
                <p className="text-base text-gray-600 leading-normal">
                  Understand your vehicle's future value to make informed decisions about refinancing, selling, or trading.
                </p>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <div className="w-9 h-7 bg-gray-600 rounded mx-auto mb-4"></div>
                <h3 className="text-xl font-normal text-gray-900 mb-4">
                  Better Trade-in Timing
                </h3>
                <p className="text-base text-gray-600 leading-normal">
                  Know the optimal time to trade in your vehicle to maximize your equity and minimize losses.
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