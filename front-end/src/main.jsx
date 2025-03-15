import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Blog from './pages/Blog'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Blog />
  </StrictMode>,
)
