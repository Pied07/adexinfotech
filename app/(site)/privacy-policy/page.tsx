import { getSettings } from '@/lib/cms'
import { PageIntro, RichText } from '@/components/Blocks'

export default async function PrivacyPage() {
  const s = await getSettings()
  return (
    <main className="legal-page">
      <PageIntro
        eyebrow="LEGAL PROTOCOL • MARSMENT"
        title="Privacy Policy"
        text="How we protect, process, and handle your data across all digital touchpoints."
      />
      <article className="legal-content container">
        <RichText value={s?.privacyPolicy} />
        {!s?.privacyPolicy && (
          <div className="legal-default-body">
            <h2>Our Commitment to Privacy</h2>
            <p>
              At MARSMENT, your data integrity and confidentiality are paramount. We collect only the information required to deliver high-quality technical engineering, consulting, and growth marketing services.
            </p>
            <h2>Information We Collect</h2>
            <p>
              When you submit an inquiry or project brief, we collect your name, email address, phone number, and project parameters to formulate technical estimates and manage communication.
            </p>
            <h2>Use and Storage of Information</h2>
            <p>
              We use this information exclusively for client communication, project delivery, and improving our services. We do not sell, rent, or trade your personal information with external parties.
            </p>
            <h2>Data Protection and Security</h2>
            <p>
              We implement industry-standard encryption, access controls, and security hygiene to prevent unauthorized access, disclosure, or modification of stored data.
            </p>
            <h2>Inquiries</h2>
            <p>
              For any questions regarding this policy, contact our compliance team at <a href="mailto:info@marsment.com" className="text-cyan">info@marsment.com</a>.
            </p>
          </div>
        )}
      </article>
    </main>
  )
}
