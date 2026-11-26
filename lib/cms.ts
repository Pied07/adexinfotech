import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { createConnection } from 'node:net'

const connectionCheckCache = { checkedAt: 0, pending: null as Promise<boolean> | null }
let payloadPromise: Promise<Awaited<ReturnType<typeof getPayload>> | null> | null = null

async function canReachDatabase() {
  const connectionString = process.env.DATABASE_URI
  if (!connectionString) return false

  const now = Date.now()
  if (connectionCheckCache.pending && now - connectionCheckCache.checkedAt < 15_000) {
    return connectionCheckCache.pending
  }

  connectionCheckCache.checkedAt = now
  connectionCheckCache.pending = new Promise<boolean>((resolve) => {
    try {
      const database = new URL(connectionString)
      const socket = createConnection({ host: database.hostname, port: Number(database.port) || 5432 })
      let settled = false
      let timeout: ReturnType<typeof setTimeout> | undefined

      function finish(isReachable: boolean) {
        if (settled) return
        settled = true
        if (timeout) clearTimeout(timeout)
        socket.destroy()
        resolve(isReachable)
      }

      timeout = setTimeout(() => finish(false), 1_200)
      socket.once('connect', () => finish(true))
      socket.once('error', () => finish(false))
    } catch {
      resolve(false)
    }
  })

  return connectionCheckCache.pending
}

export async function getCMS() {
  // Avoid initializing Payload when the configured cloud database is offline.
  // Payload's Postgres adapter rejects its initialization promise on connection
  // errors, which can otherwise surface as an unhandled rejection in Next.js.
  if (!(await canReachDatabase())) return null
  if (!payloadPromise) {
    payloadPromise = getPayload({ config: configPromise }).catch(() => null)
  }
  const payload = await payloadPromise
  // Let a later request retry if the database was temporarily unavailable.
  if (!payload) payloadPromise = null
  return payload
}

export async function getSettings() {
  const payload = await getCMS()
  if (!payload) return null
  try { return await payload.findGlobal({ slug: 'site-settings', depth: 2 }) } catch { return null }
}

export async function getServices(limit = 100) {
  const payload = await getCMS()
  if (!payload) return []
  try { const result = await payload.find({ collection: 'services', limit, sort: 'sortOrder', depth: 1 }); return result.docs } catch { return [] }
}

export async function getService(slug: string) {
  const payload = await getCMS()
  if (!payload) return null
  try { const result = await payload.find({ collection: 'services', where: { slug: { equals: slug } }, limit: 1, depth: 1 }); return result.docs[0] ?? null } catch { return null }
}

export async function getPosts(limit = 100) {
  const payload = await getCMS()
  if (!payload) return []
  try { const result = await payload.find({ collection: 'posts', where: { _status: { equals: 'published' } }, limit, sort: '-publishedAt', depth: 1 }); return result.docs } catch { return [] }
}

export async function getPost(slug: string) {
  const payload = await getCMS()
  if (!payload) return null
  try { const result = await payload.find({ collection: 'posts', where: { slug: { equals: slug }, _status: { equals: 'published' } }, limit: 1, depth: 1 }); return result.docs[0] ?? null } catch { return null }
}

export function mediaURL(media: unknown): string | undefined {
  if (!media || typeof media !== 'object') return undefined
  const doc = media as { url?: string }
  if (!doc.url) return undefined
  return /^https?:\/\//i.test(doc.url) ? doc.url : `${process.env.NEXT_PUBLIC_SERVER_URL || ''}${doc.url}`
}
