import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useFieldContext } from '@/hooks/form-context'

type CalenderProps = {
  label?: string
  placeholder?: string
}

export default function Calender({ label, placeholder }: CalenderProps) {
  const field = useFieldContext<Date | null>()

  return (
    <div>
      {label && <label>{label}</label>}
      <DatePicker
        selected={field.state.value}
        onChange={(date) => field.handleChange(date)}
        onBlur={field.handleBlur}
        placeholderText={placeholder}
        dateFormat="yyyy-MM-dd"
      />
    </div>
  )
}
