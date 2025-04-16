import { UnknownAction } from '@reduxjs/toolkit'
import { Paginator } from '../services/backend'

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

export interface FighterWithFights extends Fighter {
  fights: Fight[]
}

export interface Fight {
  id: number
  position: number
  fighter1: Fighter
  fighter1_result: string
  fighter2: Fighter
  fighter2_result: string
  division: Division
  method: string
  referee: Referee
  round: number
  time: string
  state: string
  event: Event
}

export interface Event {
  id: number
  name: string
  fight: string
  location: string
  country: string
  state: string
  date: Date
}

export interface EventWithFights extends Event {
  fights: Fight[]
}

export type Type =
  | 'backend/CLEAR_ERROR'
  | 'backend/LOAD_EVENTS_REQUEST'
  | 'backend/LOAD_EVENTS_SUCCESS'
  | 'backend/LOAD_EVENTS_ERROR'
  | 'backend/LOAD_EVENT_REQUEST'
  | 'backend/LOAD_EVENT_SUCCESS'
  | 'backend/LOAD_EVENT_ERROR'
  | 'backend/LOAD_FIGHT_REQUEST'
  | 'backend/LOAD_FIGHT_SUCCESS'
  | 'backend/LOAD_FIGHT_ERROR'
  | 'backend/LOAD_FIGHTER_REQUEST'
  | 'backend/LOAD_FIGHTER_SUCCESS'
  | 'backend/LOAD_FIGHTER_ERROR'
  | 'backend/LOAD_FIGHTERS_REQUEST'
  | 'backend/LOAD_FIGHTERS_SUCCESS'
  | 'backend/LOAD_FIGHTERS_ERROR'
  | 'backend/SEARCH_FIGHTERS_REQUEST'
  | 'backend/SEARCH_FIGHTERS_SUCCESS'
  | 'backend/SEARCH_FIGHTERS_ERROR'

export interface Action extends UnknownAction {
  type: Type
}

export interface ClearErrorAction extends Action {
  type: 'backend/CLEAR_ERROR'
  error: null
}

export interface LoadEventsRequestAction extends Action {
  type: 'backend/LOAD_EVENTS_REQUEST'
  page: number
}

export interface LoadEventsSuccessAction extends Action {
  type: 'backend/LOAD_EVENTS_SUCCESS'
  events: Paginator<Event>
}

export interface LoadEventsErrorAction extends Action {
  type: 'backend/LOAD_EVENTS_ERROR'
  error: Error
}

export interface LoadEventRequestAction extends Action {
  type: 'backend/LOAD_EVENT_REQUEST'
  id: number
}

export interface LoadEventSuccessAction extends Action {
  type: 'backend/LOAD_EVENT_SUCCESS'
  event: EventWithFights
}

export interface LoadEventErrorAction extends Action {
  type: 'backend/LOAD_EVENT_ERROR'
  error: Error
}

export interface LoadFightRequestAction extends Action {
  type: 'backend/LOAD_FIGHT_REQUEST'
  id: number
}

export interface LoadFightSuccessAction extends Action {
  type: 'backend/LOAD_FIGHT_SUCCESS'
  fight: Fight
}

export interface LoadFightErrorAction extends Action {
  type: 'backend/LOAD_FIGHT_ERROR'
  error: Error
}

export interface LoadFighterRequestAction extends Action {
  type: 'backend/LOAD_FIGHTER_REQUEST'
  id: number
}

export interface LoadFighterSuccessAction extends Action {
  type: 'backend/LOAD_FIGHTER_SUCCESS'
  fighter: FighterWithFights
}

export interface LoadFighterErrorAction extends Action {
  type: 'backend/LOAD_FIGHTER_ERROR'
  error: Error
}

export interface LoadFightersRequestAction extends Action {
  type: 'backend/LOAD_FIGHTERS_REQUEST'
  page: number
}

export interface LoadFightersSuccessAction extends Action {
  type: 'backend/LOAD_FIGHTERS_SUCCESS'
  fighters: Paginator<Fighter>
}

export interface LoadFightersErrorAction extends Action {
  type: 'backend/LOAD_FIGHTERS_ERROR'
  error: Error
}

export interface SearchFightersRequestAction extends Action {
  type: 'backend/SEARCH_FIGHTERS_REQUEST'
  query: string
  page: number
}

export interface SearchFightersSuccessAction extends Action {
  type: 'backend/SEARCH_FIGHTERS_SUCCESS'
  searchedFighters: Paginator<Fighter>
}

export interface SearchFightersErrorAction extends Action {
  type: 'backend/SEARCH_FIGHTERS_ERROR'
  error: Error
}

export interface BackendState {
  events: Paginator<Event> | null
  event: EventWithFights | null
  fight: Fight | null
  fighter: FighterWithFights | null
  fighters: Paginator<Fighter> | null
  searchedFighters: Paginator<Fighter> | null
  isLoading: boolean
  error: Error | null
}

export const initialState: BackendState = {
  events: null,
  event: null,
  fight: null,
  fighter: null,
  fighters: null,
  searchedFighters: null,
  isLoading: false,
  error: null,
}

type Reducer = (
  state: BackendState | undefined,
  action: UnknownAction,
) => BackendState

export const reducer: Reducer = (
  state = initialState,
  action: UnknownAction,
): BackendState => {
  switch (action.type) {
    case 'backend/CLEAR_ERROR':
      return { ...state, error: null }
    case 'backend/LOAD_EVENTS_REQUEST':
      return { ...state, isLoading: true, error: null, events: null }
    case 'backend/LOAD_EVENTS_ERROR':
      return {
        ...state,
        isLoading: false,
        error: (action as LoadEventsErrorAction).error,
      }
    case 'backend/LOAD_EVENTS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        events: (action as LoadEventsSuccessAction).events,
      }

    case 'backend/LOAD_EVENT_REQUEST':
      return { ...state, isLoading: true, error: null, event: null }
    case 'backend/LOAD_EVENT_ERROR':
      return {
        ...state,
        isLoading: false,
        error: (action as LoadEventErrorAction).error,
      }
    case 'backend/LOAD_EVENT_SUCCESS':
      return {
        ...state,
        isLoading: false,
        event: (action as LoadEventSuccessAction).event,
      }

    case 'backend/LOAD_FIGHT_REQUEST':
      return { ...state, isLoading: true, error: null, fight: null }
    case 'backend/LOAD_FIGHT_ERROR':
      return {
        ...state,
        isLoading: false,
        error: (action as LoadFightErrorAction).error,
      }
    case 'backend/LOAD_FIGHT_SUCCESS':
      return {
        ...state,
        isLoading: false,
        fight: (action as LoadFightSuccessAction).fight,
      }

    case 'backend/LOAD_FIGHTER_REQUEST':
      return { ...state, isLoading: true, error: null, fighter: null }
    case 'backend/LOAD_FIGHTER_ERROR':
      return {
        ...state,
        isLoading: false,
        error: (action as LoadFighterErrorAction).error,
      }
    case 'backend/LOAD_FIGHTER_SUCCESS':
      return {
        ...state,
        isLoading: false,
        fighter: (action as LoadFighterSuccessAction).fighter,
      }

    case 'backend/LOAD_FIGHTERS_REQUEST':
      return { ...state, isLoading: true, error: null, fighters: null }
    case 'backend/LOAD_FIGHTERS_ERROR':
      return {
        ...state,
        isLoading: false,
        error: (action as LoadFightersErrorAction).error,
      }
    case 'backend/LOAD_FIGHTERS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        fighters: (action as LoadFightersSuccessAction).fighters,
      }

    case 'backend/SEARCH_FIGHTERS_REQUEST':
      return { ...state, isLoading: true, error: null, searchedFighters: null }
    case 'backend/SEARCH_FIGHTERS_ERROR':
      return {
        ...state,
        isLoading: false,
        error: (action as SearchFightersErrorAction).error,
      }
    case 'backend/SEARCH_FIGHTERS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        searchedFighters: (action as SearchFightersSuccessAction)
          .searchedFighters,
      }

    default:
      return state
  }
}

export const actions = {
  clearError: (): ClearErrorAction => ({
    type: 'backend/CLEAR_ERROR',
    error: null,
  }),

  loadEvents: (page: number): LoadEventsRequestAction => ({
    type: 'backend/LOAD_EVENTS_REQUEST',
    page,
  }),
  loadEventsSuccess: (events: Paginator<Event>): LoadEventsSuccessAction => ({
    type: 'backend/LOAD_EVENTS_SUCCESS',
    events,
  }),
  loadEventsError: (error: Error): LoadEventsErrorAction => ({
    type: 'backend/LOAD_EVENTS_ERROR',
    error,
  }),

  loadEvent: (id: number): LoadEventRequestAction => ({
    type: 'backend/LOAD_EVENT_REQUEST',
    id,
  }),
  loadEventSuccess: (event: EventWithFights): LoadEventSuccessAction => ({
    type: 'backend/LOAD_EVENT_SUCCESS',
    event,
  }),
  loadEventError: (error: Error): LoadEventErrorAction => ({
    type: 'backend/LOAD_EVENT_ERROR',
    error,
  }),

  loadFight: (id: number): LoadFightRequestAction => ({
    type: 'backend/LOAD_FIGHT_REQUEST',
    id,
  }),
  loadFightSuccess: (fight: Fight): LoadFightSuccessAction => ({
    type: 'backend/LOAD_FIGHT_SUCCESS',
    fight,
  }),
  loadFightError: (error: Error): LoadFightErrorAction => ({
    type: 'backend/LOAD_FIGHT_ERROR',
    error,
  }),

  loadFighter: (id: number): LoadFighterRequestAction => ({
    type: 'backend/LOAD_FIGHTER_REQUEST',
    id,
  }),
  loadFighterSuccess: (
    fighter: FighterWithFights,
  ): LoadFighterSuccessAction => ({
    type: 'backend/LOAD_FIGHTER_SUCCESS',
    fighter,
  }),
  loadFighterError: (error: Error): LoadFighterErrorAction => ({
    type: 'backend/LOAD_FIGHTER_ERROR',
    error,
  }),

  loadFighters: (page: number): LoadFightersRequestAction => ({
    type: 'backend/LOAD_FIGHTERS_REQUEST',
    page,
  }),
  loadFightersSuccess: (
    fighters: Paginator<Fighter>,
  ): LoadFightersSuccessAction => ({
    type: 'backend/LOAD_FIGHTERS_SUCCESS',
    fighters,
  }),
  loadFightersError: (error: Error): LoadFightersErrorAction => ({
    type: 'backend/LOAD_FIGHTERS_ERROR',
    error,
  }),

  searchFighters: (
    page: number,
    query: string,
  ): SearchFightersRequestAction => ({
    type: 'backend/SEARCH_FIGHTERS_REQUEST',
    page,
    query,
  }),
  searchFightersSuccess: (
    searchedFighters: Paginator<Fighter>,
  ): SearchFightersSuccessAction => ({
    type: 'backend/SEARCH_FIGHTERS_SUCCESS',
    searchedFighters,
  }),
  searchFightersError: (error: Error): SearchFightersErrorAction => ({
    type: 'backend/SEARCH_FIGHTERS_ERROR',
    error,
  }),
}

export interface Store {
  backend: BackendState
}

export const selectors = {
  getError: ({ backend }: Store): Error | null => backend.error,
  getIsLoading: ({ backend }: Store): boolean => backend.isLoading,
  getEvents: ({ backend }: Store): Paginator<Event> | null => backend.events,
  getEvent: ({ backend }: Store): EventWithFights | null => backend.event,
  getFight: ({ backend }: Store): Fight | null => backend.fight,
  getFighter: ({ backend }: Store): FighterWithFights | null => backend.fighter,
  getFighters: ({ backend }: Store): Paginator<Fighter> | null =>
    backend.fighters,
  getSearchedFighters: ({ backend }: Store): Paginator<Fighter> | null =>
    backend.searchedFighters,
}
