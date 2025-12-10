import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
import { Router } from './route/Router.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <RouterProvider router={Router}/>
    {/* <App /> */}
  </StrictMode>,
)
