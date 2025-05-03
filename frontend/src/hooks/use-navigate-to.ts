import { NavigateFunction, useNavigate } from 'react-router-dom'
import { RoutesName } from '../pages'

export interface NavigateTo {
  back: () => void
  home: () => void
  login: () => void
  devices: () => void
  device: (id: number) => void
  events: () => void
  event: (id: number) => void
  fighters: () => void
  fight: (id: number) => void
  fighter: (id: number) => void
  settings: () => void
}

export const useNavigateTo = (): NavigateTo => {
  const navigate: NavigateFunction = useNavigate()

  return {
    back: () => navigate(-1),
    home: () => navigate(RoutesName.home),
    login: () => navigate(RoutesName.login),
    devices: () => navigate(RoutesName.devices),
    device: (id: number) => navigate(RoutesName.device.replace(':id', `${id}`)),
    events: () => navigate(RoutesName.events),
    event: (id: number) => navigate(RoutesName.event.replace(':id', `${id}`)),
    fighters: () => navigate(RoutesName.fighters),
    fight: (id: number) => navigate(RoutesName.fight.replace(':id', `${id}`)),
    fighter: (id: number) =>
      navigate(RoutesName.fighter.replace(':id', `${id}`)),
    settings: () => navigate(RoutesName.settings),
  }
}
