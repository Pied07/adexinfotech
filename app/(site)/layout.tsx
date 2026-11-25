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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><SiteShell>{children}</SiteShell></body></html>
}
