import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UnitProvider } from './context/UnitContext'
import { LocationProvider } from './context/LocationContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UnitProvider>
      <LocationProvider>
        <App />
      </LocationProvider>
    </UnitProvider>
  </StrictMode>,
)
