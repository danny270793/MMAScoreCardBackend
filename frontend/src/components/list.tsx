import React from 'react'

export interface ListProps {
  children: React.ReactNode
}

export const List = (props: ListProps): React.ReactElement => {
  return (
    <ul className="w3-ul w3-white w3-round w3-hoverable">{props.children}</ul>
  )
}

export interface ListItemProps {
  children: React.ReactNode
}

export const ListItem = (props: ListItemProps): React.ReactElement => {
  return <li>{props.children}</li>
}
