import React from 'react'

export interface SectionProps {
  children: React.ReactNode
}

export const Section = (props: SectionProps): React.ReactElement => {
  return <div className="w3-container">{props.children}</div>
}
