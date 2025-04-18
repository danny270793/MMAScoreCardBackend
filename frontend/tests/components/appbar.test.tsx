/* eslint-disable react/react-in-jsx-scope */
import { describe, it, expect } from 'vitest'
import { AppBar } from '../../src/components/appbar'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'

describe('AppBar Component', () => {
  it('renders correctly', () => {
    const { container } = render(
      <MemoryRouter>
        <AppBar title="bar title" />
      </MemoryRouter>,
    )
    expect(container).toBeInTheDocument()
  })

  it('contains the correct title', () => {
    const { getByText } = render(
      <MemoryRouter>
        <AppBar title="My App" />
      </MemoryRouter>,
    )
    expect(getByText('My App')).toBeInTheDocument()
  })
})
