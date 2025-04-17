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
import { Loader } from '../components/loader'
import { AppBar } from '../components/appbar'
import { BottomBar } from '../components/bottombar'
import { EventDescription } from '../components/event-description'
import { FightDescription } from '../components/fight-description'

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
      {isLoading && <Loader />}
      {event && (
        <div>
          <AppBar title={event.name} />
          <div className="w3-container">
            <h5>Event</h5>
            <div className="w3-container w3-white w3-round">
              <EventDescription event={event} showEventName={false} />
              <br />
            </div>

            <h5>Fights</h5>
            <ul className="w3-ul w3-white w3-round w3-hoverable">
              {event.fights.length === 0 && <li>No fights found</li>}
              {event.fights.length > 0 &&
                event.fights.map((fight: Fight) => (
                  <li key={fight.id}>
                    <FightDescription
                      fight={fight}
                      onSeeMoreClicked={() => onSeeMoreClicked(fight)}
                      showReferee={false}
                      showFighters={true}
                    />
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
      {event && (
        <BottomBar>
          <div className="w3-center">{event.fights.length} fights</div>
        </BottomBar>
      )}
    </div>
  )
}
