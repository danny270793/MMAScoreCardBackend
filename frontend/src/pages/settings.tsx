import React, { useState } from 'react'
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
import { WithLoader } from '../components/with-loader'
import { Theme, useTheme } from '../context/theme-context'
import { Modal } from '../components/modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaintBrush, faSignOut } from '@fortawesome/free-solid-svg-icons'

export const SettingsPage: () => React.ReactElement = () => {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const dispatch: Dispatch = useDispatch()

  const isLoading: boolean = useSelector(sessionSelectors.getIsLoading)
  const error: Error | null = useSelector(sessionSelectors.getError)
  const token: string | null = useSelector(sessionSelectors.getToken)

  const logout = () => {
    dispatch(sessionActions.logout(token!))
  }

  const [showThemeChange, setShowThemeChange] = useState<boolean>(false)
  const onThemeChangeClosed = () => {
    setShowThemeChange(false)
  }

  const onSetThemeClicked = (theme: Theme) => {
    setTheme(theme)
    setShowThemeChange(false)
  }

  return (
    <>
      <ErrorModal
        error={error}
        onClose={() => dispatch(sessionActions.clearError())}
      />
      {showThemeChange && (
        <Modal title="Theme" onClose={onThemeChangeClosed}>
          <List>
            <ListItem onClick={() => onSetThemeClicked('system')}>
              {t('system', { postProcess: 'capitalize' })}
            </ListItem>
            <ListItem onClick={() => onSetThemeClicked('dark')}>
              {t('dark', { postProcess: 'capitalize' })}
            </ListItem>
            <ListItem onClick={() => onSetThemeClicked('light')}>
              {t('light', { postProcess: 'capitalize' })}
            </ListItem>
          </List>
        </Modal>
      )}
      <AppBar title={t('settings', { postProcess: 'capitalize' })} />
      <WithLoader isLoading={isLoading}>
        <Section>
          <List>
            <ListItem onClick={() => setShowThemeChange(true)}>
              <>
                <div className="w3-right">
                  {theme === 'system'
                    ? t('system', { postProcess: 'capitalize' })
                    : theme === 'light'
                      ? t('light', { postProcess: 'capitalize' })
                      : theme === 'dark'
                        ? t('dark', { postProcess: 'capitalize' })
                        : t('noTheme', { postProcess: 'capitalize' })}
                </div>
                <span>
                  <FontAwesomeIcon icon={faPaintBrush} />
                </span>
                &nbsp;&nbsp;&nbsp;
                <span>{t('theme', { postProcess: 'capitalize' })}</span>
              </>
            </ListItem>
            <ListItem onClick={logout}>
              <>
                <span>
                  <FontAwesomeIcon icon={faSignOut} />
                </span>
                &nbsp;&nbsp;&nbsp;
                <span>{t('logout', { postProcess: 'capitalize' })}</span>
              </>
            </ListItem>
          </List>
        </Section>
      </WithLoader>
    </>
  )
}
