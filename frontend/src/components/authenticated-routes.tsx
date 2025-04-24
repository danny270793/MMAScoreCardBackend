import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { selectors as sessionSelectors } from '../reducers/session'

export const AuthenticatedRoutes: () => React.ReactElement = () => {
  const token: string | null = useSelector(sessionSelectors.getToken)

  if (!token) {
    return <Navigate to="/login" />
  }

  return <Outlet />
}
