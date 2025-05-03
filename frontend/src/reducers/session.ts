import { UnknownAction } from '@reduxjs/toolkit'

export type Type =
  | 'session/INIT'
  | 'session/CLEAR_ERROR'
  | 'session/LOGIN_REQUESTED'
  | 'session/LOGIN_SUCCESS'
  | 'session/LOGIN_ERROR'
  | 'session/LOGOUT_REQUESTED'
  | 'session/LOGOUT_SUCCESS'
  | 'session/LOGOUT_ERROR'

export interface Action extends UnknownAction {
  type: Type
}

export interface InitAction extends Action {
  type: 'session/INIT'
}

export interface ClearErrorAction extends Action {
  type: 'session/CLEAR_ERROR'
  error: null
}

export interface LoginRequestedAction extends Action {
  type: 'session/LOGIN_REQUESTED'
  username: string
  password: string
}

export interface LoginSuccessAction extends Action {
  type: 'session/LOGIN_SUCCESS'
  token: string
}

export interface LoginErrorAction extends Action {
  type: 'session/LOGIN_ERROR'
  error: Error
}

export interface LogoutRequestedAction extends Action {
  type: 'session/LOGOUT_REQUESTED'
  token: string
}

export interface LogoutSuccessAction extends Action {
  type: 'session/LOGOUT_SUCCESS'
}

export interface LogoutErrorAction extends Action {
  type: 'session/LOGOUT_ERROR'
  error: Error
}

export interface SessionState {
  isLoading: boolean
  token: string | null
  error: Error | null
}

export const initialState: SessionState = {
  isLoading: false,
  token: null,
  error: null,
}

type Reducer = (state: SessionState, action: UnknownAction) => SessionState

export const reducer: Reducer = (
  state = initialState,
  action: UnknownAction,
): SessionState => {
  switch ((action as Action).type) {
    case 'session/INIT':
      return initialState
    case 'session/CLEAR_ERROR':
      return { ...state, error: null }
    case 'session/LOGIN_REQUESTED':
      return {
        ...state,
        isLoading: true,
        error: null,
        token: null,
      }
    case 'session/LOGIN_ERROR':
      return {
        ...state,
        isLoading: false,
        error: (action as LoginErrorAction).error,
      }
    case 'session/LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        token: (action as LoginSuccessAction).token,
      }
    case 'session/LOGOUT_REQUESTED':
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case 'session/LOGOUT_ERROR':
      return {
        ...state,
        isLoading: false,
        error: (action as LogoutErrorAction).error,
      }
    case 'session/LOGOUT_SUCCESS':
      return {
        ...state,
        isLoading: false,
        token: null,
      }

    default:
      return state
  }
}

export const actions = {
  init: (): InitAction => ({
    type: 'session/INIT',
  }),
  clearError: (): ClearErrorAction => ({
    type: 'session/CLEAR_ERROR',
    error: null,
  }),

  login: (username: string, password: string): LoginRequestedAction => ({
    type: 'session/LOGIN_REQUESTED',
    username,
    password,
  }),
  loginSuccess: (token: string): LoginSuccessAction => ({
    type: 'session/LOGIN_SUCCESS',
    token,
  }),
  loginError: (error: Error): LoginErrorAction => ({
    type: 'session/LOGIN_ERROR',
    error,
  }),

  logout: (token: string): LogoutRequestedAction => ({
    type: 'session/LOGOUT_REQUESTED',
    token,
  }),
  logoutSuccess: (): LogoutSuccessAction => ({
    type: 'session/LOGOUT_SUCCESS',
  }),
  logoutError: (error: Error): LogoutErrorAction => ({
    type: 'session/LOGOUT_ERROR',
    error,
  }),
}

export interface Store {
  session: SessionState
}

export const selectors = {
  getError: ({ session }: Store): Error | null => session.error,
  getToken: ({ session }: Store): string | null => session.token,
  getIsLoading: ({ session }: Store): boolean => session.isLoading,
}
