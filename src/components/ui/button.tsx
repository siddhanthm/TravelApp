import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'cta' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', asChild = false, className, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-body font-medium rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-gradient-to-br from-primary to-primary-container text-on-primary hover:from-primary-container hover:to-primary': variant === 'primary',
            'bg-secondary text-on-secondary hover:opacity-90': variant === 'cta',
            'bg-transparent text-on-surface hover:bg-surface-container': variant === 'ghost',
            'bg-transparent text-on-surface ring-1 ring-inset ring-outline-variant/40 hover:bg-surface-container': variant === 'outline',
          },
          {
            'px-4 py-2 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = 'Button'
