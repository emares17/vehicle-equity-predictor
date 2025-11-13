import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import VehicleDetails from './pages/VehicleDetails'
import VehicleQuestionnaire from './pages/VehicleQuestionnaire'
import VehicleResults from './pages/VehicleResults'
import { VehicleProvider } from './context/VehicleDataContext'

// Root component to define application routes using react router.
function App() {
  return (
    // The VehicleProvider wraps the entire app to share the vehicle data context across all pages
    // and components.
    <VehicleProvider> 
      <Router>
        <Routes>
          <Route path = "/" element = {<Home/>} />
          <Route path = "/vehicle-details" element = {<VehicleDetails/>} />
          <Route path = "/vehicle-questionnaire" element = {<VehicleQuestionnaire/>} />
          <Route path = "/results/:id" element = {<VehicleResults/>} />
        </Routes>
      </Router>
    </VehicleProvider>   
  )
}

export default App;
