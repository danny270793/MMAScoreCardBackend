import React, { MouseEventHandler } from 'react'

export interface ButtonProps {
  children: React.ReactNode
  className?: string
  type?: 'error' | 'info' | 'warning' | 'success'
  onClick?: MouseEventHandler
}

export const Button = ({
  children,
  className = '',
  type = 'info',
  onClick = undefined,
}: ButtonProps): React.ReactElement => {
  return (
    <button
      className={[
        'w3-button',
        className,
        type === 'error' && 'w3-red',
        type === 'warning' && 'w3-orange',
        type === 'success' && 'w3-green',
        type === 'info' && 'main-color',
      ].join(' ')}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
