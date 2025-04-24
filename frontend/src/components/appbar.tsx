import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import {
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { Button } from './button'

export interface AppBarProps {
  actions?: React.ReactElement[]
  title: string
}

export const AppBar: (props: AppBarProps) => React.ReactElement = ({
  actions = [],
  title,
}: AppBarProps): React.ReactElement => {
  const navigate: NavigateFunction = useNavigate()
  const location: Location = useLocation()

  const onBackClicked: () => void = () => {
    navigate(-1)
  }
  return (
    <div>
      <div className="w3-top">
        <div className="w3-blue w3-bar">
          {!['/', '/index.html', '/login'].includes(location.pathname) && (
            <Button className="w3-bar-item" onClick={onBackClicked}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </Button>
          )}
          <div className="w3-bar-item">{title}</div>

          {actions.map((action: React.ReactElement, index: number) => (
            <div key={index} className="w3-right ">
              {action}
            </div>
          ))}
        </div>
      </div>
      <br />
      <br />
    </div>
  )
}
