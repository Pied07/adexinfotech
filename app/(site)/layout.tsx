import type { Metadata } from 'next'
import { getSettings } from '@/lib/cms'
import { SiteShell } from '@/components/SiteShell'
import './globals.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const businessName = settings?.businessName || process.env.NEXT_PUBLIC_BUSINESS_NAME || 'Adex Infotech'
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
    title: { default: settings?.seoTitle || businessName, template: `%s | ${businessName}` },
    description: settings?.seoDescription || settings?.tagline || 'Digital strategy, creative and technology for ambitious brands.',
    icons: { icon: mediaIcon(settings?.logo) },
  }
}

function mediaIcon(value: unknown) { if (value && typeof value === 'object' && 'url' in value) return `${process.env.NEXT_PUBLIC_SERVER_URL || ''}${String((value as {url:string}).url)}`; return '/favicon.ico' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><SiteShell>{children}</SiteShell></body></html>
}
