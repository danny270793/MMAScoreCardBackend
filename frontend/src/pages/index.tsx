import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { HomePage } from './home'
import { EventsPage } from './events'
import { FightersPage } from './fighters'
import { EventPage } from './event'
import { FightPage } from './fight'
import { FighterPage } from './fighter'
import { NotFoundPage } from './not-found'

export const routes: React.ReactElement = (
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
