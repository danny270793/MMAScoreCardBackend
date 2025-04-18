import React from 'react'
import { Fight } from '../reducers/backend'

export interface FightDescriptionProps {
  fight: Fight
  showReferee: boolean
  showFighters: boolean
  onSeeMoreClicked?: (fight: Fight) => void
}

export const FightDescription: (
  props: FightDescriptionProps,
) => React.ReactElement = (
  props: FightDescriptionProps,
): React.ReactElement => {
  return (
    <div
      onClick={() =>
        props.onSeeMoreClicked && props.onSeeMoreClicked(props.fight)
      }
    >
      {props.showFighters && (
        <h4>
          {props.fight.fighter1.name} vs {props.fight.fighter2.name}{' '}
        </h4>
      )}
      <div>
        {props.fight.method} ({props.fight.method_detail})
      </div>
      {props.showReferee && props.fight.referee && (
        <div>{props.fight.referee.name}</div>
      )}
      {props.fight.state !== 'upcoming' && (
        <div>
          Round {props.fight.round} at {props.fight.time}
        </div>
      )}

      {props.fight.division && (
        <div>
          {props.fight.division.name} (
          {props.fight.division.weight && `${props.fight.division.weight}lb`})
        </div>
      )}

      <div>{props.fight.event.name}</div>
      <div>{props.fight.event.date.toISOString().split('T')[0]}</div>
    </div>
  )
}
