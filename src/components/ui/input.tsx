import type { InputHTMLAttributes } from 'react'
import { useFieldContext } from '@/hooks/form-context'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

export default function Input({ label, ...props }: InputProps) {
  const field = useFieldContext<string>()

  return (
    <div>
      {label && <label>{label}</label>}
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        {...props}
      />
      {field.state.meta.errors.length > 0 && (
        <span>{field.state.meta.errors.join(', ')}</span>
      )}
    </div>
  )
}
