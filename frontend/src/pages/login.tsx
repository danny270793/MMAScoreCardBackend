import React, { FormEvent, FormEventHandler, useEffect, useState } from 'react'
import { AppBar } from '../components/appbar'
import { Card } from '../components/card'
import { Button } from '../components/button'
import { Dispatch } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectors as sessionSelectors,
  actions as sessionActions,
} from '../reducers/session'
import { Loader } from '../components/loader'
import { NavigateTo, useNavigateTo } from '../hooks/use-navigate-to'
import { ApiValidationError } from '../services/http/errors'
import { useTranslation } from 'react-i18next'
import { Input } from '../components/input'
import { ErrorModal } from '../components/error-modal'

export const LoginPage: () => React.ReactElement = () => {
  const { t } = useTranslation()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const dispatch: Dispatch = useDispatch()
  const navigateTo: NavigateTo = useNavigateTo()

  const onSubmit: FormEventHandler<HTMLFormElement> = (
    event: FormEvent,
  ): void => {
    event.preventDefault()
    dispatch(sessionActions.login(email, password))
  }

  const isLoading: boolean = useSelector(sessionSelectors.getIsLoading)
  const error: Error | null = useSelector(sessionSelectors.getError)
  const token: string | null = useSelector(sessionSelectors.getToken)

  useEffect(() => {
    if (!token) {
      return
    }

    navigateTo.home()
  }, [token])

  useEffect(() => {
    if (token) {
      navigateTo.home()
    }
  }, [])

  return (
    <>
      <AppBar title={t('login', { postProcess: 'capitalize' })} />
      <ErrorModal
        error={error}
        onClose={() => dispatch(sessionActions.clearError())}
      />
      <form className="w3-container" onSubmit={onSubmit}>
        <Card>
          <Input
            type="text"
            label={t('email', { postProcess: 'capitalize' })}
            value={email}
            onChange={(email: string) => setEmail(email)}
            placeholder={t('email', { postProcess: 'capitalize' })}
            disabled={isLoading}
            errors={
              error instanceof ApiValidationError
                ? error.errors['email']
                : undefined
            }
          />
          <br />

          <Input
            type="password"
            label={t('password', { postProcess: 'capitalize' })}
            value={password}
            onChange={(password: string) => setPassword(password)}
            placeholder={t('password', { postProcess: 'capitalize' })}
            disabled={isLoading}
            errors={
              error instanceof ApiValidationError
                ? error.errors['password']
                : undefined
            }
          />
          <br />
          {isLoading && <Loader size="xsmall" />}
          {!isLoading && (
            <Button className="w3-block w3-blue">
              {t('login', { postProcess: 'upper' })}
            </Button>
          )}
        </Card>
      </form>
    </>
  )
}
