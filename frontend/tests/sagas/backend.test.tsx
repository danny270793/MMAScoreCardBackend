import { describe, it, expect } from 'vitest'
import { onLoadEventsRequest } from '../../src/sagas/backend'
import {
  actions,
  Event,
  LoadEventsRequestAction,
} from '../../src/reducers/backend'
import { call, put } from 'redux-saga/effects'
import { backend, Paginator } from '../../src/services/backend'

describe('backend sagas', () => {
  it('check that onLoadEventsRequest executes successfully', () => {
    const action: LoadEventsRequestAction = actions.loadEvents(1)
    const generator: Generator = onLoadEventsRequest(action)

    //check that next yield is a call to backend.getEvents
    expect(generator.next().value).toEqual(call(backend.getEvents, action.page))

    // check that next yield is a put to loadEventsSuccess
    const events: Paginator<Event> = { data: [], last_page: 1 }
    expect(generator.next(events).value).toEqual(
      put(actions.loadEventsSuccess(events)),
    )

    // check that sagas is done
    expect(generator.next().done).toBe(true)
  })
  it('check that onLoadEventsRequest executes wrong', () => {
    const action: LoadEventsRequestAction = actions.loadEvents(1)
    const generator: Generator = onLoadEventsRequest(action)

    //check that next yield is a call to backend.getEvents
    expect(generator.next().value).toEqual(call(backend.getEvents, action.page))

    // check that next yield is a put to loadEventsError
    const error: Error = new Error('Failed to fetch events')
    expect(generator.throw(error).value).toEqual(
      put(actions.loadEventsError(error)),
    )

    // check that sagas is done
    expect(generator.next().done).toBe(true)
  })
})
