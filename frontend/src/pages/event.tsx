import { Dispatch } from '@reduxjs/toolkit'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectors as backendSelectors,
  actions as backendActions,
  EventWithFights,
  Fight,
} from '../reducers/backend'
import { useParams } from 'react-router-dom'
import { AppBar } from '../components/appbar'
import { BottomBar } from '../components/bottombar'
import { EventDescription } from '../components/event-description'
import { FightDescription } from '../components/fight-description'
import { WithLoader } from '../components/with-loader'
import { Section } from '../components/section'
import { List, ListItem } from '../components/list'
import { Card } from '../components/card'
import { NavigateTo, useNavigateTo } from '../hooks/use-navigate-to'
import { ErrorModal } from '../components/error-modal'
import { useTranslation } from 'react-i18next'

type EventPageParams = {
  id: string | undefined
}

export const EventPage: () => React.ReactElement = () => {
  const { t } = useTranslation()
  const { id } = useParams<EventPageParams>()

  const dispatch: Dispatch = useDispatch()
  const navigateTo: NavigateTo = useNavigateTo()

  useEffect(() => {
    const idParsed: number = parseInt(id || '1')
    dispatch(backendActions.loadEvent(idParsed))
  }, [id])

  const event: EventWithFights | null = useSelector(backendSelectors.getEvent)

  const isLoading: boolean = useSelector(backendSelectors.getIsLoading)
  const error: Error | null = useSelector(backendSelectors.getError)

  const onSeeMoreClicked: (fight: Fight) => void = (fight: Fight) => {
    navigateTo.fight(fight.id)
  }

  return (
    <>
      <ErrorModal
        error={error}
        onClose={() => dispatch(backendActions.clearError())}
      />
      <AppBar title={event ? event.name : 'Event'} />
      <WithLoader isLoading={isLoading}>
        {event && (
          <Section>
            <h5>{t('event', { postProcess: 'capitalize' })}</h5>
            <Card>
              <EventDescription event={event!} showEventName={false} />
            </Card>

            <h5>{t('fights', { postProcess: 'capitalize' })}</h5>
            <List>
              {event.fights.length === 0 && (
                <ListItem>
                  {t('fightsNotFound', { postProcess: 'capitalize' })}
                </ListItem>
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
      </WithLoader>
      <BottomBar>
        {event?.fights.length ?? 0}{' '}
        {event?.fights.length === 1 ? t('fight') : t('fights')}
      </BottomBar>
    </>
  )
}
