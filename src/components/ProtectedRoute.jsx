import { useEffect } from 'react'

export default function ProtectedRoute({
  user,
  allowedRoles,
  children,
  redirectUnauthed = '#/login',
  redirectUnverified = '#/verify-email',
  redirectForbidden = '#/',
}) {
  const isAuthenticated = Boolean(user)
  const isVerified = isAuthenticated && user.emailVerified === true
  const isAllowed = isVerified && allowedRoles.includes(user.role)

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.hash = redirectUnauthed
      return
    }

    if (!isVerified) {
      window.location.hash = redirectUnverified
      return
    }

    if (!isAllowed) {
      window.location.hash = redirectForbidden
    }
  }, [
    isAllowed,
    isAuthenticated,
    isVerified,
    redirectForbidden,
    redirectUnauthed,
    redirectUnverified,
  ])

  if (!isAuthenticated || !isVerified || !isAllowed) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#F5F7FB] px-5 text-center text-[#0D2E8B]">
        <div>
          <h1 className="text-[26px] font-extrabold">Пренасочване...</h1>
          <p className="mt-2 text-[14px] font-semibold text-[#526383]">
            Проверяваме достъпа до тази страница.
          </p>
        </div>
      </main>
    )
  }

  return children
}
