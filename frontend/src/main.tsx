/* eslint-disable react/react-in-jsx-scope */

// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Routes, Route } from 'react-router-dom'
import { HashRouter } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { EventsPage } from './pages/events'
import { EventPage } from './pages/event'
import { store } from './reducers'
import { FightPage } from './pages/fight'
import { NotFoundPage } from './pages/not-found'
import { FighterPage } from './pages/fighter'
import { HomePage } from './pages/home'
import { FightersPage } from './pages/fighters'
import './styles/index.css'
import './styles/w3css.css'

function startupReact() {
  const routes: React.ReactElement = (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {window.cordova && <Route path="/index.html" element={<HomePage />} />}
      <Route path="/events/" element={<EventsPage />} />
      <Route path="/fighters/" element={<FightersPage />} />
      <Route path="/events/:id" element={<EventPage />} />
      <Route path="/fight/:id" element={<FightPage />} />
      <Route path="/fighter/:id" element={<FighterPage />} />
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  )
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

if (!window.cordova) {
  startupReact()
} else {
  document.addEventListener('deviceready', startupReact, false)
}
