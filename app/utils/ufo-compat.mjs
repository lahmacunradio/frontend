// Compatibility shim for `ufo` to provide missing exports for environments where the
// installed `ufo` package doesn't export them. We re-export everything from the real
// module and provide compatibility aliases.
//
// IMPORTANT: We import the real file by absolute path to avoid alias recursion.
export * from '../node_modules/ufo/dist/index.mjs'

// Import specific functions to create aliases if needed
import { joinURL, hasProtocol } from '../node_modules/ufo/dist/index.mjs'

// Provide missing exports that some Nuxt/Vite versions expect
export const joinRelativeURL = joinURL
export const isScriptProtocol = (protocol) => {
  // Check if protocol is javascript: or data: (potentially dangerous)
  if (!protocol) return false
  const normalized = protocol.toLowerCase().replace(/:$/, '')
  return normalized === 'javascript' || normalized === 'data' || normalized === 'vbscript'
}

