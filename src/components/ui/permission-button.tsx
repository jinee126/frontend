import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Button } from '@/components/ui/button'

type PermissionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  permission?: boolean
}

export default function PermissionButton({
  children,
  permission = true,
  ...props
}: PermissionButtonProps) {
  if (!permission) return null

  return <Button {...props}>{children}</Button>
}
