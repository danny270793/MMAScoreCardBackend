import { call, ForkEffect, put, takeLatest } from 'redux-saga/effects'
import { Action } from '@reduxjs/toolkit'
import {
  actions as backendActions,
  LoadEventsRequestAction,
  Type as BackendTypes,
  LoadEventRequestAction,
  LoadFightRequestAction,
  LoadFighterRequestAction,
  LoadFightersRequestAction,
  SearchFightersRequestAction,
  Event,
  Fight,
  Fighter,
  Streak,
  Record,
  Device,
  DeleteDeviceRequestedAction,
  GetDeviceRequestedAction,
  UpdateDeviceRequestedAction,
} from '../reducers/backend'
import { backend, Paginator } from '../services/backend'
import { redirectIfUnauthorized } from './session'

export const sagas: ForkEffect[] = [
  takeLatest<BackendTypes>('backend/LOAD_EVENTS_REQUEST', onLoadEventsRequest),
  takeLatest<BackendTypes>('backend/LOAD_EVENT_REQUEST', onLoadEventRequest),
  takeLatest<BackendTypes>('backend/LOAD_FIGHT_REQUEST', onLoadFightRequest),
  takeLatest<BackendTypes>(
    'backend/LOAD_FIGHTER_REQUEST',
    onLoadFighterRequest,
  ),
  takeLatest<BackendTypes>(
    'backend/LOAD_FIGHTERS_REQUEST',
    onLoadFightersRequest,
  ),
  takeLatest<BackendTypes>(
    'backend/SEARCH_FIGHTERS_REQUEST',
    onSearchFightersRequest,
  ),
  takeLatest<BackendTypes>(
    'backend/GET_DEVICES_REQUESTED',
    onGetDevicesRequest,
  ),
  takeLatest<BackendTypes>(
    'backend/DELETE_DEVICE_REQUESTED',
    onDeleteDeviceRequest,
  ),
  takeLatest<BackendTypes>('backend/GET_DEVICE_REQUESTED', onGetDeviceRequest),
  takeLatest<BackendTypes>(
    'backend/UPDATE_DEVICE_REQUESTED',
    onUpdateDeviceRequest,
  ),
]

export function* onLoadEventsRequest(action: Action) {
  try {
    const castedAction: LoadEventsRequestAction =
      action as LoadEventsRequestAction

    const events: Paginator<Event> = yield call(
      backend.getEvents,
      castedAction.page,
    )
    yield put(backendActions.loadEventsSuccess(events))
  } catch (error) {
    yield call(redirectIfUnauthorized, error)
    yield put(backendActions.loadEventsError(error as Error))
  }
}

function* onLoadEventRequest(action: Action) {
  try {
    const castedAction: LoadEventRequestAction =
      action as LoadEventRequestAction

    const event: Event = yield call(backend.getEvent, castedAction.id)
    const fights: Fight[] = []

    let hasMorePages: boolean = true
    let currentPage: number = 0
    while (hasMorePages) {
      currentPage += 1

      const page: Paginator<Fight> = yield call(
        backend.getEventFights,
        castedAction.id,
        currentPage,
      )
      if (page.last_page === currentPage) {
        hasMorePages = false
      }
      fights.push(...page.data)
    }

    yield put(backendActions.loadEventSuccess({ ...event, fights: fights }))
  } catch (error) {
    yield call(redirectIfUnauthorized, error)
    yield put(backendActions.loadEventError(error as Error))
  }
}

function* onLoadFightRequest(action: Action) {
  try {
    const castedAction: LoadFightRequestAction =
      action as LoadFightRequestAction

    const fight: Fight = yield call(backend.getFight, castedAction.id)
    yield put(backendActions.loadFightSuccess(fight))
  } catch (error) {
    yield call(redirectIfUnauthorized, error)
    yield put(backendActions.loadFightError(error as Error))
  }
}

function* onLoadFighterRequest(action: Action) {
  try {
    const castedAction: LoadFighterRequestAction =
      action as LoadFighterRequestAction

    const fighter: Fighter = yield call(backend.getFighter, castedAction.id)
    const fights: Fight[] = []

    let hasMorePages: boolean = true
    let currentPage: number = 0
    while (hasMorePages) {
      currentPage += 1

      const page: Paginator<Fight> = yield call(
        backend.getFighterFights,
        castedAction.id,
        currentPage,
      )
      if (page.last_page === currentPage) {
        hasMorePages = false
      }
      fights.push(...page.data)
    }

    const streaks: Streak[] = yield call(
      backend.getFighterStreaks,
      castedAction.id,
    )

    const records: Record[] = yield call(
      backend.getFighterRecords,
      castedAction.id,
    )

    yield put(
      backendActions.loadFighterSuccess({
        ...fighter,
        fights,
        streaks,
        records,
      }),
    )
  } catch (error) {
    yield call(redirectIfUnauthorized, error)
    yield put(backendActions.loadFighterError(error as Error))
  }
}

function* onLoadFightersRequest(action: Action) {
  try {
    const castedAction: LoadFightersRequestAction =
      action as LoadFightersRequestAction

    const fighters: Paginator<Fighter> = yield call(
      backend.getFighters,
      castedAction.page,
    )
    yield put(backendActions.loadFightersSuccess(fighters))
  } catch (error) {
    yield call(redirectIfUnauthorized, error)
    yield put(backendActions.loadFightersError(error as Error))
  }
}

function* onSearchFightersRequest(action: Action) {
  try {
    const castedAction: SearchFightersRequestAction =
      action as SearchFightersRequestAction

    const fighters: Paginator<Fighter> = yield call(
      backend.searchFighters,
      castedAction.page,
      castedAction.query,
    )
    yield put(backendActions.searchFightersSuccess(fighters))
  } catch (error) {
    yield call(redirectIfUnauthorized, error)
    yield put(backendActions.searchFightersError(error as Error))
  }
}

export function* onGetDevicesRequest() {
  try {
    const devices: Device[] = yield call(backend.getDevices)
    yield put(backendActions.getDevicesSuccess(devices))
  } catch (error) {
    yield call(redirectIfUnauthorized, error)
    yield put(backendActions.getDevicesError(error as Error))
  }
}

export function* onDeleteDeviceRequest(action: Action) {
  try {
    const castedAction: DeleteDeviceRequestedAction =
      action as DeleteDeviceRequestedAction

    // TODO: navigate back on device deleted
    yield call(backend.deleteDevice, castedAction.id)
    // const devices: Device[] = yield select(backendSelectors.getDevices)
    yield put(backendActions.deleteDeviceSuccess())
    // yield put(backendActions.getDevicesSuccess(devices.filter((device: Device) => device.id !== castedAction.id)))
  } catch (error) {
    yield call(redirectIfUnauthorized, error)
    yield put(backendActions.deleteDeviceError(error as Error))
  }
}

export function* onGetDeviceRequest(action: Action) {
  try {
    const castedAction: GetDeviceRequestedAction =
      action as GetDeviceRequestedAction

    const device: Device = yield call(backend.getDevice, castedAction.id)
    yield put(backendActions.getDeviceSuccess(device))
  } catch (error) {
    yield call(redirectIfUnauthorized, error)
    yield put(backendActions.getDeviceError(error as Error))
  }
}

export function* onUpdateDeviceRequest(action: Action) {
  try {
    const castedAction: UpdateDeviceRequestedAction =
      action as UpdateDeviceRequestedAction

    const device: Device = yield call(
      backend.updateDevice,
      castedAction.id,
      castedAction.name,
    )
    yield put(backendActions.updateDeviceSuccess(device))
  } catch (error) {
    yield call(redirectIfUnauthorized, error)
    yield put(backendActions.updateDeviceError(error as Error))
  }
}
