import { Dispatch } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectors as backendSelectors,
  actions as backendActions,
  Event,
} from '../reducers/backend'
import { Paginator } from '../services/backend'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { EventDescription } from '../components/event-description'
import { Loader } from '../components/loader'
import { AppBar } from '../components/appbar'
import { Modal } from '../components/modal'

export const EventsPage: () => React.ReactElement = () => {
  const navigate: NavigateFunction = useNavigate()
  const dispatch: Dispatch = useDispatch()
  const [page, setPage] = useState<number>(1)
  const [allEvents, setAllEvents] = useState<Event[]>([])

  useEffect(() => {
    dispatch(backendActions.loadEvents(page))
  }, [])

  useEffect(() => {
    dispatch(backendActions.loadEvents(page))
  }, [page])

  const events: Paginator<Event> | null = useSelector(
    backendSelectors.getEvents,
  )

  useEffect(() => {
    setAllEvents((prevEvents: Event[]) => {
      const newEvents: Event[] = events?.data || []
      const nonRepeatedNewEvents: Event[] = newEvents.filter(
        (event: Event) =>
          !prevEvents.map((event: Event) => event.id).includes(event.id),
      )
      return [...prevEvents, ...nonRepeatedNewEvents]
    })
  }, [events])

  const error: Error | null = useSelector(backendSelectors.getError)

  const isLoading: boolean = useSelector(backendSelectors.getIsLoading)

  const onLoadMoreClicked: () => void = () => {
    setPage((prevPage: number) => prevPage + 1)
  }

  const onSeeMoreClicked: (event: Event) => void = (event: Event) => {
    navigate(`/events/${event.id}`)
  }

  return (
    <div>
      {error && (
        <Modal
          title="Error"
          onClose={() => dispatch(backendActions.clearError())}
        >
          <p>{error.message}</p>
          <pre style={{ overflow: 'auto' }}>{error.stack}</pre>
        </Modal>
      )}
      <AppBar title="Events" />
      {isLoading && <Loader />}
      <div className="w3-container">
        <ul className="w3-ul w3-white w3-round w3-hoverable">
          {allEvents.length === 0 && <li>No events found</li>}
          {allEvents.length > 0 &&
            allEvents.map((event: Event) => (
              <li key={event.id}>
                <EventDescription
                  event={event}
                  showEventName={true}
                  onSeeMoreClicked={onSeeMoreClicked}
                />
              </li>
            ))}
        </ul>
      </div>
      {isLoading && <Loader size="small" />}
      {!isLoading && (
        <button className="w3-button w3-block" onClick={onLoadMoreClicked}>
          Load more
        </button>
      )}
    </div>
  )
}
