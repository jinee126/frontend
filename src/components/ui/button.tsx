import type {ButtonHTMLAttributes, ReactNode} from 'react'
import  { resolveClasses } from '@/utils/classNames'
import styles from './button.module.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode
}
export function Button({type,children, className, ...props}: ButtonProps) {
    return (
        <button type={ type || 'button'} className={resolveClasses(styles, 'button', className)} {...props}>
            <i>{children}</i>
        </button>
    )
}