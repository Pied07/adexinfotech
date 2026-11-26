// Root layout — Next.js App Router requires exactly one root layout.
// IMPORTANT: We do NOT render <html>/<body> here because:
//   - app/(site)/layout.tsx   provides <html>/<body> for all site routes
//   - app/(payload)/layout.tsx provides <html>/<body> for the Payload admin
// Adding <html>/<body> here would double-wrap both groups and break the admin.
// The root not-found.tsx renders its own <html>/<body> for the 404 route.
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
