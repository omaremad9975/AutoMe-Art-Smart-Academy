// In-memory rate limiter — resets on server restart (acceptable for this scale)
// For each unique key (e.g. "send-otp:1.2.3.4"), tracks attempt count + window.

const store = new Map()

/**
 * @param {string}  key       - Unique identifier (e.g. "send-otp:<ip>")
 * @param {number}  limit     - Max allowed requests in the window
 * @param {number}  windowMs  - Window duration in milliseconds
 * @returns {{ allowed: boolean, remaining: number }}
 */
export function rateLimit({ key, limit, windowMs }) {
  const now = Date.now()
  let record = store.get(key)

  if (!record || now > record.resetAt) {
    record = { count: 0, resetAt: now + windowMs }
  }

  record.count++
  store.set(key, record)

  // Clean up old keys every 500 calls to prevent memory leak
  if (store.size > 500) {
    for (const [k, v] of store) {
      if (now > v.resetAt) store.delete(k)
    }
  }

  return {
    allowed:   record.count <= limit,
    remaining: Math.max(0, limit - record.count),
  }
}
