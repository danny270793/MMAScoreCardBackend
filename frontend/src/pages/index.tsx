import React from 'react'
import { Route, Routes as RouterRoutes } from 'react-router-dom'
import { HomePage } from './home'
import { EventsPage } from './events'
import { FightersPage } from './fighters'
import { EventPage } from './event'
import { FightPage } from './fight'
import { FighterPage } from './fighter'
import { NotFoundPage } from './not-found'
import { LoginPage } from './login'
import { AuthenticatedRoutes } from '../components/authenticated-routes'
import { DevicesPage } from './devices'
import { DevicePage } from './device'
import { SettingsPage } from './settings'

export const RoutesName: { [key: string]: string } = {
  home: '/',
  login: '/login',
  devices: '/devices',
  device: '/device/:id',
  events: '/events',
  event: '/event/:id',
  fighters: '/fighters',
  fight: '/fight/:id',
  fighter: '/fighter/:id',
  settings: '/settings',
}

export const Routes: () => React.ReactElement = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<AuthenticatedRoutes />}>
        <Route path={RoutesName.home} element={<HomePage />} />
        <Route path={RoutesName.devices} element={<DevicesPage />} />
        <Route path={RoutesName.device} element={<DevicePage />} />
        <Route path={RoutesName.events} element={<EventsPage />} />
        <Route path={RoutesName.event} element={<EventPage />} />
        <Route path={RoutesName.fighters} element={<FightersPage />} />
        <Route path={RoutesName.fight} element={<FightPage />} />
        <Route path={RoutesName.fighter} element={<FighterPage />} />
        <Route path={RoutesName.settings} element={<SettingsPage />} />
      </Route>

      <Route path={RoutesName.login} element={<LoginPage />} />
      <Route path="/*" element={<NotFoundPage />} />
    </RouterRoutes>
  )
}
