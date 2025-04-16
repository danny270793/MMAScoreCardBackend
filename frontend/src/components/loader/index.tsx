import React from 'react'
import './index.css'

export type LoaderSize = 'small' | 'normal'

export interface LoaderProps {
  size?: LoaderSize
}

export const DefaultLoaderProps: LoaderProps = {
  size: 'normal',
}

export const Loader: (props: LoaderProps) => React.ReactElement = (
  props: LoaderProps = DefaultLoaderProps,
) => {
  const size: number = props.size === 'small' ? 60 : 120
  const borderSize: number = props.size === 'small' ? 8 : 16
  return (
    <div className="w3-block w3-center">
      <div
        className="loader w3-bar"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          border: `${borderSize}px solid #f3f3f3`,
          borderTop: `${borderSize}px solid #3498db`,
        }}
      />
    </div>
  )
}
