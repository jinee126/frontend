import type { InputHTMLAttributes } from 'react'
import { useFieldContext } from '@/hooks/form-context'

type SwitchButtonProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string
}

export default function SwitchButton({ label, ...props }: SwitchButtonProps) {
  const field = useFieldContext<boolean>()

  return (
    <label>
      <input
        type="checkbox"
        role="switch"
        checked={field.state.value}
        onChange={(e) => field.handleChange(e.target.checked)}
        onBlur={field.handleBlur}
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  )
}
