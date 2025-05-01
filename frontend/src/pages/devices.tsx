import { Dispatch } from '@reduxjs/toolkit'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectors as backendSelectors,
  actions as backendActions,
  Device,
} from '../reducers/backend'
import { AppBar } from '../components/appbar'
import { List, ListItem } from '../components/list'
import { Section } from '../components/section'
import { WithLoader } from '../components/with-loader'
import { DeviceDescription } from '../components/device-description'
import { BottomBar } from '../components/bottombar'
import { ErrorModal } from '../components/error-modal'
import { ScrollToRefresh } from '../components/scroll-to-refresh'
import { useTranslation } from 'react-i18next'
import { NavigateTo, useNavigateTo } from '../hooks/use-navigate-to'

export const DevicesPage: () => React.ReactElement = () => {
  const { t } = useTranslation()
  const dispatch: Dispatch = useDispatch()
  const navigateTo: NavigateTo = useNavigateTo()

  useEffect(() => {
    dispatch(backendActions.getDevices())
  }, [])

  const devices: Device[] = useSelector(backendSelectors.getDevices)
  const error: Error | null = useSelector(backendSelectors.getError)
  const isLoading: boolean = useSelector(backendSelectors.getIsLoading)

  const onGoToDeviceClicked = (device: Device) => {
    navigateTo.device(device.id)
  }

  const onRefresh = async () => {
    dispatch(backendActions.getDevices())
  }

  return (
    <>
      <ErrorModal
        error={error}
        onClose={() => dispatch(backendActions.clearError())}
      />
      <AppBar title={t('devices', { postProcess: 'capitalize' })} />
      <WithLoader isLoading={isLoading}>
        <Section>
          <ScrollToRefresh onScroll={onRefresh}>
            <List>
              {devices.length === 0 && (
                <ListItem>
                  {t('devicesNotFound', { postProcess: 'capitalize' })}
                </ListItem>
              )}
              {devices.length > 0 &&
                devices.map((device: Device) => (
                  <ListItem
                    key={device.id}
                    padding={false}
                    onClick={() => onGoToDeviceClicked(device)}
                  >
                    <DeviceDescription device={device} />
                  </ListItem>
                ))}
            </List>
          </ScrollToRefresh>
        </Section>
      </WithLoader>
      <BottomBar>
        {devices.length} {t('devices')}
      </BottomBar>
    </>
  )
}
