'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageCircle } from 'lucide-react'

export function FloatingWhatsApp({ phone }: { phone: string }) {
  const digits = phone.replace(/\D/g, '')
  const href = `https://wa.me/${digits}`

  const btnRef = useRef<HTMLAnchorElement>(null)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [dragging, setDragging] = useState(false)

  const dragState = useRef<{
    active: boolean
    startX: number
    startY: number
    origX: number
    origY: number
    moved: boolean
  }>({
    active: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
    moved: false,
  })

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!dragState.current.active || !btnRef.current) return
      const dx = e.clientX - dragState.current.startX
      const dy = e.clientY - dragState.current.startY
      if (Math.hypot(dx, dy) > 5) {
        dragState.current.moved = true
      }

      const rect = btnRef.current.getBoundingClientRect()
      const maxX = Math.max(12, window.innerWidth - rect.width - 12)
      const maxY = Math.max(12, window.innerHeight - rect.height - 12)
      const nextX = Math.min(maxX, Math.max(12, dragState.current.origX + dx))
      const nextY = Math.min(maxY, Math.max(12, dragState.current.origY + dy))
      setPos({ x: nextX, y: nextY })
    }

    const handlePointerUp = () => {
      if (!dragState.current.active) return
      dragState.current.active = false
      setDragging(false)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [])

  const handlePointerDown = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    const rect = e.currentTarget.getBoundingClientRect()
    dragState.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: rect.left,
      origY: rect.top,
      moved: false,
    }
    setDragging(true)
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (dragState.current.moved) {
      e.preventDefault()
      dragState.current.moved = false
    }
  }

  return (
    <a
      ref={btnRef}
      className={`whatsapp ${dragging ? 'is-dragging' : ''}`}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
      onPointerDown={handlePointerDown}
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
