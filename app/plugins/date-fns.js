// Nuxt plugin to provide a $moment-compatible wrapper backed by date-fns
// Supports .format() and .add() which cover current usages in the app.
import { format as dfFormat, add as dfAdd, parseISO, isValid } from 'date-fns'

function toDate(input) {
  if (input instanceof Date) return input
  if (typeof input === 'string') {
    const d = parseISO(input)
    if (isValid(d)) return d
    const nd = new Date(input)
    return isValid(nd) ? nd : new Date()
  }
  if (typeof input === 'number') {
    const nd = new Date(input)
    return isValid(nd) ? nd : new Date()
  }
  const nd = new Date(input)
  return isValid(nd) ? nd : new Date()
}

const unitMap = {
  d: 'days', day: 'days', days: 'days',
  w: 'weeks', week: 'weeks', weeks: 'weeks',
  M: 'months', month: 'months', months: 'months',
  y: 'years', year: 'years', years: 'years',
  h: 'hours', hour: 'hours', hours: 'hours',
  m: 'minutes', min: 'minutes', minute: 'minutes', minutes: 'minutes',
  s: 'seconds', sec: 'seconds', second: 'seconds', seconds: 'seconds'
}

function normalizeTokens(fmt) {
  if (!fmt) return 'yyyy-MM-dd'
  // Convert Moment-style tokens we use to date-fns tokens
  // "Do" (1st, 2nd, ...) => "do"
  let f = fmt.replace(/Do/g, 'do')
  // Common Moment tokens not used in this codebase could be mapped here if needed
  return f
}

function momentLike(input) {
  let date = toDate(input)
  return {
    add(amount, unit) {
      const key = unitMap[unit] || unit
      date = dfAdd(date, { [key]: amount })
      return this
    },
    format(fmt) {
      return dfFormat(date, normalizeTokens(fmt))
    },
    toDate() {
      return date
    }
  }
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      date: (d) => momentLike(d)
    }
  }
})
