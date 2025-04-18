import React from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'

export const NotFoundPage: () => React.ReactElement = () => {
  const navigate: NavigateFunction = useNavigate()

  const onGoToHomeClicked: () => void = () => {
    navigate(`/events`)
  }

  return (
    <div>
      <h1>The page you&apos;re looking for was not found</h1>
      <button onClick={onGoToHomeClicked}>Go to home</button>
    </div>
  )
}
