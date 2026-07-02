import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router'
import '@/config/cognito-config'
import QueryClientBoundary from './query-client-boundary'
import Router from './router'
import AlertModal from './components/alert-modal'


// @ts-ignore
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientBoundary>
        <BrowserRouter basename="/intc">
            <Router />
            <AlertModal />
        </BrowserRouter>
    </QueryClientBoundary>
  </StrictMode>,
)
