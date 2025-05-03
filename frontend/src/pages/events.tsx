import { Dispatch } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectors as backendSelectors,
  actions as backendActions,
  Event,
} from '../reducers/backend'
import { EventDescription } from '../components/event-description'
import { Loader } from '../components/loader'
import { AppBar } from '../components/appbar'
import { List, ListItem } from '../components/list'
import { Section } from '../components/section'
import { Button } from '../components/button'
import { WithLoader } from '../components/with-loader'
import { NavigateTo, useNavigateTo } from '../hooks/use-navigate-to'
import { ErrorModal } from '../components/error-modal'
import { Paginator } from '../services/backend/models'
import { useTranslation } from 'react-i18next'

export const EventsPage: () => React.ReactElement = () => {
  const { t } = useTranslation()
  const navigateTo: NavigateTo = useNavigateTo()
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
    navigateTo.event(event.id)
  }

  const showLoadMoreButton: boolean =
    events && events.data.length > 0 ? true : false

  return (
    <>
      <ErrorModal
        error={error}
        onClose={() => dispatch(backendActions.clearError())}
      />
      <AppBar title={t('events', { postProcess: 'capitalize' })} />
      <WithLoader isLoading={!isLoadingMore && isLoading}>
        <Section>
          <List>
            {allEvents.length === 0 && (
              <ListItem>
                {t('eventsNotFound', { postProcess: 'capitalize' })}
              </ListItem>
            )}
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
          <Button onClick={onLoadMoreClicked}>
            {t('loadMore', { postProcess: 'capitalize' })}
          </Button>
        )}
      </WithLoader>
    </>
  )
}
