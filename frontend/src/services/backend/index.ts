import { http } from '../http'
import { mapper } from './mapper'
import {
  Device,
  Event,
  Fight,
  Fighter,
  Paginator,
  Record,
  Streak,
} from './models'

export const backend = {
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  login: async (
    email: string,
    password: string,
    model: string,
    platformId: string,
    platform: string,
    version: string,
  ): Promise<string> => {
    const body: { [key: string]: string } = {
      email,
      password,
      model,
      platform_id: platformId,
      platform,
      version,
    }

    const response: Response = await http.postAnonymous(
      `${backend.baseUrl}/api/auth/login`,
      body,
    )
    if (response.status !== 200) {
      throw new Error('Failed to do login')
    }

    return await response.text()
  },
  logout: async (token: string): Promise<string> => {
    const body: { [key: string]: string } = {
      token,
    }
    const response: Response = await http.post(
      `${backend.baseUrl}/api/auth/logout`,
      body,
    )
    if (response.status !== 200) {
      throw new Error('Failed to do logout')
    }
    return response.text()
  },
  getEvents: async (page: number = 0): Promise<Paginator<Event>> => {
    const response: Response = await http.get(
      `${backend.baseUrl}/api/events?page=${page}`,
    )
    if (response.status !== 200) {
      throw new Error('Failed to get events')
    }
    const data: Paginator<Event> = await response.json()
    return {
      ...data,
      data: data.data.map((item: Event) => mapper.toEvent(item)),
    }
  },
  getEvent: async (id: number): Promise<Event> => {
    const response: Response = await http.get(
      `${backend.baseUrl}/api/events/${id}`,
    )
    if (response.status !== 200) {
      throw new Error('Failed to get events')
    }
    const event: Event = await response.json()
    return mapper.toEvent(event)
  },
  getDevices: async (): Promise<Device[]> => {
    const response: Response = await http.get(
      `${backend.baseUrl}/api/users/devices`,
    )
    if (response.status !== 200) {
      throw new Error('Failed to get devices')
    }
    const devices: Device[] = await response.json()
    return devices.map((item: Device) => mapper.toDevice(item))
  },
  getDevice: async (id: number): Promise<Device> => {
    const response: Response = await http.get(
      `${backend.baseUrl}/api/users/devices/${id}`,
    )
    if (response.status !== 200) {
      throw new Error('Failed to get device')
    }

    const device: Device = await response.json()
    return mapper.toDevice(device)
  },
  updateDevice: async (id: number, name: string): Promise<Device> => {
    const body: { [key: string]: string } = {
      name,
    }

    const response: Response = await http.post(
      `${backend.baseUrl}/api/users/devices/${id}`,
      body,
    )
    if (response.status !== 200) {
      throw new Error('Failed to update device')
    }

    const device: Device = await response.json()
    return mapper.toDevice(device)
  },
  deleteDevice: async (id: number): Promise<void> => {
    const response: Response = await http.delete(
      `${backend.baseUrl}/api/users/devices/${id}`,
    )
    if (response.status !== 200) {
      throw new Error('Failed to delete device')
    }
  },
  getEventFights: async (
    id: number,
    page: number = 1,
  ): Promise<Paginator<Fight>> => {
    const response: Response = await http.get(
      `${backend.baseUrl}/api/events/${id}/fights?page=${page}`,
    )
    if (response.status !== 200) {
      throw new Error('Failed to get event fights')
    }
    const data: Paginator<Fight> = await response.json()
    return {
      ...data,
      data: data.data.map((item: Fight) => ({
        ...item,
        event: mapper.toEvent(item.event),
      })),
    }
  },
  getFight: async (id: number): Promise<Fight> => {
    const response: Response = await http.get(
      `${backend.baseUrl}/api/fights/${id}`,
    )
    if (response.status !== 200) {
      throw new Error('Failed to get fight')
    }
    const data: Fight = await response.json()
    return {
      ...data,
      event: mapper.toEvent(data.event),
      fighter1: mapper.toFighter(data.fighter1),
      fighter2: mapper.toFighter(data.fighter2),
    }
  },
  getFighter: async (id: number): Promise<Fighter> => {
    const response: Response = await http.get(
      `${backend.baseUrl}/api/fighters/${id}`,
    )
    if (response.status !== 200) {
      throw new Error('Failed to get fighter')
    }
    const data: Fighter = await response.json()
    return mapper.toFighter(data)
  },
  getFighterFights: async (
    id: number,
    page: number = 1,
  ): Promise<Paginator<Fight>> => {
    const response: Response = await http.get(
      `${backend.baseUrl}/api/fighters/${id}/fights?page=${page}`,
    )
    if (response.status !== 200) {
      throw new Error('Failed to get fighter fights')
    }
    const data: Paginator<Fight> = await response.json()
    return {
      ...data,
      data: data.data.map((item: Fight) => ({
        ...item,
        event: mapper.toEvent(item.event),
      })),
    }
  },
  getFighterStreaks: async (id: number): Promise<Streak[]> => {
    const response: Response = await http.get(
      `${backend.baseUrl}/api/fighters/${id}/streaks`,
    )
    if (response.status !== 200) {
      throw new Error('Failed to get fighter streaks')
    }
    const data: Streak[] = await response.json()
    return data.map((item) => mapper.toStreak(item))
  },
  getFighterRecords: async (id: number): Promise<Record[]> => {
    const response: Response = await http.get(
      `${backend.baseUrl}/api/fighters/${id}/records`,
    )
    if (response.status !== 200) {
      throw new Error('Failed to get fighter records')
    }
    const data: Record[] = await response.json()
    return data.map((item) => mapper.toRecord(item))
  },
  getFighters: async (page: number = 0): Promise<Paginator<Fighter>> => {
    const response: Response = await http.get(
      `${backend.baseUrl}/api/fighters?page=${page}`,
    )
    if (response.status !== 200) {
      throw new Error('Failed to get fighters')
    }
    const data: Paginator<Fighter> = await response.json()
    return {
      ...data,
      data: data.data.map((item: Fighter) => mapper.toFighter(item)),
    }
  },
  searchFighters: async (
    page: number,
    query: string,
  ): Promise<Paginator<Fighter>> => {
    const response: Response = await http.get(
      `${backend.baseUrl}/api/fighters/search?query=${query}&page=${page}`,
    )
    if (response.status !== 200) {
      throw new Error('Failed to search fighters')
    }
    const data: Paginator<Fighter> = await response.json()
    return {
      ...data,
      data: data.data.map((item: Fighter) => mapper.toFighter(item)),
    }
  },
}
