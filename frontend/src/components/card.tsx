import React from 'react'

export interface CardProps {
  children: React.ReactNode
}

export const Card = (props: CardProps): React.ReactElement => {
  return <div className="w3-container w3-white w3-round">{props.children}</div>
}
