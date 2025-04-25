import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { combineReducers, Middleware, Reducer, UnknownAction } from 'redux'
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga'
import { reducer as backendReducer, BackendState } from './backend'
import { reducer as sessionReducer, SessionState } from './session'
import { rootSagas } from '../sagas'
import {
  PersistConfig,
  Persistor,
  persistReducer,
  persistStore,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { Logger } from '../utils/logger'

const logger: Logger = new Logger('/src/reducers/index.ts')

const sagaMiddleware: SagaMiddleware = createSagaMiddleware()

export type RootReducer = { backend: BackendState; session: SessionState }

export const rootReducer: Reducer<RootReducer> = combineReducers({
  backend: backendReducer,
  session: sessionReducer,
})

const persistConfig: PersistConfig<RootReducer> = {
  key: 'root',
  storage,
  whitelist: ['session'],
}

const persistedReducer: Reducer = persistReducer<RootReducer>(
  persistConfig,
  rootReducer,
)

const storeLogger: Middleware = () => (next) => (action) => {
  if (import.meta.env.MODE === 'development') {
    logger.debug(`Dispatching action: ${(action as UnknownAction).type}`)
  }
  return next(action)
}

export const store: EnhancedStore<RootReducer> = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware, storeLogger),
})

sagaMiddleware.run(rootSagas)

export const persistedStore: Persistor = persistStore(store)
