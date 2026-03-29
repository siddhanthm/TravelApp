import { cn } from '@/lib/utils'

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'w-5 h-5 rounded-full border-2 border-surface-container-highest border-t-primary animate-spin',
        className
      )}
      aria-label="Loading"
    />
  )
}
