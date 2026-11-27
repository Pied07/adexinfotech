'use client'

// Keep the rocket preloader in the initial HTML so the home page is never
// shown while the client bundle is downloading.
import dynamic from 'next/dynamic'

const RocketLaunchExperience = dynamic(
  () =>
    import('@/components/RocketLaunchExperience').then(m => ({
      default: m.RocketLaunchExperience,
    }))
)

export function RocketLaunchExperienceClient() {
  return <RocketLaunchExperience />
}
