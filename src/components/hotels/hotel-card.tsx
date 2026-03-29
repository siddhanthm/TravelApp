'use client'

import { Card } from '@/components/ui/card'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Hotel } from '@/types'
import { Building2, Calendar, DollarSign, ExternalLink, Trash2 } from 'lucide-react'

interface HotelCardProps {
  hotel: Hotel
  canEdit: boolean
  onDelete: () => void
}

export function HotelCard({ hotel, canEdit, onDelete }: HotelCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-primary shrink-0" />
            <h3 className="font-headline text-lg font-semibold text-on-surface truncate">{hotel.name}</h3>
          </div>
          {hotel.address && (
            <p className="font-body text-sm text-on-surface-variant mb-3">{hotel.address}</p>
          )}
          <div className="flex flex-wrap gap-4 text-on-surface-variant">
            {(hotel.check_in || hotel.check_out) && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span className="font-label text-xs tracking-[0.05rem]">
                  {formatDate(hotel.check_in)} – {formatDate(hotel.check_out)}
                </span>
              </div>
            )}
            {hotel.price != null && (
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 shrink-0" />
                <span className="font-label text-xs tracking-[0.05rem]">
                  {formatCurrency(hotel.price, hotel.currency)}
                </span>
              </div>
            )}
          </div>
          {hotel.notes && (
            <p className="font-body text-sm text-on-surface-variant mt-3">{hotel.notes}</p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          {hotel.booking_url && (
            <a
              href={hotel.booking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl p-2 hover:bg-surface-container text-on-surface-variant transition-colors"
              aria-label="Open booking link"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {canEdit && (
            <button
              onClick={onDelete}
              className="rounded-xl p-2 hover:bg-error-container text-on-surface-variant hover:text-on-error-container transition-colors"
              aria-label="Delete hotel"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </Card>
  )
}
