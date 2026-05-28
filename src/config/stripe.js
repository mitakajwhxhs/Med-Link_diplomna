function getPublishableKey() {
  return (
    import.meta.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    ''
  ).trim()
}

function getKeyMode(key) {
  if (!key) return 'missing'
  if (key.startsWith('pk_test_')) return 'test'
  if (key.startsWith('pk_live_')) return 'live'
  return 'invalid'
}

let hasLoggedDiagnostics = false

export function getStripeFrontendDiagnostics() {
  const publishableKey = getPublishableKey()
  const mode = getKeyMode(publishableKey)

  return {
    publishableKeyConfigured: mode === 'test' || mode === 'live',
    mode,
  }
}

export function logStripeFrontendDiagnostics() {
  if (hasLoggedDiagnostics) return

  hasLoggedDiagnostics = true

  const diagnostics = getStripeFrontendDiagnostics()

  if (!diagnostics.publishableKeyConfigured) {
    console.warn(
      '[stripe] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing or invalid. Hosted Checkout can still redirect from the backend, but Stripe.js cannot be initialized on the frontend.',
    )
    return
  }

  console.info(`[stripe] Frontend publishable key loaded in ${diagnostics.mode} mode.`)
}
