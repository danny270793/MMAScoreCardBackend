import React from 'react'
import { Modal } from './modal'

export interface ErrorModalProps {
  error?: Error | null
  onClose: () => void
}

export const ErrorModal: (props: ErrorModalProps) => React.ReactElement = ({
  error,
  onClose,
}: ErrorModalProps) => {
  if (!error) {
    return <></>
  }

  return (
    <Modal type="error" title="Error" onClose={onClose}>
      <p>{error.message}</p>
      {import.meta.env.MODE === 'development' && (
        <pre style={{ overflow: 'auto' }}>{error.stack}</pre>
      )}
    </Modal>
  )
}
