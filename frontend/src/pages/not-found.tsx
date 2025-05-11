import React, { useEffect, useState } from 'react'
import { Button } from '../components/button'
import { NavigateTo, useNavigateTo } from '../hooks/use-navigate-to'
import { useTranslation } from 'react-i18next'
import { Location, useLocation } from 'react-router-dom'
import { Loader } from '../components/loader'

export const NotFoundPage: () => React.ReactElement = () => {
  const { t } = useTranslation()
  const navigateTo: NavigateTo = useNavigateTo()
  const location: Location = useLocation()
  const [isReady, setIsReady] = useState<boolean>(false)

  const onGoToHomeClicked: () => void = () => {
    navigateTo.home()
  }

  useEffect(() => {
    if (location.pathname.endsWith('index.html')) {
      navigateTo.home()
    }
    setIsReady(true)
  }, [])

  if (!isReady) {
    return <Loader fullscreen={true} />
  }

  return (
    <div className="w3-display-container" style={{ height: '100vh' }}>
      <div className="w3-display-middle w3-center">
        <h1>{t('pageNotFound', { postProcess: 'capitalize' })}</h1>
        <p>{location.pathname}</p>
        <Button type="info" onClick={onGoToHomeClicked}>
          {t('goToHome', { postProcess: 'capitalize' })}
        </Button>
      </div>
    </div>
  )
}
