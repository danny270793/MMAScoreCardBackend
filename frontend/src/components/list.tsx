import React from 'react'

export interface ListProps {
  clickeable?: boolean
  children: React.ReactNode
}

export const List = ({
  clickeable = true,
  children,
}: ListProps): React.ReactElement => {
  return (
    <ul
      className={[
        'w3-ul',
        'primary-light-color',
        'w3-round',
        clickeable ? 'w3-hoverable' : '',
      ].join(' ')}
    >
      {children}
    </ul>
  )
}

export interface ListItemProps {
  padding?: boolean
  onClick?: (() => void) | undefined
  children: React.ReactNode
}

export const ListItem = ({
  padding = true,
  onClick = undefined,
  children,
}: ListItemProps): React.ReactElement => {
  if (!padding) {
    return (
      <li onClick={onClick} style={{ padding: '0px' }}>
        {children}
      </li>
    )
  }
  return <li onClick={onClick}>{children}</li>
}
