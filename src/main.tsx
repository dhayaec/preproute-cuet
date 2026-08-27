import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './routes/index'
import QueryProvider from './app/providers/QueryProvider'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  </StrictMode>,
)
