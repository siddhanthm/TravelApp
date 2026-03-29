'use client'

import * as RadixDialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Dialog = RadixDialog.Root
export const DialogTrigger = RadixDialog.Trigger

interface DialogContentProps {
  children: React.ReactNode
  title: string
  description?: string
  className?: string
}

export function DialogContent({ children, title, description, className }: DialogContentProps) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-40" />
      <RadixDialog.Content
        className={cn(
          'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
          'bg-surface-container-lowest rounded-xl shadow-ambient',
          'w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto',
          className
        )}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <RadixDialog.Title className="font-headline text-xl font-semibold text-on-surface">
              {title}
            </RadixDialog.Title>
            {description && (
              <RadixDialog.Description className="font-body text-sm text-on-surface-variant mt-1">
                {description}
              </RadixDialog.Description>
            )}
          </div>
          <RadixDialog.Close className="rounded-xl p-2 hover:bg-surface-container text-on-surface-variant transition-colors">
            <X className="w-4 h-4" />
          </RadixDialog.Close>
        </div>
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  )
}
