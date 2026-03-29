import { cn } from '@/lib/utils'
import { type TextareaHTMLAttributes, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="font-label text-sm tracking-[0.05rem] text-on-surface-variant">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'bg-surface-container-high rounded-xl px-4 py-3 font-body text-on-surface resize-none',
            'placeholder:text-on-surface-variant',
            'focus:outline-none focus:ring-2 focus:ring-primary-fixed/50',
            'disabled:opacity-50 min-h-[100px]',
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
Textarea.displayName = 'Textarea'
