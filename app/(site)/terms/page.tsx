import { getSettings } from '@/lib/cms'
import { PageIntro, RichText } from '@/components/Blocks'

export default async function TermsPage() {
  const s = await getSettings()
  return (
    <main className="legal-page">
      <PageIntro
        eyebrow="TERMS OF ENGAGEMENT • MARSMENT"
        title="Terms & Conditions"
        text="The operational framework governing your use of our platforms and digital services."
      />
      <article className="legal-content container">
        <RichText value={s?.terms} />
        {!s?.terms && (
          <div className="legal-default-body">
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing and utilizing the MARSMENT website, you agree to comply with these terms, applicable laws, and relevant regulations. If you disagree with any part, please discontinue platform use.
            </p>
            <h2>Intellectual Property</h2>
            <p>
              All proprietary branding, technical codebases, design architectures, visuals, and copy on this site belong to MARSMENT or licensed partners. Unsanctioned duplication is prohibited.
            </p>
            <h2>Service Scopes & Deliverables</h2>
            <p>
              All custom web development, software engineering, and marketing agreements are governed by independent Statements of Work (SOWs) executed between MARSMENT and the client.
            </p>
            <h2>Limitation of Liability</h2>
            <p>
              MARSMENT makes reasonable efforts to maintain platform accuracy and uninterrupted availability. However, we do not warrant that all site materials are completely free of errors or disruptions.
            </p>
            <h2>Contact</h2>
            <p>
              Direct legal correspondence to <a href="mailto:info@marsment.com" className="text-cyan">info@marsment.com</a>.
            </p>
          </div>
        )}
      </article>
    </main>
  )
}
