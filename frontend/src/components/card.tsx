import React from 'react'

export interface CardProps {
  padding?: boolean
  children: React.ReactNode
}

export const Card = ({
  padding = true,
  children,
}: CardProps): React.ReactElement => {
  return (
    <div
      className={[
        'primary-light-color',
        'w3-round',
        padding ? 'w3-padding' : '',
      ].join(' ')}
    >
      {children}
    </div>
  )
}
