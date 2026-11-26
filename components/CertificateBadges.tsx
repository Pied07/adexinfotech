import { mediaURL } from '@/lib/cms'
import { MsmeLogo } from '@/components/MsmeLogo'

export type CertificateItem = {
  id?: string | null
  title?: string | null
  subtitle?: string | null
  image?: unknown
  showInHero?: boolean | null
}

export function CertificateBadges({
  certificates,
  variant = 'full',
}: {
  certificates?: CertificateItem[] | null
  variant?: 'hero' | 'full'
}) {
  const valid = (certificates || [])
    .map((c) => ({ ...c, imgUrl: mediaURL(c.image) }))
    .filter((c) => Boolean(c.imgUrl) && (variant !== 'hero' || c.showInHero !== false))

  if (!valid.length) {
    return variant === 'hero' ? (
      <div className="msme-badge-pill">
        <MsmeLogo compact />
      </div>
    ) : (
      <MsmeLogo />
    )
  }

  if (variant === 'hero') {
    const first = valid[0]
    return (
      <div className="msme-badge-pill">
        <img
          src={first.imgUrl}
          alt={first.title || 'Company Certificate'}
          className="cert-pill-thumb"
        />
        <span>{(first.title || 'MSME CERTIFIED').toUpperCase()}</span>
      </div>
    )
  }

  return (
    <div className="cert-gallery">
      {valid.map((cert, idx) => (
        <div className="cert-card" key={cert.id || idx}>
          <div className="cert-card-img-wrap">
            <img
              src={cert.imgUrl}
              alt={cert.title || 'Company Certificate'}
              className="cert-card-img"
            />
          </div>
          {(cert.title || cert.subtitle) && (
            <div className="cert-card-meta">
              {cert.title && <strong>{cert.title}</strong>}
              {cert.subtitle && <small>{cert.subtitle}</small>}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
