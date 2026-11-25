'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageCircle } from 'lucide-react'

export function FloatingWhatsApp({ phone }: { phone: string }) {
  const digits = phone.replace(/\D/g, '')
  const href = `https://wa.me/${digits}`

  const btnRef = useRef<HTMLAnchorElement>(null)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const dragState = useRef<{
    active: boolean
    pointerId: number
    pointerType: string
    startX: number
    startY: number
    origX: number
    origY: number
    moved: boolean
  }>({
    active: false,
    pointerId: -1,
    pointerType: 'mouse',
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
    moved: false,
  })

  // Collapse expanded label on outside tap (mobile)
  useEffect(() => {
    if (!expanded) return
    const handleOutside = (e: PointerEvent) => {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setExpanded(false)
      }
    }
    window.addEventListener('pointerdown', handleOutside)
    return () => window.removeEventListener('pointerdown', handleOutside)
  }, [expanded])

  const handlePointerDown = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    const rect = e.currentTarget.getBoundingClientRect()
    dragState.current = {
      active: true,
      pointerId: e.pointerId,
      pointerType: e.pointerType,
      startX: e.clientX,
      startY: e.clientY,
      origX: rect.left,
      origY: rect.top,
      moved: false,
    }
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // ignore if unsupported
    }
    setDragging(true)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!dragState.current.active || e.pointerId !== dragState.current.pointerId) return
    const dx = e.clientX - dragState.current.startX
    const dy = e.clientY - dragState.current.startY
    if (Math.hypot(dx, dy) > 5) {
      dragState.current.moved = true
    }

    const rect = e.currentTarget.getBoundingClientRect()
    const maxX = Math.max(12, window.innerWidth - rect.width - 12)
    const maxY = Math.max(12, window.innerHeight - rect.height - 12)
    const nextX = Math.min(maxX, Math.max(12, dragState.current.origX + dx))
    const nextY = Math.min(maxY, Math.max(12, dragState.current.origY + dy))
    setPos({ x: nextX, y: nextY })
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!dragState.current.active) return
    dragState.current.active = false
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId)
      }
    } catch {
      // ignore
    }
    setDragging(false)
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (dragState.current.moved) {
      e.preventDefault()
      dragState.current.moved = false
      return
    }

    // On touch / mobile (no hover): 1st tap expands label, 2nd tap opens WhatsApp
    const isTouchLike =
      dragState.current.pointerType !== 'mouse' ||
      (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches)

    if (isTouchLike && !expanded) {
      e.preventDefault()
      setExpanded(true)
    }
  }

  return (
    <a
      ref={btnRef}
      className={`whatsapp ${dragging ? 'is-dragging' : ''} ${expanded ? 'is-expanded' : ''}`}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={handleClick}
      style={
        pos
          ? {
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              right: 'auto',
              bottom: 'auto',
            }
          : undefined
      }
    >
      <MessageCircle aria-hidden="true" size={20} className="whatsapp-icon" />
      <b className="whatsapp-label">WhatsApp</b>
    </a>
  )
}
