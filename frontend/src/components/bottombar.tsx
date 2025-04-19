import React from 'react'
import { isiOS } from '../utils/device'

export interface AppBarProps {
  children: React.ReactNode
}

export const BottomBar: (props: AppBarProps) => React.ReactElement = (
  props: AppBarProps,
): React.ReactElement => {
  return (
    <div>
      <br />
      <br />
      <div className="w3-blue w3-bottom">
        <div className="w3-bar">
          <div className="w3-bar-item w3-mobile">{props.children}</div>
        </div>
        {isiOS() && <br />}
      </div>
    </div>
  )
}
