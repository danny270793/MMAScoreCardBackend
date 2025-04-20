/* eslint-disable react/react-in-jsx-scope */

// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './reducers'
import './styles/index.css'
import './styles/w3css.css'
import { routes } from './pages'

function startupReact() {
  const rootElement: HTMLElement | null = document.getElementById('root')
  createRoot(rootElement!).render(
    // <StrictMode>
    <Provider store={store}>
      {window.cordova && <HashRouter>{routes}</HashRouter>}
      {!window.cordova && <BrowserRouter>{routes}</BrowserRouter>}
    </Provider>,
    // </StrictMode>,
  )
}

if (window.cordova) {
  document.addEventListener('deviceready', startupReact, false)
} else {
  startupReact()
}
