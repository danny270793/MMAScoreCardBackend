import React from 'react'

export interface SectionProps {
  className?: string
  children: React.ReactNode
}

export const Section = (props: SectionProps): React.ReactElement => {
  return (
    <div className={['w3-padding', props.className].join(' ')}>
      {props.children}
    </div>
  )
}
