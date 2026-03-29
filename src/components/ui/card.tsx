import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-surface-container-lowest rounded-xl p-4 shadow-card',
        onClick && 'cursor-pointer hover:shadow-ambient transition-shadow active:scale-[0.99]',
        className
      )}
    >
      {children}
    </div>
  )
}
