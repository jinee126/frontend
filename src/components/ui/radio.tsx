import type { InputHTMLAttributes } from 'react'
import { useFieldContext } from '@/hooks/form-context'

type RadioOption = {
  label: string
  value: string
}

type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string
  options: RadioOption[]
}

export default function Radio({ label, options, ...props }: RadioProps) {
  const field = useFieldContext<string>()

  return (
    <fieldset>
      {label && <legend>{label}</legend>}
      {options.map((option) => (
        <label key={option.value}>
          <input
            type="radio"
            value={option.value}
            checked={field.state.value === option.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            {...props}
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  )
}
