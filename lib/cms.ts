import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { createConnection } from 'node:net'

const connectionCheckCache = { checkedAt: 0, pending: null as Promise<boolean> | null }
let payloadPromise: Promise<Awaited<ReturnType<typeof getPayload>> | null> | null = null

const CMS_TIMEOUT_MS = 4_000

async function withCmsTimeout<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      operation().catch(() => fallback),
      new Promise<T>((resolve) => {
        timeout = setTimeout(() => resolve(fallback), CMS_TIMEOUT_MS)
      }),
    ])
  } finally {
    if (timeout) clearTimeout(timeout)
  }
}

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
  const payload = await withCmsTimeout(async () => {
    if (!(await canReachDatabase())) return null
    if (!payloadPromise) {
      payloadPromise = getPayload({ config: configPromise }).catch(() => null)
    }
    return payloadPromise
  }, null)
  // Let a later request retry if the database was temporarily unavailable.
  if (!payload && payloadPromise) {
    const pendingPayload = payloadPromise
    void pendingPayload.then((resolved) => {
      if (!resolved && payloadPromise === pendingPayload) payloadPromise = null
    })
  }
  return payload
}

export async function getSettings() {
  return withCmsTimeout(async () => {
    const payload = await getCMS()
    return payload ? payload.findGlobal({ slug: 'site-settings', depth: 2 }) : null
  }, null)
}

/** Keep a missing-page response available even when the CMS is slow to start. */
export async function getNotFoundSettings() {
  let timeout: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      getSettings(),
      new Promise<null>((resolve) => {
        timeout = setTimeout(() => resolve(null), 2_500)
        timeout.unref?.()
      }),
    ])
  } finally {
    if (timeout) clearTimeout(timeout)
  }
}

export async function getServices(limit = 100) {
  return withCmsTimeout(async () => {
    const payload = await getCMS()
    if (!payload) return []
    const result = await payload.find({ collection: 'services', limit, sort: 'sortOrder', depth: 1 })
    return result.docs
  }, [])
}

export async function getService(slug: string) {
  return withCmsTimeout(async () => {
    const payload = await getCMS()
    if (!payload) return null
    const result = await payload.find({ collection: 'services', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
    return result.docs[0] ?? null
  }, null)
}

export async function getPosts(limit = 100) {
  return withCmsTimeout(async () => {
    const payload = await getCMS()
    if (!payload) return []
    const result = await payload.find({ collection: 'posts', where: { _status: { equals: 'published' } }, limit, sort: '-publishedAt', depth: 1 })
    return result.docs
  }, [])
}

export async function getPost(slug: string) {
  return withCmsTimeout(async () => {
    const payload = await getCMS()
    if (!payload) return null
    const result = await payload.find({ collection: 'posts', where: { slug: { equals: slug }, _status: { equals: 'published' } }, limit: 1, depth: 1 })
    return result.docs[0] ?? null
  }, null)
}

export function mediaURL(media: unknown): string | undefined {
  if (!media || typeof media !== 'object') return undefined
  const doc = media as { url?: string }
  if (!doc.url) return undefined
  return /^https?:\/\//i.test(doc.url) ? doc.url : `${process.env.NEXT_PUBLIC_SERVER_URL || ''}${doc.url}`
}
