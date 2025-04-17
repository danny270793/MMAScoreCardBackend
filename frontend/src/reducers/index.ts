import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { combineReducers, Reducer } from 'redux'
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga'
import { reducer as backendReducer } from './backend'
import { rootSagas } from '../sagas'

const sagaMiddleware: SagaMiddleware = createSagaMiddleware()

export const rootReducer: Reducer = combineReducers({
  backend: backendReducer,
})

export const store: EnhancedStore = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware),
})

sagaMiddleware.run(rootSagas)
