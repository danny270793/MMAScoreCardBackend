import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Location, useLocation } from 'react-router-dom'
import { Button } from './button'
import { NavigateTo, useNavigateTo } from '../hooks/use-navigate-to'

export interface AppBarAction {
  showIf: boolean
  onClick: () => void
  children: React.ReactElement
}

export interface AppBarProps {
  actions?: AppBarAction[]
  title: string
}

export const AppBar: (props: AppBarProps) => React.ReactElement = ({
  actions = [],
  title,
}: AppBarProps): React.ReactElement => {
  const navigateTo: NavigateTo = useNavigateTo()
  const location: Location = useLocation()

  const onBackClicked: () => void = () => {
    navigateTo.back()
  }
  return (
    <>
      <div className="w3-top">
        <div className="accent-color w3-bar">
          {!['/', '/index.html', '/login'].includes(location.pathname) && (
            <Button className="w3-bar-item" onClick={onBackClicked}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </Button>
          )}
          <div className="w3-bar-item">{title}</div>

          {actions.map((action: AppBarAction, index: number) => (
            <div key={index} className="w3-right">
              {action.showIf ? (
                <Button onClick={action.onClick}>{action.children}</Button>
              ) : (
                <></>
              )}
            </div>
          ))}
        </div>
      </div>
      <br />
      <br />
    </>
  )
}
