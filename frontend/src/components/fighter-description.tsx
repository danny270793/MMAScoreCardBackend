import React from 'react'
import { Fighter } from '../reducers/backend'

export interface FighterDescriptionProps {
  fighter: Fighter
  onSeeMoreClicked?: (fighter: Fighter) => void
}

export const FighterDescription: (
  props: FighterDescriptionProps,
) => React.ReactElement = (
  props: FighterDescriptionProps,
): React.ReactElement => {
  return (
    <div
      onClick={() =>
        props.onSeeMoreClicked && props.onSeeMoreClicked(props.fighter)
      }
    >
      <h5>
        {props.fighter.name}{' '}
        {props.fighter.nickname && (
          <small>&quot;{props.fighter.nickname}&quot;</small>
        )}
      </h5>
      {props.fighter.died && (
        <div>Died: {props.fighter.died.toLocaleDateString()}</div>
      )}
      <div>
        {props.fighter.city} - {props.fighter.country}
      </div>
      <div>Birthday: {props.fighter.birthday.toLocaleDateString()}</div>
      <div>Height: {props.fighter.height} cm</div>
      <div>Weight: {props.fighter.weight} lb</div>
    </div>
  )
}
