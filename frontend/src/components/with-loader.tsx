import React from 'react'
import { Loader } from './loader'

export interface WithLoaderProps {
  isLoading: boolean
  children: React.ReactNode
}

export const WithLoader = (props: WithLoaderProps): React.ReactElement => {
  return (
    <>
      {props.isLoading && <Loader fullscreen={true} />}
      <div
        className={props.isLoading ? '' : 'w3-animate-right'}
        style={{ visibility: props.isLoading ? 'hidden' : 'visible' }}
      >
        {props.children}
      </div>
    </>
  )
}
