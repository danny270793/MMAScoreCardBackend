import React from 'react'
import { Event } from '../reducers/backend'

export interface EventDescriptionProps {
  event: Event
  showEventName: boolean
  onSeeMoreClicked?: (event: Event) => void
}

export const EventDescription: (
  props: EventDescriptionProps,
) => React.ReactElement = (
  props: EventDescriptionProps,
): React.ReactElement => {
  return (
    <div
      onClick={() =>
        props.onSeeMoreClicked && props.onSeeMoreClicked(props.event)
      }
    >
      <div className="w3-right">
        {props.event.state === 'upcoming' && (
          <div className="w3-tag w3-red w3-round">{props.event.state}</div>
        )}
      </div>

      <h4>{props.event.fight}</h4>
      {props.showEventName && <h5>{props.event.name}</h5>}
      <div>
        {props.event.location} ({props.event.country})
      </div>
      <div>{props.event.date.toLocaleDateString()}</div>
    </div>
  )
}
