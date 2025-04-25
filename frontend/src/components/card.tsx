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
      className={['w3-white', 'w3-round', padding ? 'w3-padding' : ''].join(
        ' ',
      )}
    >
      {children}
    </div>
  )
}
