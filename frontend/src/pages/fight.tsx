import { Dispatch } from '@reduxjs/toolkit'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectors as backendSelectors,
  actions as backendActions,
  Fight,
  Fighter,
} from '../reducers/backend'
import { useParams } from 'react-router-dom'
import { AppBar } from '../components/appbar'
import { FightDescription } from '../components/fight-description'
import { FighterDescription } from '../components/fighter-description'
import { Section } from '../components/section'
import { WithLoader } from '../components/with-loader'
import { Card } from '../components/card'
import { List, ListItem } from '../components/list'
import { NavigateTo, useNavigateTo } from '../hooks/use-navigate-to'
import { ErrorModal } from '../components/error-modal'
import { useTranslation } from 'react-i18next'

type EventPageParams = {
  id: string | undefined
}

export const FightPage: () => React.ReactElement = () => {
  const { t } = useTranslation()
  const { id } = useParams<EventPageParams>()

  const dispatch: Dispatch = useDispatch()
  const navigateTo: NavigateTo = useNavigateTo()

  useEffect(() => {
    const idParsed: number = parseInt(id || '1')
    dispatch(backendActions.loadFight(idParsed))
  }, [id])

  const fight: Fight | null = useSelector(backendSelectors.getFight)

  const isLoading: boolean = useSelector(backendSelectors.getIsLoading)
  const error: Error | null = useSelector(backendSelectors.getError)

  const onSeeMoreClicked: (fighter: Fighter) => void = (fight: Fighter) => {
    navigateTo.fighter(fight.id)
  }

  return (
    <>
      <ErrorModal
        error={error}
        onClose={() => dispatch(backendActions.clearError())}
      />
      <AppBar
        title={
          fight
            ? `${fight.fighter1.name} vs ${fight.fighter2.name}`
            : t('fight', { postProcess: 'capitalize' })
        }
      />
      <WithLoader isLoading={isLoading}>
        {fight && (
          <Section>
            <h5>{t('fight', { postProcess: 'capitalize' })}</h5>
            <Card>
              <br />
              <FightDescription
                fight={fight}
                showReferee={true}
                showFighters={false}
              />
              <br />
            </Card>
            <h5>{t('fighters', { postProcess: 'capitalize' })}</h5>
            <List>
              {[fight.fighter1, fight.fighter2].map((fighter: Fighter) => (
                <ListItem key={fighter.id}>
                  <div className="w3-right">
                    {fight.fighter1_result === 'win' &&
                    fight.fighter1.id === fighter.id ? (
                      <div className="w3-tag w3-green w3-round">
                        {t('win', { postProcess: 'upper' })}
                      </div>
                    ) : (
                      ''
                    )}

                    {fight.fighter2_result === 'win' &&
                    fight.fighter2.id === fighter.id ? (
                      <div className="w3-tag w3-green w3-round">
                        {t('win', { postProcess: 'upper' })}
                      </div>
                    ) : (
                      ''
                    )}

                    {fight.fighter1_result === 'loss' &&
                    fight.fighter1.id === fighter.id ? (
                      <div className="w3-tag w3-red w3-round">
                        {t('loss', { postProcess: 'upper' })}
                      </div>
                    ) : (
                      ''
                    )}

                    {fight.fighter2_result === 'loss' &&
                    fight.fighter2.id === fighter.id ? (
                      <div className="w3-tag w3-red w3-round">
                        {t('loss', { postProcess: 'upper' })}
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                  <FighterDescription
                    fighter={fighter}
                    onSeeMoreClicked={() => onSeeMoreClicked(fighter)}
                  />
                </ListItem>
              ))}
            </List>
          </Section>
        )}
      </WithLoader>
    </>
  )
}
