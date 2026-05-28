import { buildApiUrl } from './apiBase'

const tokenStorageKey = 'medlink-auth-token'

export class AuthApiError extends Error {
  constructor(message, payload = {}, status = 0) {
    super(message)
    this.name = 'AuthApiError'
    this.payload = payload
    this.status = status
    this.code = payload.code
    this.email = payload.email
  }
}

export function getStoredAuthToken() {
  return window.localStorage.getItem(tokenStorageKey) || ''
}

export function storeAuthToken(token) {
  if (token) {
    window.localStorage.setItem(tokenStorageKey, token)
    return
  }

  window.localStorage.removeItem(tokenStorageKey)
}

export async function authRequest(path, { method = 'POST', body, token } = {}) {
  const headers = {
    'Content-Type': 'application/json',
  }
  const authToken = token === undefined ? getStoredAuthToken() : token

  if (authToken) headers.Authorization = `Bearer ${authToken}`

  const response = await fetch(buildApiUrl(`/api/auth${path}`), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new AuthApiError(
      payload.message || 'Заявката не беше успешна.',
      payload,
      response.status,
    )
  }

  return payload
}

export function registerAccount(payload) {
  return authRequest('/register', { body: payload })
}

export function loginAccount(payload) {
  return authRequest('/login', { body: payload })
}

export function verifyEmailCode(payload) {
  return authRequest('/verify-email', { body: payload })
}

export function resendVerificationCode(payload) {
  return authRequest('/resend-verification-code', { body: payload })
}

export function forgotPassword(payload) {
  return authRequest('/forgot-password', { body: payload })
}

export function resetPassword(payload) {
  return authRequest('/reset-password', { body: payload })
}

export function logoutAccount() {
  return authRequest('/logout')
}

export function getCurrentAccount(token) {
  return authRequest('/me', { method: 'GET', token })
}
