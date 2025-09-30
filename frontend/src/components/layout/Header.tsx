export default function Header() {
  return (
    <div className="w-full h-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gray-800 rounded"></div>
              <div className="text-xl font-normal text-gray-800">VehicleEquity</div>
            </div>
            <div className="flex items-center space-x-12">
              <div className="text-base text-gray-600 cursor-pointer hover:text-gray-900">How it Works</div>
            </div>
          </div>
        </div>
      </div>
  );
};