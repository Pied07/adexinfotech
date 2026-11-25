'use client'

import { usePathname } from 'next/navigation'
import { ReplayMissionButton } from '@/components/ReplayMissionButton'

export function ConditionalReplayButton() {
  const pathname = usePathname()
  if (pathname !== '/') return null
  return <ReplayMissionButton />
}
