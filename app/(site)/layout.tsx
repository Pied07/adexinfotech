import type { Metadata } from 'next'
import { getSettings, mediaURL } from '@/lib/cms'
import { SiteShell } from '@/components/SiteShell'
import './globals.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const businessName = settings?.businessName || process.env.NEXT_PUBLIC_BUSINESS_NAME || 'MARSMENT'
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
    title: { default: settings?.seoTitle || businessName, template: `%s | ${businessName}` },
    description: settings?.seoDescription || settings?.tagline || 'Digital strategy, creative and technology for ambitious brands.',
    icons: { icon: mediaURL(settings?.logoIcon) || mediaURL(settings?.logo) || '/icon.svg' },
  }
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    // This layout owns the <html>/<body> for all (site) routes.
    // The root app/layout.tsx is a passthrough so it doesn't conflict with
    // the Payload admin's own <html>/<body> in app/(payload)/layout.tsx.
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
