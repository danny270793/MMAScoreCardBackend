import React from 'react'
import './index.css'

export type LoaderSize = 'xsmall' | 'small' | 'normal'

export interface LoaderProps {
  size?: LoaderSize
  fullscreen?: boolean
}

export const Loader: (props: LoaderProps) => React.ReactElement = ({
  size = 'normal',
  fullscreen = false,
}: LoaderProps) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    if (fullscreen) {
      return (
        <div className="w3-display-container" style={{ height: '100vh' }}>
          <div className="w3-display-middle">{children}</div>
        </div>
      )
    }
    return children
  }

  const loaderSize: number =
    size === 'xsmall' ? 30 : size === 'small' ? 60 : 120
  const borderSize: number = size === 'xsmall' ? 4 : size === 'small' ? 8 : 16
  return (
    <Wrapper>
      <div className="w3-block w3-center">
        <div
          className="loader w3-bar"
          style={{
            width: `${loaderSize}px`,
            height: `${loaderSize}px`,
            border: `${borderSize}px solid #f3f3f3`,
            borderTop: `${borderSize}px solid #3498db`,
          }}
        />
      </div>
    </Wrapper>
  )
}
