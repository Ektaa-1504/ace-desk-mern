/**
 * ============================================
 * MAIN.JSX - Application Entry Point
 * ============================================
 * This is the root file that mounts the React app to the DOM.
 * 
 * KEY CONCEPTS:
 * - createRoot: React 18's way to render - replaces ReactDOM.render()
 * - BrowserRouter: Wraps the app for client-side routing (enables /login, /profile, etc.)
 * - Provider: Redux wrapper - makes the store accessible to ALL components via useSelector/useDispatch
 *   Without Provider, no component could access Redux state!
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'


// Renders the entire app: Router wraps everything, Provider gives Redux access
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Provider store={store}>
    <App />
  </Provider>
  </BrowserRouter>
  
)
