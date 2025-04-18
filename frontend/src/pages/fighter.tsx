import { Dispatch } from '@reduxjs/toolkit'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectors as backendSelectors,
  actions as backendActions,
  Fight,
  FighterWithFights,
  Streak,
  Record,
} from '../reducers/backend'
import { useParams } from 'react-router-dom'
import { Modal } from '../components/modal'
import { Loader } from '../components/loader'
import { AppBar } from '../components/appbar'
import { FighterDescription } from '../components/fighter-description'
import { BottomBar } from '../components/bottombar'
import { FightDescription } from '../components/fight-description'

type EventPageParams = {
  id: string | undefined
}

export const FighterPage: () => React.ReactElement = () => {
  const { id } = useParams<EventPageParams>()

  const dispatch: Dispatch = useDispatch()

  useEffect(() => {
    const idParsed: number = parseInt(id || '1')
    dispatch(backendActions.loadFighter(idParsed))
  }, [id])

  const fighter: FighterWithFights | null = useSelector(
    backendSelectors.getFighter,
  )

  const isLoading: boolean = useSelector(backendSelectors.getIsLoading)
  const error: Error | null = useSelector(backendSelectors.getError)

  const computeCurrentStreak = (fighter: FighterWithFights) => {
    const lastStreak: Streak = fighter.streaks[0]
    const fights: number = lastStreak.counter
    if (lastStreak.result === 'loss') {
      return `${fights} loss${fights > 1 ? 'es' : ''}`
    } else {
      return `${fights} win${fights > 1 ? 's' : ''}`
    }
  }

  const computeBestStreak = (fighter: FighterWithFights) => {
    const winStreaks: Streak[] = fighter.streaks.filter(
      (a) => a.result === 'win',
    )
    if (winStreaks.length === 0) {
      return 'NO WINS YET'
    }

    const losses: number = winStreaks.sort((a, b) => b.counter - a.counter)[0]
      .counter
    return `${losses} win${losses > 1 ? 's' : ''}`
  }

  const secondsToHHMMSS = (seconds: number) => {
    let minutes = 0
    while (seconds >= 60) {
      minutes += 1
      seconds -= 60
    }

    let hours = 0
    while (minutes >= 60) {
      hours += 1
      minutes -= 60
    }
    return `${hours}h${minutes}m${seconds}s`
  }

  const computeWorstStreak = (fighter: FighterWithFights) => {
    const lossStreaks: Streak[] = fighter.streaks.filter(
      (a) => a.result === 'loss',
    )
    if (lossStreaks.length === 0) {
      return 'UNDEFEATED'
    }

    const losses: number = lossStreaks.sort((a, b) => b.counter - a.counter)[0]
      .counter
    return `${losses} loss${losses > 1 ? 'es' : ''}`
  }

  const getFightTag = (result: string) => {
    if ('win' === result) {
      return <div className="w3-tag w3-green w3-round">WIN</div>
    } else if ('loss' === result) {
      return <div className="w3-tag w3-red w3-round">LOSS</div>
    } else if ('draw' === result) {
      return <div className="w3-tag w3-yellow w3-round">DRAW</div>
    } else if ('nc' === result) {
      return <div className="w3-tag w3-organge w3-round">NC</div>
    }
  }

  return (
    <div>
      {error && (
        <Modal
          title="Error"
          onClose={() => dispatch(backendActions.clearError())}
        >
          <p>{error.message}</p>
          <pre style={{ overflow: 'auto' }}>{error.stack}</pre>
        </Modal>
      )}
      {isLoading && <Loader />}
      {fighter && (
        <div>
          <AppBar title={fighter.name} />
          <div className="w3-container">
            <h5>Fighter</h5>
            <div className="w3-container w3-white w3-round">
              <FighterDescription fighter={fighter} />
              <br />
            </div>

            <h5>Stats</h5>
            <div className="w3-container w3-white w3-round w3-padding">
              <div>
                Record:{' '}
                {
                  fighter.records.filter(
                    (record: Record) => record.name === 'wins',
                  )[0].value
                }
                -
                {
                  fighter.records.filter(
                    (record: Record) => record.name === 'losses',
                  )[0].value
                }
                -
                {
                  fighter.records.filter(
                    (record: Record) => record.name === 'ncs',
                  )[0].value
                }{' '}
                {
                  fighter.records.filter(
                    (record: Record) => record.name === 'draws',
                  )[0].value
                }
              </div>
              <div>Current streak: {computeCurrentStreak(fighter)}</div>
              <div>Beast streak: {computeBestStreak(fighter)}</div>
              <div>Worst streak: {computeWorstStreak(fighter)}</div>
              <div>
                Octagon time:{' '}
                {secondsToHHMMSS(
                  fighter.records.filter(
                    (record: Record) => record.name === 'octagon time',
                  )[0].value,
                )}
              </div>
            </div>

            <h5>Fights</h5>
            <ul className="w3-ul w3-white w3-round w3-hoverable">
              {fighter.fights.length === 0 && <li>No fights found</li>}
              {fighter.fights.length > 0 &&
                fighter.fights.map((fight: Fight) => (
                  <li key={fight.id}>
                    <div className="w3-right">
                      {fight.fighter2.id === fighter.id &&
                        getFightTag(fight.fighter2_result)}

                      {fight.fighter1.id === fighter.id &&
                        getFightTag(fight.fighter1_result)}
                    </div>
                    <h4>
                      {fight.fighter2.id === fighter.id && fight.fighter1.name}
                      {fight.fighter1.id === fighter.id && fight.fighter2.name}
                    </h4>
                    <FightDescription
                      fight={fight}
                      showReferee={true}
                      showFighters={false}
                    />
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
      {fighter && (
        <BottomBar>
          <div className="w3-center">{fighter.fights.length} fights</div>
        </BottomBar>
      )}
    </div>
  )
}
