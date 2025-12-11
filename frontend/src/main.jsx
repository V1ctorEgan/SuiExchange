import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Router } from './route/Router.jsx'
import { RouterProvider } from 'react-router-dom'
import { WalletProvider } from '@suiet/wallet-kit'
import '@suiet/wallet-kit/style.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WalletProvider>
      <RouterProvider router={Router}/>
    </WalletProvider>
  </StrictMode>,
)