import type { InputHTMLAttributes } from 'react'
import { useFieldContext } from '@/hooks/form-context'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string
}

export default function Checkbox({ label, ...props }: CheckboxProps) {
  const field = useFieldContext<boolean>()

  return (
    <label>
      <input
        type="checkbox"
        checked={field.state.value}
        onChange={(e) => field.handleChange(e.target.checked)}
        onBlur={field.handleBlur}
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  )
}
