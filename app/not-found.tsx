// Root-level not-found.tsx — catches all unmatched URLs outside route groups.
// It lives outside (site) and (payload), so it must provide its own <html>/<body>
// since app/layout.tsx is now a passthrough (to avoid double-wrapping the admin).
import '@/app/(site)/globals.css'
import { getNotFoundSettings, mediaURL } from '@/lib/cms'
import { NotFoundTorchScene } from '@/components/NotFoundTorchScene'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: '404 — Wrong Way | MARSMENT',
  description: 'This route does not exist.',
}

export default async function NotFound() {
  const settings = await getNotFoundSettings()
  const bgUrl   = mediaURL(settings?.notFoundBg) ?? undefined
  const subtext = settings?.notFoundSubtext ?? undefined

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <NotFoundTorchScene bgUrl={bgUrl} subtext={subtext} />
      </body>
    </html>
  )
}
