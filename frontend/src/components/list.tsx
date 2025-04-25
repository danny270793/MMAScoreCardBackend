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
        'w3-white',
        'w3-round',
        clickeable ? 'w3-hoverable' : '',
      ].join(' ')}
    >
      {children}
    </ul>
  )
}

export interface ListItemProps {
  removePadding?: boolean
  onClick?: (() => void) | undefined
  children: React.ReactNode
}

export const ListItem = ({
  removePadding = false,
  onClick = undefined,
  children,
}: ListItemProps): React.ReactElement => {
  if (removePadding) {
    return (
      <li onClick={onClick} style={{ padding: '0px' }}>
        {children}
      </li>
    )
  }
  return <li onClick={onClick}>{children}</li>
}
