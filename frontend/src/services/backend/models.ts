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

export interface Device {
  id: string
  name: string
  platform: string
  current: boolean
  model: string
  version: string
  last_used_at: Date | null
}
