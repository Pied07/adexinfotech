'use client'

// next/dynamic with ssr:false is only allowed inside Client Components.
// SiteShell is an async Server Component, so this thin wrapper carries the
// dynamic import while SiteShell stays a pure server component.
import dynamic from 'next/dynamic'

const RocketLaunchExperience = dynamic(
  () =>
    import('@/components/RocketLaunchExperience').then(m => ({
      default: m.RocketLaunchExperience,
    })),
  { ssr: false }
)

export function RocketLaunchExperienceClient() {
  return <RocketLaunchExperience />
}
