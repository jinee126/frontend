import ReactSelect, { type SingleValue } from 'react-select'
import { useFieldContext } from '@/hooks/form-context'

type Option = {
  label: string
  value: string
}

type CustomSelectProps = {
  label?: string
  options: Option[]
  placeholder?: string
}

export default function CustomSelect({ label, options, placeholder }: CustomSelectProps) {
  const field = useFieldContext<string>()

  const selected = options.find((o) => o.value === field.state.value) ?? null

  const handleChange = (option: SingleValue<Option>) => {
    field.handleChange(option?.value ?? '')
  }

  return (
    <div>
      {label && <label>{label}</label>}
      <ReactSelect
        options={options}
        value={selected}
        onChange={handleChange}
        onBlur={field.handleBlur}
        placeholder={placeholder}
      />
    </div>
  )
}
