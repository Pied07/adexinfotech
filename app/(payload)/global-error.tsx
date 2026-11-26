'use client'

// Catches unhandled errors in the (payload) admin layout/pages.
// Without this, any Payload initialization error (e.g. DB briefly unreachable)
// falls through to app/not-found.tsx and shows the cave 404 page instead of
// a helpful admin error.
export default function AdminGlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, sans-serif',
          background: '#0d0d0d',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: '16px',
          textAlign: 'center',
          padding: '24px',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Admin failed to load</h1>
        <p style={{ color: '#aaa', margin: 0, maxWidth: '480px' }}>
          {error?.message || 'An unexpected error occurred while initialising the Payload admin panel.'}
          {error?.digest && (
            <span style={{ display: 'block', marginTop: '8px', fontSize: '0.75rem', color: '#666' }}>
              Digest: {error.digest}
            </span>
          )}
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: '8px',
            padding: '10px 24px',
            background: '#fff',
            color: '#000',
            border: 'none',
            borderRadius: '999px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          Try again
        </button>
        <a
          href="/admin"
          style={{ color: '#888', fontSize: '0.85rem', textDecoration: 'none' }}
        >
          ← Back to Admin home
        </a>
      </body>
    </html>
  )
}
