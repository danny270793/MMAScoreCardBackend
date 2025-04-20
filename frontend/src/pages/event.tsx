import { Dispatch } from '@reduxjs/toolkit'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectors as backendSelectors,
  actions as backendActions,
  EventWithFights,
  Fight,
} from '../reducers/backend'
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom'
import { Modal } from '../components/modal'
import { AppBar } from '../components/appbar'
import { BottomBar } from '../components/bottombar'
import { EventDescription } from '../components/event-description'
import { FightDescription } from '../components/fight-description'
import { WithLoader } from '../components/with-loader'
import { Section } from '../components/section'
import { List, ListItem } from '../components/list'
import { Card } from '../components/card'

type EventPageParams = {
  id: string | undefined
}

export const EventPage: () => React.ReactElement = () => {
  const { id } = useParams<EventPageParams>()

  const dispatch: Dispatch = useDispatch()
  const navigate: NavigateFunction = useNavigate()

  useEffect(() => {
    const idParsed: number = parseInt(id || '1')
    dispatch(backendActions.loadEvent(idParsed))
  }, [id])

  const event: EventWithFights | null = useSelector(backendSelectors.getEvent)

  const isLoading: boolean = useSelector(backendSelectors.getIsLoading)
  const error: Error | null = useSelector(backendSelectors.getError)

  const onSeeMoreClicked: (fight: Fight) => void = (fight: Fight) => {
    navigate(`/fight/${fight.id}`)
  }

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
      {event && <AppBar title={event.name} />}
      {!event && <AppBar title={'Event'} />}
      <WithLoader isLoading={isLoading}>
        <>
          {event && (
            <Section>
              <h5>Event</h5>
              <Card>
                <EventDescription event={event!} showEventName={false} />
                <br />
              </Card>

              <h5>Fights</h5>
              <List>
                {event.fights.length === 0 && (
                  <ListItem>No fights found</ListItem>
                )}
                {event.fights.length > 0 &&
                  event.fights.map((fight: Fight) => (
                    <ListItem key={fight.id}>
                      <FightDescription
                        fight={fight}
                        onSeeMoreClicked={() => onSeeMoreClicked(fight)}
                        showReferee={false}
                        showFighters={true}
                      />
                    </ListItem>
                  ))}
              </List>
            </Section>
          )}
        </>
      </WithLoader>
      <BottomBar>{event?.fights.length ?? 0} fights</BottomBar>
    </>
  )
}
