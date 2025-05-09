import React, { FormEvent, MouseEventHandler, useState } from 'react'
import { Button } from './button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

export interface InputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  errors?: string[]
  disabled?: boolean
  type: 'text' | 'password'
}

export const Input: React.FC<InputProps> = (props: InputProps) => {
  const [show, setShow] = useState(false)

  const onVisibilityChanged: MouseEventHandler = (event: FormEvent) => {
    event.preventDefault()
    setShow((show) => !show)
  }

  return (
    <>
      <label className="w3-labell">{props.label}</label>
      <div style={{ display: 'flex' }}>
        <input
          style={{ flex: 1, boxSizing: 'border-box' }}
          className="w3-input w3-border"
          value={props.value}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            props.onChange(event.target.value)
          }
          type={
            props.type === 'password'
              ? show
                ? 'text'
                : 'password'
              : props.type
          }
          placeholder={props.placeholder}
          disabled={props.disabled ?? false}
        />
        {props.type === 'password' && (
          <Button
            onClick={onVisibilityChanged}
            className="w3-border-right w3-border-top w3-border-bottom"
          >
            <FontAwesomeIcon icon={show ? faEyeSlash : faEye} />
          </Button>
        )}
      </div>
      {props.errors && (
        <>
          {props.errors.map((error: string, index: number) => (
            <label key={index} className="w3-text-red">
              {error}
            </label>
          ))}
        </>
      )}
    </>
  )
}
