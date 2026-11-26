import { getSettings } from '@/lib/cms'
import { PageIntro, RichText, richTextHasContent } from '@/components/Blocks'

export default async function TermsPage() {
  const s = (await getSettings()) as Record<string, unknown> | null
  const name = (s?.businessName as string) || 'MARSMENT'
  const email = (s?.email as string) || 'info@marsment.com'
  const hasRichContent = richTextHasContent(s?.terms)

  return (
    <main className="legal-page">
      <PageIntro
        eyebrow={(s?.termsEyebrow as string) || `TERMS OF ENGAGEMENT • ${name.toUpperCase()}`}
        title={(s?.termsTitle as string) || 'Terms & Conditions'}
        text={(s?.termsSubtitle as string) || 'The operational framework governing your use of our platforms and digital services.'}
      />
      <article className="legal-content container">
        {hasRichContent ? (
          <RichText value={s?.terms} />
        ) : (
          <div className="legal-default-body">
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing and utilizing the {name} website, you agree to comply with these terms, applicable laws, and relevant regulations. If you disagree with any part, please discontinue platform use.
            </p>
            <h2>Intellectual Property</h2>
            <p>
              All proprietary branding, technical codebases, design architectures, visuals, and copy on this site belong to {name} or licensed partners. Unsanctioned duplication is prohibited.
            </p>
            <h2>Service Scopes &amp; Deliverables</h2>
            <p>
              All custom web development, software engineering, and marketing agreements are governed by independent Statements of Work (SOWs) executed between {name} and the client.
            </p>
            <h2>Limitation of Liability</h2>
            <p>
              {name} makes reasonable efforts to maintain platform accuracy and uninterrupted availability. However, we do not warrant that all site materials are completely free of errors or disruptions.
            </p>
            <h2>Contact</h2>
            <p>
              Direct legal correspondence to{' '}
              <a href={`mailto:${email}`} className="text-cyan">{email}</a>.
            </p>
          </div>
        )}
      </article>
    </main>
  )
}
