import React from 'react'

export interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
}

export const Button = (props: ButtonProps): React.ReactElement => {
  return (
    <button className="w3-button w3-block" onClick={props.onClick}>
      {props.children}
    </button>
  )
}
