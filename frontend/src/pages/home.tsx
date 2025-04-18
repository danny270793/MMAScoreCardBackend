import React from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { AppBar } from '../components/appbar'

export const HomePage: () => React.ReactElement = () => {
  const navigate: NavigateFunction = useNavigate()
  return (
    <div>
      <AppBar title={'MMA Scorecard'} />
      <div className="w3-container">
        <ul className="w3-ul w3-white w3-round w3-hoverable">
          <li onClick={() => navigate('/events')}>Events</li>
          <li onClick={() => navigate('/fighters')}>Fighters</li>
        </ul>
      </div>
    </div>
  )
}
