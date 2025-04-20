import { Dispatch } from '@reduxjs/toolkit'
import React, { FormEvent, FormEventHandler, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectors as backendSelectors,
  actions as backendActions,
  Fighter,
} from '../reducers/backend'
import { Paginator } from '../services/backend'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { Modal } from '../components/modal'
import { Loader } from '../components/loader'
import { AppBar } from '../components/appbar'
import { FighterDescription } from '../components/fighter-description'
import { Section } from '../components/section'
import { List, ListItem } from '../components/list'
import { WithLoader } from '../components/with-loader'

export const FightersPage: () => React.ReactElement = () => {
  const navigate: NavigateFunction = useNavigate()
  const dispatch: Dispatch = useDispatch()

  const [query, setQuery] = useState<string>('')

  const [page, setPage] = useState<number>(1)
  const [searchPage, setSearchPage] = useState<number>(1)

  const [allFighters, setAllFighters] = useState<Fighter[]>([])
  const [allSearchedFighters, setAllSearchedFighters] = useState<Fighter[]>([])

  useEffect(() => {
    dispatch(backendActions.loadFighters(page))
  }, [])

  useEffect(() => {
    dispatch(backendActions.loadFighters(page))
  }, [page])

  useEffect(() => {
    dispatch(backendActions.searchFighters(searchPage, query))
  }, [searchPage])

  const fighters: Paginator<Fighter> | null = useSelector(
    backendSelectors.getFighters,
  )

  const searchedFighters: Paginator<Fighter> | null = useSelector(
    backendSelectors.getSearchedFighters,
  )

  useEffect(() => {
    setAllFighters((prevFighters: Fighter[]) => {
      const newFighters: Fighter[] = fighters?.data || []
      const nonRepeatedNewEvents: Fighter[] = newFighters.filter(
        (fighter: Fighter) =>
          !prevFighters
            .map((fighter: Fighter) => fighter.id)
            .includes(fighter.id),
      )
      return [...prevFighters, ...nonRepeatedNewEvents]
    })
  }, [fighters])

  useEffect(() => {
    setAllSearchedFighters((prevFighters: Fighter[]) => {
      const newFighters: Fighter[] = searchedFighters?.data || []
      const nonRepeatedNewEvents: Fighter[] = newFighters.filter(
        (fighter: Fighter) =>
          !prevFighters
            .map((fighter: Fighter) => fighter.id)
            .includes(fighter.id),
      )
      return [...prevFighters, ...nonRepeatedNewEvents]
    })
  }, [searchedFighters])

  const error: Error | null = useSelector(backendSelectors.getError)
  const isLoading: boolean = useSelector(backendSelectors.getIsLoading)
  const isLoadingMore: boolean = useSelector(backendSelectors.getIsLoadingMore)

  const onLoadMoreClicked: () => void = () => {
    if (query === '') {
      setPage((prevPage: number) => prevPage + 1)
    } else {
      setSearchPage((prevPage: number) => prevPage + 1)
    }
  }

  const onSeeMoreClicked: (fighter: Fighter) => void = (fighter: Fighter) => {
    navigate(`/fighter/${fighter.id}`)
  }

  const onSeachSubmited: FormEventHandler<HTMLFormElement> = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    setAllSearchedFighters([])
    setSearchPage(1)
    dispatch(backendActions.searchFighters(page, query))
  }

  const selectedFighters: Fighter[] =
    query === '' ? allFighters : allSearchedFighters
  const showLoadMoreButton: boolean =
    query === ''
      ? fighters && fighters.data.length > 0
        ? true
        : false
      : searchedFighters && searchedFighters.data.length > 0
        ? true
        : false

  return (
    <>
      {error && (
        <Modal
          title="Error"
          onClose={() => dispatch(backendActions.clearError())}
        >
          <p>{error.message}</p>
          <pre style={{ overflow: 'auto' }}>{error.stack}</pre>
        </Modal>
      )}
      <AppBar title={'Fighters'} />
      <form onSubmit={onSeachSubmited}>
        <input
          className="w3-input"
          type="text"
          placeholder="Search"
          onChange={(event) => setQuery(event.target.value)}
        />
        <br />
      </form>
      <WithLoader isLoading={!isLoadingMore && isLoading}>
        <>
          <Section>
            <List>
              {selectedFighters.length === 0 && (
                <ListItem>No fighters found</ListItem>
              )}
              {selectedFighters.length > 0 &&
                selectedFighters.map((fighter: Fighter) => (
                  <ListItem key={fighter.id}>
                    <FighterDescription
                      fighter={fighter}
                      onSeeMoreClicked={() => onSeeMoreClicked(fighter)}
                    />
                  </ListItem>
                ))}
            </List>
          </Section>
          {isLoadingMore && <Loader size="small" />}
          {!isLoadingMore && showLoadMoreButton && (
            <button className="w3-button w3-block" onClick={onLoadMoreClicked}>
              Load more
            </button>
          )}
        </>
      </WithLoader>
    </>
  )
}
