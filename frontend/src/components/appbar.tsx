import React from 'react'
import {
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
} from 'react-router-dom'

export interface AppBarProps {
  title: string
}

export const AppBar: (props: AppBarProps) => React.ReactElement = (
  props: AppBarProps,
): React.ReactElement => {
  const navigate: NavigateFunction = useNavigate()
  const location: Location = useLocation()

  const onBackClicked: () => void = () => {
    navigate(-1)
  }
  return (
    <div>
      <div className="w3-top">
        <div className="w3-blue w3-bar">
          {location.pathname !== '/' && (
            <button className="w3-bar-item w3-blue" onClick={onBackClicked}>
              {'<'}
            </button>
          )}
          <div className="w3-bar-item">{props.title}</div>
        </div>
      </div>
      <br />
      <br />
    </div>
  )
}
