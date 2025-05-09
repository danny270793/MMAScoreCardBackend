import { call, ForkEffect, put, takeLatest } from 'redux-saga/effects'
import { Action } from '@reduxjs/toolkit'
import {
  actions as sessionActions,
  Type as SessionTypes,
  LoginRequestedAction,
  LogoutRequestedAction,
} from '../reducers/session'
import { actions as backendActions } from '../reducers/session'
import { backend } from '../services/backend'
import { DeviceInfo, getDeviceInfo } from '../utils/device'
import { UnauthorizedClientError } from '../services/http/errors'

export const sagas: ForkEffect[] = [
  takeLatest<SessionTypes>('session/LOGIN_REQUESTED', onLoginRequested),
  takeLatest<SessionTypes>('session/LOGOUT_REQUESTED', onLogoutRequest),
]

export function* redirectIfUnauthorized(error: unknown) {
  if (error instanceof UnauthorizedClientError) {
    yield put(sessionActions.init())
    yield put(backendActions.init())
    yield put(sessionActions.logoutSuccess())
  }
}

export function* onLoginRequested(action: Action) {
  try {
    const castedAction: LoginRequestedAction = action as LoginRequestedAction

    const device: DeviceInfo = yield call(getDeviceInfo)

    const token: string = yield call(
      backend.login,
      castedAction.username,
      castedAction.password,
      device.manufacturer,
      device.model,
      device.osModel,
      device.platform,
      device.version,
      device.osVersion,
    )
    yield put(sessionActions.loginSuccess(token))
  } catch (error) {
    yield put(sessionActions.loginError(error as Error))
  }
}

export function* onLogoutRequest(action: Action) {
  try {
    const castedAction: LogoutRequestedAction = action as LogoutRequestedAction
    yield call(backend.logout, castedAction.token)
    yield put(sessionActions.logoutSuccess())
  } catch (error) {
    yield call(redirectIfUnauthorized, error)
    yield put(sessionActions.logoutError(error as Error))
  }
}
