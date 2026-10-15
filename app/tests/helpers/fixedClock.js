// Freezes `new Date()` / `Date.now()` for code that reads the clock internally
// (e.g. getTodayNumeric). node:test's mock.timers rejects 'Date' on Node 20.10.

export function withFixedNow (isoString, fn) {
  const RealDate = globalThis.Date
  const fixed = new RealDate(isoString).getTime()

  class FixedDate extends RealDate {
    constructor (...args) {
      if (args.length) {
        super(...args)
      } else {
        super(fixed)
      }
    }

    static now () {
      return fixed
    }
  }

  globalThis.Date = FixedDate
  try {
    return fn()
  } finally {
    globalThis.Date = RealDate
  }
}
