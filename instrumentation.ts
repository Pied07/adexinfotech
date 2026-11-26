/**
 * Neon advertises both IPv4 and IPv6 addresses. Some Node hosting networks
 * cannot route IPv6, and Node's multi-address connection attempts can time out
 * before PostgreSQL establishes a connection. Prefer IPv4 and let clients use
 * one resolved address for each connection attempt.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation.node')
  }
}
