import React, { useEffect } from 'react'
import iOS from '../images/ios.png'
import android from '../images/android.png'
import chrome from '../images/chrome.png'
import safari from '../images/safari.png'
import electron from '../images/electron.png'
import unknown from '../images/unknown.png'
import { getModelReadable } from '../utils/device'
import { Device } from '../reducers/backend'

const PlatformIcon: { [key: string]: string } = {
  ios: iOS,
  android: android,
  electron: electron,
  safari: safari,
  chrome: chrome,
}

export interface DeviceDescriptionProps {
  isEditing?: boolean
  onChanged?: (device: Device) => void
  device: Device
}

export const DeviceDescription = ({
  isEditing = false,
  onChanged,
  device,
}: DeviceDescriptionProps): React.ReactElement => {
  const [newName, setNewName] = React.useState<string>(device.name)

  useEffect(() => {
    if (onChanged) {
      onChanged({ ...device, name: newName })
    }
  }, [newName])

  const getIcon = (device: Device): React.ReactElement => {
    const platformId: string = (
      device.platform === 'web' ? device.model : device.platform
    ).toLowerCase()

    const icon: string = PlatformIcon[platformId] || unknown
    return <img width="100%" src={icon} className="w3-padding" />
  }

  return (
    <>
      {device.current && (
        <span className="w3-right w3-tag w3-green">Current</span>
      )}

      <div className="center-vertically">
        <div className="icon-mobile">
          <div className="w3-center">{getIcon(device)}</div>
        </div>
        <div>
          {!isEditing && <strong>{device.name}</strong>}
          {isEditing && (
            <>
              <label>Name</label>
              <input
                type="text"
                className="w3-input w3-border"
                value={newName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setNewName(event.target.value)
                }
              />
            </>
          )}
          {device.platform === 'web' && (
            <div>Device model: {device.os_model}</div>
          )}
          {device.platform === 'web' && (
            <div>Device version: {device.os_version}</div>
          )}
          <div>
            {device.platform === 'web' ? 'Browser model' : 'Model'}:{' '}
            {getModelReadable(device.model)}
          </div>
          <div>
            {device.platform === 'web' ? 'Browser version' : 'Version'}:{' '}
            {device.version}
          </div>
          <div>
            Last used:{' '}
            {device.last_used_at
              ? device.last_used_at
                  .toISOString()
                  .split('T')
                  .join(' ')
                  .split('.')[0]
              : 'Not used yet'}
          </div>
        </div>
      </div>
    </>
  )
}
