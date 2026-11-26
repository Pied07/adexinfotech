// Root-level not-found.tsx — catches ALL unmatched URLs across the entire app.
// <html> and <body> are provided by app/layout.tsx (the root layout) —
// do NOT render them here, that was causing the hydration mismatch.
import '@/app/(site)/globals.css'
import { getSettings, mediaURL } from '@/lib/cms'
import { NotFoundTorchScene } from '@/components/NotFoundTorchScene'

export const metadata = {
  title: '404 — Wrong Way | MARSMENT',
  description: 'This route does not exist.',
}

export default async function NotFound() {
  const settings = await getSettings()

  // Admin-uploaded background — falls back to the static cave image in CSS
  const bgUrl    = mediaURL(settings?.notFoundBg) ?? undefined
  // Admin-editable subtitle — falls back inside the component
  const subtext  = settings?.notFoundSubtext ?? undefined

  return <NotFoundTorchScene bgUrl={bgUrl} subtext={subtext} />
}
