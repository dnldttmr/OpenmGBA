/**
 * Forces cross-origin isolation (COOP/COEP) on static hosts that can't set
 * custom response headers, such as GitHub Pages. The mGBA WASM core uses
 * threads (SharedArrayBuffer), which browsers only expose in a cross-origin
 * isolated context — normally granted via the
 * Cross-Origin-Opener-Policy/Cross-Origin-Embedder-Policy response headers,
 * which vite.config.ts sets for local dev/preview but which GitHub Pages has
 * no mechanism to send for the production build.
 *
 * Works by registering this file as a service worker that rewrites every
 * response to add those headers, then reloading once so the page itself is
 * served through it. Standard technique, based on
 * https://github.com/gzuidhof/coi-serviceworker (MIT licensed).
 */

if (typeof window === 'undefined') {
  // Executing as the service worker.
  self.addEventListener('install', () => self.skipWaiting())
  self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

  self.addEventListener('fetch', (event) => {
    const request = event.request
    if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') return

    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 0) return response

          const headers = new Headers(response.headers)
          headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
          headers.set('Cross-Origin-Opener-Policy', 'same-origin')
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers,
          })
        })
        .catch((error) => console.error('coi-serviceworker fetch failed:', error)),
    )
  })
} else {
  // Executing on the page: register the worker above and reload once it
  // takes control, so this navigation is served through it.
  ;(() => {
    if (window.crossOriginIsolated !== false) return
    if (!window.isSecureContext) {
      console.warn('Cross-origin isolation needs a secure context (https).')
      return
    }

    navigator.serviceWorker
      .register(window.document.currentScript.src)
      .then((registration) => {
        registration.addEventListener('updatefound', () => window.location.reload())
        if (registration.active && !navigator.serviceWorker.controller) {
          window.location.reload()
        }
      })
      .catch((error) => console.error('coi-serviceworker registration failed:', error))
  })()
}
