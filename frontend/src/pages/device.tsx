import { Dispatch } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectors as backendSelectors,
  actions as backendActions,
  Device,
} from '../reducers/backend'
import { AppBar } from '../components/appbar'
import { Modal } from '../components/modal'
import { Section } from '../components/section'
import { WithLoader } from '../components/with-loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faClose,
  faPencil,
  faSave,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { useParams } from 'react-router-dom'
import { DeviceDescription } from '../components/device-description'
import { Button } from '../components/button'
import { Card } from '../components/card'
import { ErrorModal } from '../components/error-modal'
import { useTranslation } from 'react-i18next'

type DevicePageParams = {
  id: string | undefined
}

export const DevicePage: () => React.ReactElement = () => {
  const { id } = useParams<DevicePageParams>()
  const { t } = useTranslation()
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false)

  const dispatch: Dispatch = useDispatch()

  useEffect(() => {
    const idParsed: number = parseInt(id || '1')
    dispatch(backendActions.getDevice(idParsed))
  }, [])

  const device: Device | null = useSelector(backendSelectors.getDevice)
  const error: Error | null = useSelector(backendSelectors.getError)
  const isLoading: boolean = useSelector(backendSelectors.getIsLoading)

  const [isEditing, setIsEditing] = React.useState<boolean>(false)
  const [newName, setNewName] = React.useState<string>('')

  const onDeviceChanged = (device: Device) => {
    setNewName(device.name)
  }

  const onDeleteDeviceClicked = (device: Device) => {
    dispatch(backendActions.deleteDevice(device.id))
    setShowConfirmDelete(false)
  }

  const onUpdateDeviceClicked = () => {
    dispatch(backendActions.updateDevice(device!.id, newName))
  }

  return (
    <>
      <ErrorModal
        error={error}
        onClose={() => dispatch(backendActions.clearError())}
      />
      {showConfirmDelete && (
        <Modal
          title={t('confirmDeleteTitle', { postProcess: 'capitalize' })}
          type="error"
          onClose={() => setShowConfirmDelete(false)}
        >
          <p>{t('confirmDeleteMessage', { postProcess: 'capitalize' })}</p>
          <div className="w3-row">
            <Button
              type="error"
              className="w3-half"
              onClick={() => onDeleteDeviceClicked(device!)}
            >
              {t('yes', { postProcess: 'capitalize' })}
            </Button>
            <Button
              type="error"
              className="w3-half"
              onClick={() => setShowConfirmDelete(false)}
            >
              {t('no', { postProcess: 'capitalize' })}
            </Button>
          </div>
        </Modal>
      )}
      <AppBar
        title={device ? device.name : 'Device'}
        actions={[
          {
            showIf: !isEditing === true,
            children: <FontAwesomeIcon icon={faPencil} />,
            onClick: () => setIsEditing(true),
          },
          {
            showIf: isEditing === true,
            children: <FontAwesomeIcon icon={faClose} />,
            onClick: () => setIsEditing(false),
          },
          {
            showIf: isEditing === true,
            children: <FontAwesomeIcon icon={faSave} />,
            onClick: onUpdateDeviceClicked,
          },
          {
            showIf: isEditing === false,
            children: <FontAwesomeIcon icon={faTrash} />,
            onClick: () => setShowConfirmDelete(true),
          },
        ]}
      />
      <WithLoader isLoading={isLoading}>
        {device && (
          <Section>
            <Card padding={false}>
              <DeviceDescription
                isEditing={isEditing}
                device={device}
                onChanged={onDeviceChanged}
              />
            </Card>
          </Section>
        )}
      </WithLoader>
    </>
  )
}
