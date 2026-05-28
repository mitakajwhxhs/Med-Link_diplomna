const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''

export function buildApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const apiBaseUrl = rawApiBaseUrl.replace(/\/+$/, '')

  return apiBaseUrl ? `${apiBaseUrl}${normalizedPath}` : normalizedPath
}
