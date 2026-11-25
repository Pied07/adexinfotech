'use client'

import { ArrowUpRight, LoaderCircle, CheckCircle2, AlertCircle } from 'lucide-react'
import { useRef, useState } from 'react'

export function InquiryForm({ services = [] }: { services?: { title: string }[] }) {
  const [state, setState] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [busy, setBusy] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const inFlight = useRef(false)

  async function submit(formData: FormData) {
    if (inFlight.current) return
    inFlight.current = true
    setBusy(true)
    setState('')
    setIsSuccess(false)

    try {
      const response = await fetch('/api/inquiries', { method: 'POST', body: formData })
      if (!response.ok) throw new Error('Unable to send your inquiry right now.')
      setState('Transmission received! Mission Control will contact you within 24 hours.')
      setIsSuccess(true)
      formRef.current?.reset()
    } catch {
      setState('Transmission failed to relay. Please retry or contact us directly at info@marsment.com')
      setIsSuccess(false)
    } finally {
      inFlight.current = false
      setBusy(false)
    }
  }

  return (
    <form ref={formRef} id="inquiry-form" className="inquiry-form" action={submit} aria-busy={busy}>
      <div className="form-grid">
        <label>
          <span>Your Full Name</span>
          <input name="name" required placeholder="Alex Mercer" />
        </label>
        <label>
          <span>Email Address</span>
          <input type="email" name="email" required placeholder="alex@company.com" />
        </label>
        <label>
          <span>Contact Number</span>
          <input name="phone" placeholder="+1 (555) 019-2834" />
        </label>
        <label>
          <span>Target Capability</span>
          <select name="service" defaultValue="">
            <option value="">Select a capability</option>
            {services.map(({ title }) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </label>
        <label className="form-wide">
          <span>Project Brief & Objectives</span>
          <textarea
            name="message"
            required
            rows={4}
            placeholder="Tell us about your brand ambition, system requirements, goals or timeline..."
          />
        </label>
      </div>

      <button type="submit" disabled={busy} className="button button-mars-quote form-submit-btn">
        {busy ? (
          <>
            <LoaderCircle className="inquiry-spinner" aria-hidden="true" />
            <span>Establishing Link...</span>
          </>
        ) : (
          <>
            <span>Get a Quote / Launch Project</span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </>
        )}
      </button>

      {state && (
        <div className={`form-status ${isSuccess ? 'status-success' : 'status-error'}`} role="status" aria-live="polite">
          {isSuccess ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{state}</span>
        </div>
      )}
    </form>
  )
}
