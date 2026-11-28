import type { Metadata } from 'next'
import { getSettings, mediaURL } from '@/lib/cms'
import { SiteShell } from '@/components/SiteShell'
import './globals.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const businessName = settings?.businessName || process.env.NEXT_PUBLIC_BUSINESS_NAME || 'MARSMENT'
  return {
    verification: { google: 'Kmkow3XP_Ie3d1b8wMY73beKye392ESV65ayF3_5brw' },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
    title: { default: settings?.seoTitle || businessName, template: `%s | ${businessName}` },
    description: settings?.seoDescription || settings?.tagline || 'Digital strategy, creative and technology for ambitious brands.',
    icons: { icon: mediaURL(settings?.logoIcon) || mediaURL(settings?.logo) || '/icon.svg' },
  }
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Marsment',
  alternateName: 'Marsment Digital Marketing and Web Development Agency',
  url: 'https://www.marsment.com/',
  logo: 'https://res.cloudinary.com/dcdpw1kt/image/upload/f_auto,q_auto/v1795635311/adex-infotech/byzwgjzxqspepebjr8pr.png?_a=BAMAAAUu0',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '9733413928',
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: ['en', 'Bengali', 'Hindi'],
  },
  sameAs: [
    'https://www.facebook.com/MarsmentCompany/',
    'https://www.instagram.com/marsment2026',
    'https://www.youtube.com/@Marsment-b6x',
    'https://www.marsment.com/',
  ],
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    // This layout owns the <html>/<body> for all (site) routes.
    // The root app/layout.tsx is a passthrough so it doesn't conflict with
    // the Payload admin's own <html>/<body> in app/(payload)/layout.tsx.
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c') }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date());",
          }}
        />
        <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-W6MHTBNS" />
        <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-KHSN5ZNC" />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
