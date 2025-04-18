import { Dispatch } from '@reduxjs/toolkit'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectors as backendSelectors,
  actions as backendActions,
  Fight,
  Fighter,
} from '../reducers/backend'
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom'
import { Modal } from '../components/modal'
import { AppBar } from '../components/appbar'
import { Loader } from '../components/loader'
import { FightDescription } from '../components/fight-description'
import { FighterDescription } from '../components/fighter-description'

type EventPageParams = {
  id: string | undefined
}

export const FightPage: () => React.ReactElement = () => {
  const { id } = useParams<EventPageParams>()

  const dispatch: Dispatch = useDispatch()
  const navigate: NavigateFunction = useNavigate()

  useEffect(() => {
    const idParsed: number = parseInt(id || '1')
    dispatch(backendActions.loadFight(idParsed))
  }, [id])

  const fight: Fight | null = useSelector(backendSelectors.getFight)

  const isLoading: boolean = useSelector(backendSelectors.getIsLoading)
  const error: Error | null = useSelector(backendSelectors.getError)

  const onSeeMoreClicked: (fighter: Fighter) => void = (fight: Fighter) => {
    navigate(`/fighter/${fight.id}`)
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
      {fight && (
        <div>
          <AppBar title={'Fight'} />
          <div className="w3-container">
            <h5>Fight</h5>
            <div className="w3-container w3-white w3-round">
              <br />
              <FightDescription
                fight={fight}
                showReferee={true}
                showFighters={false}
              />
              <br />
            </div>
            <h5>Fighters</h5>
            <ul className="w3-ul w3-white w3-round w3-hoverable">
              {[fight.fighter1, fight.fighter2].map((fighter: Fighter) => (
                <li key={fighter.id}>
                  <div className="w3-right">
                    {fight.fighter1_result === 'win' &&
                    fight.fighter1.id === fighter.id ? (
                      <div className="w3-tag w3-green w3-round">WIN</div>
                    ) : (
                      ''
                    )}

                    {fight.fighter2_result === 'win' &&
                    fight.fighter2.id === fighter.id ? (
                      <div className="w3-tag w3-green w3-round">WIN</div>
                    ) : (
                      ''
                    )}

                    {fight.fighter1_result === 'loss' &&
                    fight.fighter1.id === fighter.id ? (
                      <div className="w3-tag w3-red w3-round">LOSS</div>
                    ) : (
                      ''
                    )}

                    {fight.fighter2_result === 'loss' &&
                    fight.fighter2.id === fighter.id ? (
                      <div className="w3-tag w3-red w3-round">LOSS</div>
                    ) : (
                      ''
                    )}
                  </div>
                  <FighterDescription
                    fighter={fighter}
                    onSeeMoreClicked={() => onSeeMoreClicked(fighter)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
