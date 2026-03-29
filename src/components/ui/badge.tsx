import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'active' | 'error'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 font-label text-xs tracking-[0.05rem]',
        {
          'bg-surface-container-highest text-on-surface-variant': variant === 'default',
          'bg-primary-container text-on-primary-container': variant === 'active',
          'bg-error-container text-on-error-container': variant === 'error',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
