import React from 'react'
import { Button } from '../components/button'
import { NavigateTo, useNavigateTo } from '../hooks/use-navigate-to'
import { useTranslation } from 'react-i18next'

export const NotFoundPage: () => React.ReactElement = () => {
  const { t } = useTranslation()
  const navigateTo: NavigateTo = useNavigateTo()

  const onGoToHomeClicked: () => void = () => {
    navigateTo.home()
  }

  return (
    <div className="w3-display-container" style={{ height: '100vh' }}>
      <div className="w3-display-middle w3-center">
        <h1>{t('pageNotFound', { postProcess: 'capitalize' })}</h1>
        <Button type="info" onClick={onGoToHomeClicked}>
          {t('goToHome', { postProcess: 'capitalize' })}
        </Button>
      </div>
    </div>
  )
}
