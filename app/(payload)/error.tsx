'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function PayloadError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main
      role="alert"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '24px',
        background: '#0d0d0d',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif',
        textAlign: 'center',
      }}
    >
      <h1 style={{ margin: 0 }}>Admin failed to load</h1>
      <p style={{ maxWidth: '480px', color: '#aaa' }}>
        Payload could not load this admin page. Check the server logs and database connection, then try again.
      </p>
      {error.digest && <p style={{ color: '#777', fontSize: '0.8rem' }}>Error ID: {error.digest}</p>}
      <button
        onClick={() => retry()}
        style={{
          padding: '10px 24px',
          border: 0,
          borderRadius: '999px',
          background: '#fff',
          color: '#000',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Try again
      </button>
      <Link href="/admin" style={{ color: '#aaa' }}>Back to admin</Link>
    </main>
  )
}
