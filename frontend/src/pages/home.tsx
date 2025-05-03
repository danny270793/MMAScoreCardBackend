import React from 'react'
import { AppBar } from '../components/appbar'
import { List, ListItem } from '../components/list'
import { Section } from '../components/section'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch } from '@reduxjs/toolkit'
import {
  selectors as sessionSelectors,
  actions as sessionActions,
} from '../reducers/session'
import { useTranslation } from 'react-i18next'
import { ErrorModal } from '../components/error-modal'
import { NavigateTo, useNavigateTo } from '../hooks/use-navigate-to'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

export const HomePage: () => React.ReactElement = () => {
  const { t } = useTranslation()
  const navigateTo: NavigateTo = useNavigateTo()
  const dispatch: Dispatch = useDispatch()

  const error: Error | null = useSelector(sessionSelectors.getError)

  return (
    <>
      <ErrorModal
        error={error}
        onClose={() => dispatch(sessionActions.clearError())}
      />
      <AppBar
        title={t('appName')}
        actions={[
          {
            children: <FontAwesomeIcon icon={faGear} />,
            onClick: () => navigateTo.settings(),
            showIf: true,
          },
        ]}
      />
      <Section className="w3-animate-right">
        <List>
          <ListItem onClick={() => navigateTo.events()}>
            {t('events', { postProcess: 'capitalize' })}
          </ListItem>
          <ListItem onClick={() => navigateTo.fighters()}>
            {t('fighters', { postProcess: 'capitalize' })}
          </ListItem>
          <ListItem onClick={() => navigateTo.devices()}>
            {t('devices', { postProcess: 'capitalize' })}
          </ListItem>
        </List>
      </Section>
    </>
  )
}
