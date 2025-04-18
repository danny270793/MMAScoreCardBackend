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
} from '../reducers/backend'
import { backend, Paginator } from '../services/backend'

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
    yield put(backendActions.searchFightersError(error as Error))
  }
}
