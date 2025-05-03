import React from 'react'

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
  return (
    <>
      <label className="w3-label">{props.label}</label>
      <input
        className="w3-input w3-border"
        value={props.value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          props.onChange(event.target.value)
        }
        type={props.type}
        placeholder={props.placeholder}
        disabled={props.disabled ?? false}
      />
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
