import { all, ForkEffect } from 'redux-saga/effects'
import { sagas as backendSagas } from './backend'
import { sagas as sessionSagas } from './session'

const sagasAvailable: ForkEffect[] = [...backendSagas, ...sessionSagas]

export const rootSagas = function* () {
  yield all(sagasAvailable.map((saga) => saga))
}
