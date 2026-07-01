import { createFormHook } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import Calender from '@/components/ui/calender'
import Checkbox from '@/components/ui/checkbox'
import CustomSelect from '@/components/ui/custom-select'
import Input from '@/components/ui/input'
import PermissionButton from '@/components/ui/permission-button'
import Radio from '@/components/ui/radio'
import SwitchButton from '@/components/ui/switch-button'
import { fieldContext, formContext } from '@/hooks/form-context'

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    Calender,
    Checkbox,
    CustomSelect,
    Input,
    Radio,
    SwitchButton,
  },
  fieldContext,
  formComponents: {
    Button,
    PermissionButton,
  },
  formContext,
})
