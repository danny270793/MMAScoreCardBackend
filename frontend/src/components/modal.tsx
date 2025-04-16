import React from 'react'

export interface ModalProps {
  title: string
  onClose: () => void
  children: React.ReactNode
}

export const Modal: (props: ModalProps) => React.ReactElement = (
  props: ModalProps,
): React.ReactElement => {
  return (
    <div className="w3-modal" style={{ display: 'block' }}>
      <div className="w3-modal-content w3-animate-zoom">
        <button
          className="w3-button w3-red w3-display-topright"
          onClick={props.onClose}
        >
          X
        </button>
        <div className="w3-container">
          <h1>{props.title}</h1>
          {props.children}
        </div>
      </div>
    </div>
  )
}
