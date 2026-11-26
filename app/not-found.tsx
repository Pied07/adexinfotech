// Root-level not-found.tsx — catches ALL unmatched URLs across the entire app.
// <html> and <body> are provided by app/layout.tsx (the root layout) —
// do NOT render them here, that was causing the hydration mismatch.
import '@/app/(site)/globals.css'
import { NotFoundTorchScene } from '@/components/NotFoundTorchScene'

export const metadata = {
  title: '404 — Wrong Way | MARSMENT',
  description: 'This route does not exist.',
}

export default function NotFound() {
  return <NotFoundTorchScene />
}
