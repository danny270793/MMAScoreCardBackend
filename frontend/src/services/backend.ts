export interface Link {
  url: string
  label: string
  active: boolean
}

export interface Paginator<T> {
  last_page: number
  data: T[]
}

// export interface Paginator<T> {
//   current_page: number
//   data: T[]
//   first_page_url: string
//   from: number
//   last_page: number
//   last_page_url: string
//   links: Link[]
//   next_page_url: string
//   path: string
//   per_page: number
//   prev_page_url: string
//   to: number
//   total: number
// }

export interface Event {
  id: number
  name: string
  fight: string
  location: string
  country: string
  date: Date | null
  state: string
}

export interface Referee {
  id: number
  name: string
}

export interface Division {
  id: number
  name: string
  weight: number
}

export interface Fighter {
  id: number
  name: string
  nickname: string | null
  country: string
  city: string
  birthday: Date
  died: Date | null
  height: number
  weight: number
}

export interface Record {
  name: string
  value: number
  fighter_id: string
}

export interface Streak {
  id: number
  result: string
  counter: number
  from: Date
  to: Date
  fighter_id: string
}

export interface Fight {
  id: number
  position: number
  event: Event
  event_id: number
  fighter1: Fighter
  fighter1_id: number
  fighter1_result: string
  fighter2: Fighter
  fighter2_id: number
  fighter2_result: string
  division: Division
  division_id: number
  method: string
  referee: Referee
  referee_id: number
  round: number
  time: string
  state: string
}

export const backend = {
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  jsonToEvent: (item: Event): Event => ({
    ...item,
    date: item.date === null ? null : new Date(item.date),
  }),
  jsonToFighter: (item: Fighter): Fighter => ({
    ...item,
    birthday: new Date(item.birthday),
    died: item.died !== null ? new Date(item.died) : null,
  }),
  jsonToStreak: (item: Streak): Streak => ({
    ...item,
    from: new Date(item.from),
    to: new Date(item.to),
  }),
  jsonToRecord: (item: Record): Record => ({
    ...item,
  }),
  getEvents: async (page: number = 0): Promise<Paginator<Event>> => {
    const response: Response = await fetch(
      `${backend.baseUrl}/api/events?page=${page}`,
    )
    if (response.status !== 200) {
      throw new Error('Failed to fetch events')
    }
    const data: Paginator<Event> = await response.json()
    return {
      ...data,
      data: data.data.map((item: Event) => backend.jsonToEvent(item)),
    }
  },
  getEvent: async (id: number): Promise<Event> => {
    const response: Response = await fetch(
      `${backend.baseUrl}/api/events/${id}`,
    )
    if (response.status !== 200) {
      throw new Error('Failed to fetch events')
    }
    const event: Event = await response.json()
    return backend.jsonToEvent(event)
  },
  getEventFights: async (
    id: number,
    page: number = 1,
  ): Promise<Paginator<Fight>> => {
    const response: Response = await fetch(
      `${backend.baseUrl}/api/events/${id}/fights?page=${page}`,
    )
    if (response.status !== 200) {
      throw new Error('Failed to fetch events')
    }
    const data: Paginator<Fight> = await response.json()
    return {
      ...data,
      data: data.data.map((item: Fight) => ({
        ...item,
        event: backend.jsonToEvent(item.event),
      })),
    }
  },
  getFight: async (id: number): Promise<Fight> => {
    const response: Response = await fetch(
      `${backend.baseUrl}/api/fights/${id}`,
    )
    if (response.status !== 200) {
      throw new Error('Failed to fetch events')
    }
    const data: Fight = await response.json()
    return {
      ...data,
      event: backend.jsonToEvent(data.event),
      fighter1: backend.jsonToFighter(data.fighter1),
      fighter2: backend.jsonToFighter(data.fighter2),
    }
  },
  getFighter: async (id: number): Promise<Fighter> => {
    const response: Response = await fetch(
      `${backend.baseUrl}/api/fighters/${id}`,
    )
    if (response.status !== 200) {
      throw new Error('Failed to fetch events')
    }
    const data: Fighter = await response.json()
    return backend.jsonToFighter(data)
  },
  getFighterFights: async (
    id: number,
    page: number = 1,
  ): Promise<Paginator<Fight>> => {
    const response: Response = await fetch(
      `${backend.baseUrl}/api/fighters/${id}/fights?page=${page}`,
    )
    if (response.status !== 200) {
      throw new Error('Failed to fetch events')
    }
    const data: Paginator<Fight> = await response.json()
    return {
      ...data,
      data: data.data.map((item: Fight) => ({
        ...item,
        event: backend.jsonToEvent(item.event),
      })),
    }
  },
  getFighterStreaks: async (id: number): Promise<Streak[]> => {
    const response: Response = await fetch(
      `${backend.baseUrl}/api/fighters/${id}/streaks`,
    )
    if (response.status !== 200) {
      throw new Error('Failed to fetch events')
    }
    const data: Streak[] = await response.json()
    return data.map((item) => backend.jsonToStreak(item))
  },
  getFighterRecords: async (id: number): Promise<Record[]> => {
    const response: Response = await fetch(
      `${backend.baseUrl}/api/fighters/${id}/records`,
    )
    if (response.status !== 200) {
      throw new Error('Failed to fetch events')
    }
    const data: Record[] = await response.json()
    return data.map((item) => backend.jsonToRecord(item))
  },
  getFighters: async (page: number = 0): Promise<Paginator<Fighter>> => {
    const response: Response = await fetch(
      `${backend.baseUrl}/api/fighters?page=${page}`,
    )
    if (response.status !== 200) {
      throw new Error('Failed to fetch events')
    }
    const data: Paginator<Fighter> = await response.json()
    return {
      ...data,
      data: data.data.map((item: Fighter) => backend.jsonToFighter(item)),
    }
  },
  searchFighters: async (
    page: number,
    query: string,
  ): Promise<Paginator<Fighter>> => {
    const response: Response = await fetch(
      `${backend.baseUrl}/api/fighters/search?query=${query}&page=${page}`,
    )
    if (response.status !== 200) {
      throw new Error('Failed to fetch events')
    }
    const data: Paginator<Fighter> = await response.json()
    return {
      ...data,
      data: data.data.map((item: Fighter) => backend.jsonToFighter(item)),
    }
  },
}
