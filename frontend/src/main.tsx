/* eslint-disable react/react-in-jsx-scope */

// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { persistedStore, store } from './reducers'
import './styles/index.css'
import './styles/w3css.css'
import './i18n'
import { Routes } from './pages'
import { PersistGate } from 'redux-persist/integration/react'
import { Loader } from './components/loader'
import { ErrorBoundary } from './components/error-boundary'
import React from 'react'
import { ThemeContextProvider } from './context/theme-context'

function startupReact() {
  const rootElement: HTMLElement | null = document.getElementById('root')

  const Router: React.FC<{ children: React.ReactNode }> = (props) => {
    if (window.cordova) {
      return <HashRouter>{props.children}</HashRouter>
    }
    return <BrowserRouter>{props.children}</BrowserRouter>
  }

  createRoot(rootElement!).render(
    // <StrictMode>
    <ErrorBoundary>
      <ThemeContextProvider>
        <Provider store={store}>
          <PersistGate
            persistor={persistedStore}
            loading={<Loader fullscreen={true} />}
          >
            <Router>
              <Routes />
            </Router>
          </PersistGate>
        </Provider>
      </ThemeContextProvider>
    </ErrorBoundary>,
    // </StrictMode>,
  )
}

if (window.cordova) {
  document.addEventListener('deviceready', startupReact, false)
} else {
  startupReact()
}
