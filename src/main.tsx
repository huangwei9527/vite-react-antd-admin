import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '@/store'
import App from './App'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>
)
