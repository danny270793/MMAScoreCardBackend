import React from 'react'

export interface ModalProps {
  title: string
  type?: 'error' | 'info' | 'warning' | 'success'
  onClose: () => void
  children: React.ReactNode
}

export const Modal: (props: ModalProps) => React.ReactElement = ({
  title,
  type = 'info',
  onClose,
  children,
}: ModalProps): React.ReactElement => {
  return (
    <div className="w3-modal" style={{ display: 'block' }}>
      <div
        className={[
          'w3-modal-content w3-animate-zoom',
          type === 'error' && 'w3-red',
          type === 'warning' && 'w3-orange',
          type === 'success' && 'w3-green',
        ].join(' ')}
      >
        <button
          className="w3-button w3-red w3-display-topright"
          onClick={onClose}
        >
          X
        </button>
        <div className="w3-container">
          <h1>{title}</h1>
          {children}
          <br />
        </div>
      </div>
    </div>
  )
}
