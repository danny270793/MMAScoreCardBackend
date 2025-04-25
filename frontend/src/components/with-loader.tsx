import React from 'react'
import { Loader } from './loader'

export interface WithLoaderProps {
  isLoading: boolean
  children: React.ReactElement | React.ReactElement[] | null
}

export const WithLoader = (props: WithLoaderProps): React.ReactElement => {
  return (
    <>
      {props.isLoading && <Loader fullscreen={true} />}
      <div style={{ visibility: props.isLoading ? 'hidden' : 'visible' }}>
        {props.children}
      </div>
    </>
  )
}
