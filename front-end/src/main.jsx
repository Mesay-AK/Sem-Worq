import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "tailwindcss";
import Services from "./pages/Services"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Services />
  </StrictMode>,
)
