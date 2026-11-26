import { getNotFoundSettings, mediaURL } from '@/lib/cms'
import { NotFoundTorchScene } from '@/components/NotFoundTorchScene'

export default async function NotFound() {
  const settings = await getNotFoundSettings()
  const bgUrl   = mediaURL(settings?.notFoundBg) ?? undefined
  const subtext = settings?.notFoundSubtext ?? undefined
  return <NotFoundTorchScene bgUrl={bgUrl} subtext={subtext} />
}
