/* eslint-disable react/react-in-jsx-scope */

// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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

const rootElement: HTMLElement | null = document.getElementById('root')
createRoot(rootElement!).render(
  // <StrictMode>
  <Provider store={store}>
    <Router>
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
    </Router>
  </Provider>,
  // </StrictMode>,
)
