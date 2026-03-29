import { cn } from '@/lib/utils'
import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="font-label text-sm tracking-[0.05rem] text-on-surface-variant">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'bg-surface-container-high rounded-xl px-4 py-3 font-body text-on-surface',
            'placeholder:text-on-surface-variant',
            'focus:outline-none focus:ring-2 focus:ring-primary-fixed/50',
            'disabled:opacity-50',
            error && 'ring-2 ring-error/50',
            className
          )}
          {...props}
        />
        {error && (
          <p className="font-label text-xs text-error">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
