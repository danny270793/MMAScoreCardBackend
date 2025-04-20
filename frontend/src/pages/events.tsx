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
import { List, ListItem } from '../components/list'
import { Section } from '../components/section'
import { Button } from '../components/button'
import { WithLoader } from '../components/with-loader'

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
  const isLoadingMore: boolean = useSelector(backendSelectors.getIsLoadingMore)

  const onLoadMoreClicked: () => void = () => {
    setPage((prevPage: number) => prevPage + 1)
  }

  const onSeeMoreClicked: (event: Event) => void = (event: Event) => {
    navigate(`/events/${event.id}`)
  }

  const showLoadMoreButton: boolean =
    events && events.data.length > 0 ? true : false

  return (
    <>
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
      <WithLoader isLoading={!isLoadingMore && isLoading}>
        <>
          <Section>
            <List>
              {allEvents.length === 0 && <ListItem>No events found</ListItem>}
              {allEvents.length > 0 &&
                allEvents.map((event: Event) => (
                  <ListItem key={event.id}>
                    <EventDescription
                      event={event}
                      showEventName={true}
                      onSeeMoreClicked={onSeeMoreClicked}
                    />
                  </ListItem>
                ))}
            </List>
          </Section>
          {isLoadingMore && <Loader size="small" />}
          {!isLoadingMore && showLoadMoreButton && (
            <Button onClick={onLoadMoreClicked}>Load more</Button>
          )}
        </>
      </WithLoader>
    </>
  )
}
