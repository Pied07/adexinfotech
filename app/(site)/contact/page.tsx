import { getServices, getSettings, mediaURL } from '@/lib/cms'
import { InquiryForm } from '@/components/InquiryForm'
import { PageIntro } from '@/components/Blocks'
import { Mail, Phone, MapPin, Clock, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react'

export default async function ContactPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()])
  const image = mediaURL(settings?.aboutImage) || process.env.NEXT_PUBLIC_ABOUT_IMAGE_URL
  const email = settings?.email || 'info@marsment.com'
  const phone = settings?.phone
  const address = settings?.address

  return (
    <main className="contact-page">
      <PageIntro
        eyebrow="DIRECT TRANSMISSION • MARSMENT"
        title={<>Establish Contact.<br />Initiate Your Launch.</>}
        text="A detailed brief, a rough idea, or a high-stakes challenge—our engineering and growth crew is ready to engage."
      />

      <section className="contact-layout container">
        <div className="contact-left" data-reveal>
          <div className="contact-photo">
            {image ? (
              <img src={image} alt="MARSMENT Command Center" />
            ) : (
              <div className="contact-photo-fallback">
                <span>MARSMENT MISSION CONTROL</span>
              </div>
            )}
            <div className="contact-photo-overlay">
              <span className="overlay-tag">
                <span className="dot-cyan" /> REAL-TIME COMMS LINK
              </span>
              <h3>THE FIRST STEP<br />IS A CONVERSATION.</h3>
            </div>
          </div>

          <div className="contact-details">
            <div className="mars-eyebrow">
              <span className="eyebrow-beacon" />
              <span>DIRECT CHANNELS</span>
            </div>
            <h2 className="contact-details-title">
              Good ideas deserve<br />
              <span className="text-mars">immediate attention.</span>
            </h2>
            <p className="contact-blurb">
              Reach our leadership directly. We analyze every inquiry thoroughly and reply with clear scope recommendations within one working day.
            </p>

            <div className="contact-methods-stack">
              <a className="contact-method-card" href={`mailto:${email}`}>
                <div className="method-icon"><Mail size={18} /></div>
                <div className="method-info">
                  <small>OFFICIAL EMAIL</small>
                  <b>{email}</b>
                </div>
                <ArrowUpRight size={16} className="method-arrow" />
              </a>

              {phone && (
                <a className="contact-method-card" href={`tel:${phone}`}>
                  <div className="method-icon"><Phone size={18} /></div>
                  <div className="method-info">
                    <small>DIRECT LINE</small>
                    <b>{phone}</b>
                  </div>
                  <ArrowUpRight size={16} className="method-arrow" />
                </a>
              )}

              {address && (
                <div className="contact-method-card">
                  <div className="method-icon"><MapPin size={18} /></div>
                  <div className="method-info">
                    <small>BASE LOCATION</small>
                    <b>{address}</b>
                  </div>
                </div>
              )}
            </div>

            <div className="response-guarantee-note">
              <Clock size={16} className="text-cyan" />
              <span>Standard response window: within 24 operational hours.</span>
            </div>
          </div>
        </div>

        <div className="form-panel" data-reveal>
          <div className="form-panel-header">
            <div className="mars-eyebrow">
              <span className="eyebrow-beacon" />
              <span>PROJECT SPECIFICATION</span>
            </div>
            <h2>Request a Quote / Consultation</h2>
            <p className="form-intro">
              Provide project details below to schedule an introductory discovery session with our technical leads.
            </p>
          </div>
          <InquiryForm services={services as unknown as { title: string }[]} />
        </div>
      </section>
    </main>
  )
}
