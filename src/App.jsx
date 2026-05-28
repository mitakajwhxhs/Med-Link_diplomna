import { useCallback, useEffect, useMemo, useState } from 'react'
import ProtectedRoute from './components/ProtectedRoute'
import Toast from './components/Toast'
import {
  demoUsers,
  subscriptionPlans,
} from './data/authMock'
import { logStripeFrontendDiagnostics } from './config/stripe'
import { doctors } from './data/doctors'
import AboutPage from './pages/AboutPage'
import AdminPage from './pages/AdminPage'
import CheckoutResultPage from './pages/CheckoutResultPage'
import DoctorProfilePage from './pages/DoctorProfilePage'
import DoctorDashboard from './pages/DoctorDashboard'
import DoctorsPage from './pages/DoctorsPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import HomePage from './pages/HomePage'
import LikedPage from './pages/LikedPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import { buildApiUrl } from './utils/apiBase'
import { buildPublicDoctors, getListingDoctorId } from './utils/publicDoctors'
import { formatEuroPrice } from './utils/currency'
import {
  forgotPassword as requestPasswordResetCode,
  getCurrentAccount,
  getStoredAuthToken,
  loginAccount,
  logoutAccount,
  registerAccount,
  resendVerificationCode,
  resetPassword as submitNewPassword,
  storeAuthToken,
  verifyEmailCode,
} from './utils/authApi'

const likedStorageKey = 'medlink-liked-doctors'
const reminderStorageKey = 'medlink-reminder-doctors'
const likedByProfileStorageKey = 'medlink-liked-doctors-by-profile'
const reminderByProfileStorageKey = 'medlink-reminder-doctors-by-profile'
const appointmentStorageKey = 'medlink-appointments'
const usersStorageKey = 'medlink-users'
const currentUserStorageKey = 'medlink-current-user'
const pendingVerificationEmailStorageKey = 'medlink-pending-verification-email'
const doctorListingsStorageKey = 'medlink-doctor-listings'
const subscriptionStorageKey = 'medlink-subscription'
const profileViewsStorageKey = 'medlink-profile-views'
const removedDoctorIdsStorageKey = 'medlink-removed-doctor-ids'

function getRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '')
  return hash || 'home'
}

function readStoredIds(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}

function readStoredValue(key, fallback) {
  try {
    const storedValue = window.localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : fallback
  } catch {
    return fallback
  }
}

function readUsers() {
  const storedUsers = readStoredValue(usersStorageKey, null)
  const sourceUsers =
    Array.isArray(storedUsers) && storedUsers.length > 0
      ? storedUsers
      : demoUsers
  const adminUser = demoUsers.find((user) => user.id === 'admin-demo')
  const hasAdmin = sourceUsers.some((user) => user.id === 'admin-demo')

  const sanitizeUser = (user) => {
    const safeUser = { ...(user || {}) }
    delete safeUser.password
    return safeUser
  }

  if (!hasAdmin) return [...sourceUsers.map(sanitizeUser), adminUser]

  return sourceUsers.map((user) =>
    user.id === 'admin-demo'
      ? { ...sanitizeUser(user), role: 'admin' }
      : sanitizeUser(user),
  )
}

function App() {
  const [route, setRoute] = useState(getRoute)
  const [appointments, setAppointments] = useState(() =>
    readStoredIds(appointmentStorageKey),
  )
  const [users, setUsers] = useState(readUsers)
  const [authToken, setAuthToken] = useState(getStoredAuthToken)
  const [currentUser, setCurrentUser] = useState(() =>
    getStoredAuthToken() ? readStoredValue(currentUserStorageKey, null) : null,
  )
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState(() =>
    window.localStorage.getItem(pendingVerificationEmailStorageKey) || '',
  )
  const activeProfileId = currentUser?.id || 'guest'
  const [likedByProfile, setLikedByProfile] = useState(() =>
    readStoredValue(likedByProfileStorageKey, {
      guest: readStoredIds(likedStorageKey),
    }),
  )
  const [remindersByProfile, setRemindersByProfile] = useState(() =>
    readStoredValue(reminderByProfileStorageKey, {
      guest: readStoredIds(reminderStorageKey),
    }),
  )
  const [doctorListings, setDoctorListings] = useState(() =>
    readStoredIds(doctorListingsStorageKey),
  )
  const [subscriptions, setSubscriptions] = useState(() =>
    readStoredValue(subscriptionStorageKey, {}),
  )
  const [profileViews, setProfileViews] = useState(() =>
    readStoredIds(profileViewsStorageKey),
  )
  const [removedDoctorIds, setRemovedDoctorIds] = useState(() =>
    readStoredIds(removedDoctorIdsStorageKey).map(String),
  )
  const [toast, setToast] = useState(null)
  const likedDoctorIds = useMemo(
    () => likedByProfile[activeProfileId] || [],
    [activeProfileId, likedByProfile],
  )
  const reminderDoctorIds = useMemo(
    () => remindersByProfile[activeProfileId] || [],
    [activeProfileId, remindersByProfile],
  )
  const currentSubscription = useMemo(
    () => (currentUser ? subscriptions[currentUser.id] || null : null),
    [currentUser, subscriptions],
  )
  const publicDoctors = useMemo(
    () =>
      buildPublicDoctors(
        doctors.filter((doctor) => !removedDoctorIds.includes(String(doctor.id))),
        doctorListings,
      ).filter((doctor) => !removedDoctorIds.includes(String(doctor.id))),
    [doctorListings, removedDoctorIds],
  )

  useEffect(() => {
    logStripeFrontendDiagnostics()
  }, [])

  useEffect(() => {
    let isCancelled = false

    if (!authToken) return undefined

    getCurrentAccount(authToken)
      .then(({ user }) => {
        if (!isCancelled) setCurrentUser(user)
      })
      .catch(() => {
        if (!isCancelled) {
          storeAuthToken('')
          setAuthToken('')
          setCurrentUser(null)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [authToken])

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRoute())
      window.scrollTo({ top: 0, left: 0 })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    window.localStorage.setItem(
      likedByProfileStorageKey,
      JSON.stringify(likedByProfile),
    )
  }, [likedByProfile])

  useEffect(() => {
    window.localStorage.setItem(
      reminderByProfileStorageKey,
      JSON.stringify(remindersByProfile),
    )
  }, [remindersByProfile])

  useEffect(() => {
    window.localStorage.setItem(
      appointmentStorageKey,
      JSON.stringify(appointments),
    )
  }, [appointments])

  useEffect(() => {
    window.localStorage.setItem(usersStorageKey, JSON.stringify(users))
  }, [users])

  useEffect(() => {
    if (currentUser) {
      window.localStorage.setItem(
        currentUserStorageKey,
        JSON.stringify(currentUser),
      )
      return
    }

    window.localStorage.removeItem(currentUserStorageKey)
  }, [currentUser])

  useEffect(() => {
    if (pendingVerificationEmail) {
      window.localStorage.setItem(
        pendingVerificationEmailStorageKey,
        pendingVerificationEmail,
      )
      return
    }

    window.localStorage.removeItem(pendingVerificationEmailStorageKey)
  }, [pendingVerificationEmail])

  useEffect(() => {
    window.localStorage.setItem(
      doctorListingsStorageKey,
      JSON.stringify(doctorListings),
    )
  }, [doctorListings])

  useEffect(() => {
    window.localStorage.setItem(
      subscriptionStorageKey,
      JSON.stringify(subscriptions),
    )
  }, [subscriptions])

  useEffect(() => {
    window.localStorage.setItem(
      profileViewsStorageKey,
      JSON.stringify(profileViews),
    )
  }, [profileViews])

  useEffect(() => {
    window.localStorage.setItem(
      removedDoctorIdsStorageKey,
      JSON.stringify(removedDoctorIds),
    )
  }, [removedDoctorIds])

  const closeToast = useCallback(() => {
    setToast(null)
  }, [])

  const redirectAfterLogin = useCallback((user) => {
    if (user.role === 'doctor') {
      window.location.hash = '#/doctor/dashboard'
      return
    }

    if (user.role === 'admin') {
      window.location.hash = '#/admin'
      return
    }

    window.location.hash = '#/'
  }, [])

  const loginUser = useCallback(
    async ({ email, password }) => {
      try {
        const result = await loginAccount({ email, password })

        storeAuthToken(result.token)
        setAuthToken(result.token)
        setCurrentUser(result.user)
        setPendingVerificationEmail('')
        setToast({
          id: `login-${Date.now()}`,
          type: 'success',
          title: 'Входът е успешен',
          message:
            result.user.role === 'doctor'
              ? 'Пренасочваме ви към лекарския dashboard.'
              : 'Добре дошли в MedLink.',
        })
        redirectAfterLogin(result.user)
        return { ok: true }
      } catch (error) {
        if (error.code === 'EMAIL_NOT_VERIFIED') {
          setPendingVerificationEmail(error.email || email.trim().toLowerCase())
          setToast({
            id: `login-unverified-${Date.now()}`,
            type: 'error',
            title: 'Имейлът не е потвърден',
            message: 'Въведете 6-цифрения код, който изпратихме на имейла ви.',
          })
          window.location.hash = '#/verify-email'
          return { ok: false, message: error.message }
        }

        return {
          ok: false,
          message: error.message || 'Грешен имейл или парола.',
        }
      }
    },
    [redirectAfterLogin],
  )

  const logoutUser = useCallback(() => {
    logoutAccount().catch(() => {})
    storeAuthToken('')
    setAuthToken('')
    setCurrentUser(null)
    setToast({
      id: `logout-${Date.now()}`,
      type: 'success',
      title: 'Излязохте от профила',
      message: 'Сесията е прекратена успешно.',
    })
    window.location.hash = '#/'
  }, [])

  const registerPatient = useCallback(
    async (form) => {
      try {
        const result = await registerAccount({
          role: 'patient',
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        })
        const email = result.email || form.email.trim().toLowerCase()

        setPendingVerificationEmail(email)
        setToast({
          id: `patient-register-${Date.now()}`,
          type: 'success',
          title: 'Регистрацията е създадена',
          message: result.devVerificationCode
            ? `Тестов код за потвърждение: ${result.devVerificationCode}`
            : 'Изпратихме 6-цифрен код за потвърждение на имейла ви.',
        })
        window.location.hash = '#/verify-email'
        return { ok: true }
      } catch (error) {
        setToast({
          id: `patient-register-error-${Date.now()}`,
          type: 'error',
          title: 'Регистрацията не беше завършена',
          message: error.message || 'Проверете данните и опитайте отново.',
        })
        return { ok: false, message: error.message }
      }
    },
    [],
  )

  const registerDoctor = useCallback(
    async (form) => {
      try {
        const result = await registerAccount({
          role: 'doctor',
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          specialty: form.specialty,
          city: form.city,
          doctorCode: form.doctorCode,
          bio: form.bio,
          experience: form.experience,
          languages: form.languages,
          avatarName: form.avatarName,
        })
        const email = result.email || form.email.trim().toLowerCase()

        setPendingVerificationEmail(email)
        setToast({
          id: `doctor-register-${Date.now()}`,
          type: 'success',
          title: 'Лекарският профил е създаден',
          message: result.devVerificationCode
            ? `Тестов код за потвърждение: ${result.devVerificationCode}`
            : 'Изпратихме код за потвърждение. След това ще отворим лекарския dashboard.',
        })
        window.location.hash = '#/verify-email'
        return { ok: true }
      } catch (error) {
        setToast({
          id: `doctor-register-error-${Date.now()}`,
          type: 'error',
          title: 'Регистрацията не беше завършена',
          message: error.message || 'Проверете данните и опитайте отново.',
        })
        return { ok: false, message: error.message }
      }
    },
    [],
  )

  const verifyEmail = useCallback(
    async ({ email, code }) => {
      try {
        const result = await verifyEmailCode({ email, code })

        storeAuthToken(result.token)
        setAuthToken(result.token)
        setCurrentUser(result.user)
        setPendingVerificationEmail('')
        setToast({
          id: `verify-email-${Date.now()}`,
          type: 'success',
          title: 'Имейлът е потвърден',
          message: 'Профилът ви е активен.',
        })
        redirectAfterLogin(result.user)
        return { ok: true }
      } catch (error) {
        return {
          ok: false,
          message: error.message || 'Кодът е невалиден или изтекъл.',
        }
      }
    },
    [redirectAfterLogin],
  )

  const resendVerification = useCallback(async ({ email }) => {
    try {
      const result = await resendVerificationCode({ email })
      return { ok: true, message: result.message }
    } catch (error) {
      return {
        ok: false,
        message: error.message || 'Не успяхме да изпратим нов код.',
      }
    }
  }, [])

  const sendPasswordReset = useCallback(async ({ email }) => {
    try {
      const result = await requestPasswordResetCode({ email })
      return { ok: true, message: result.message }
    } catch (error) {
      return {
        ok: false,
        message: error.message || 'Не успяхме да изпратим код.',
      }
    }
  }, [])

  const resetPassword = useCallback(async ({ email, code, password }) => {
    try {
      const result = await submitNewPassword({ email, code, password })
      return { ok: true, message: result.message }
    } catch (error) {
      return {
        ok: false,
        message: error.message || 'Паролата не беше обновена.',
      }
    }
  }, [])

  const createDoctorListing = useCallback((listing) => {
    const hasActiveDoctorSubscription = currentSubscription?.status?.startsWith('active')
    const doctorListingCount = doctorListings.filter(
      (currentListing) =>
        currentListing.doctorId === currentUser?.id ||
        currentListing.doctorEmail === currentUser?.email ||
        currentListing.doctorName === currentUser?.name,
    ).length

    if (doctorListingCount >= 2) {
      setToast({
        id: `listing-limit-${Date.now()}`,
        type: 'error',
        title: 'Достигнат лимит от 2 обяви',
        message: 'Изтрийте стара обява, за да създадете нова.',
      })
      return
    }

    if (listing.status === 'published' && !hasActiveDoctorSubscription) {
      setToast({
        id: `listing-subscription-required-${Date.now()}`,
        type: 'error',
        title: 'Необходим е активен лекарски абонамент',
        message:
          'Можете да запазите чернова, но публикуването изисква активен месечен план.',
      })
      return
    }

    const enrichedListing = {
      ...listing,
      publicDoctorId: listing.publicDoctorId || getListingDoctorId(listing.id),
      doctorPhone: currentUser?.phone || listing.doctorPhone,
      doctorExperience: currentUser?.experience || listing.doctorExperience,
      doctorLanguages: currentUser?.languages || listing.doctorLanguages,
      doctorBio: currentUser?.bio || listing.doctorBio,
      doctorCity: currentUser?.city || listing.doctorCity,
    }

    setDoctorListings((currentListings) => [enrichedListing, ...currentListings])
    setToast({
      id: `listing-${Date.now()}`,
      type: 'success',
      title: 'Обявата е създадена',
      message:
        listing.status === 'published'
          ? 'Обявата е публикувана успешно.'
          : 'Обявата е запазена като чернова.',
    })
  }, [currentSubscription, currentUser, doctorListings])

  const updateDoctorListing = useCallback((listing) => {
    const hasActiveDoctorSubscription =
      currentSubscription?.status?.startsWith('active')

    if (listing.status === 'published' && !hasActiveDoctorSubscription) {
      setToast({
        id: `listing-edit-subscription-required-${Date.now()}`,
        type: 'error',
        title: 'Необходим е активен лекарски абонамент',
        message:
          'Можете да редактирате и запазите чернова, но публикуването изисква активен месечен план.',
      })
      return
    }

    const enrichedListing = {
      ...listing,
      publicDoctorId: listing.publicDoctorId || getListingDoctorId(listing.id),
      doctorPhone: currentUser?.phone || listing.doctorPhone,
      doctorExperience: currentUser?.experience || listing.doctorExperience,
      doctorLanguages: currentUser?.languages || listing.doctorLanguages,
      doctorBio: currentUser?.bio || listing.doctorBio,
      doctorCity: currentUser?.city || listing.doctorCity,
      updatedAt: new Date().toISOString(),
    }

    setDoctorListings((currentListings) =>
      currentListings.map((currentListing) =>
        currentListing.id === listing.id
          ? { ...currentListing, ...enrichedListing }
          : currentListing,
      ),
    )
    setToast({
      id: `listing-edit-${Date.now()}`,
      type: 'success',
      title: 'Обявата е обновена',
      message:
        listing.status === 'published'
          ? 'Промените са запазени и публичната обява е обновена.'
          : 'Промените са запазени като чернова.',
    })
  }, [currentSubscription, currentUser])

  const deleteDoctorListing = useCallback((listing) => {
    const publicDoctorId = listing.publicDoctorId || getListingDoctorId(listing.id)

    setDoctorListings((currentListings) =>
      currentListings.filter(
        (currentListing) => currentListing.id !== listing.id,
      ),
    )
    setLikedByProfile((currentProfiles) =>
      Object.fromEntries(
        Object.entries(currentProfiles).map(([profileId, likedIds]) => [
          profileId,
          likedIds.filter((doctorId) => doctorId !== publicDoctorId),
        ]),
      ),
    )
    setRemindersByProfile((currentProfiles) =>
      Object.fromEntries(
        Object.entries(currentProfiles).map(([profileId, reminderIds]) => [
          profileId,
          reminderIds.filter((doctorId) => doctorId !== publicDoctorId),
        ]),
      ),
    )
    setProfileViews((currentViews) =>
      currentViews.filter((view) => view.doctorId !== publicDoctorId),
    )
    setAppointments((currentAppointments) =>
      currentAppointments.filter(
        (appointment) => String(appointment.doctorId) !== String(publicDoctorId),
      ),
    )
    setToast({
      id: `listing-delete-${Date.now()}`,
      type: 'success',
      title: 'Обявата е изтрита',
      message:
        listing.status === 'published'
          ? 'Публичният профил вече не се вижда в страница „Лекари“.'
          : 'Черновата е премахната от таблото.',
    })
  }, [])

  const removeDoctorReferences = useCallback((doctorId) => {
    const normalizedDoctorId = String(doctorId)

    setLikedByProfile((currentProfiles) =>
      Object.fromEntries(
        Object.entries(currentProfiles).map(([profileId, likedIds]) => [
          profileId,
          likedIds.filter((id) => String(id) !== normalizedDoctorId),
        ]),
      ),
    )
    setRemindersByProfile((currentProfiles) =>
      Object.fromEntries(
        Object.entries(currentProfiles).map(([profileId, reminderIds]) => [
          profileId,
          reminderIds.filter((id) => String(id) !== normalizedDoctorId),
        ]),
      ),
    )
    setProfileViews((currentViews) =>
      currentViews.filter((view) => String(view.doctorId) !== normalizedDoctorId),
    )
    setAppointments((currentAppointments) =>
      currentAppointments.filter(
        (appointment) => String(appointment.doctorId) !== normalizedDoctorId,
      ),
    )
  }, [])

  const changeUserRole = useCallback((targetUserId, nextRole) => {
    if (targetUserId === currentUser?.id) {
      setToast({
        id: `admin-self-role-${Date.now()}`,
        type: 'error',
        title: 'Cannot change your own role',
        message: 'Use another admin account if you need to change this admin.',
      })
      return
    }

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === targetUserId
          ? {
              ...user,
              role: nextRole,
              status:
                nextRole === 'doctor'
                  ? user.status || 'pending_verification'
                  : user.status,
            }
          : user,
      ),
    )
    setToast({
      id: `admin-role-${Date.now()}`,
      type: 'success',
      title: 'Role updated',
      message: `User role changed to ${nextRole}.`,
    })
  }, [currentUser])

  const deleteUser = useCallback((targetUser) => {
    if (targetUser.id === currentUser?.id) {
      setToast({
        id: `admin-self-delete-${Date.now()}`,
        type: 'error',
        title: 'Cannot delete your own admin account',
        message: 'Create another admin first if you want to remove this one.',
      })
      return
    }

    const listingDoctorIds = doctorListings
      .filter(
        (listing) =>
          listing.doctorId === targetUser.id ||
          listing.doctorEmail === targetUser.email ||
          listing.doctorName === targetUser.name,
      )
      .map((listing) => listing.publicDoctorId || getListingDoctorId(listing.id))

    setUsers((currentUsers) =>
      currentUsers.filter((user) => user.id !== targetUser.id),
    )
    setDoctorListings((currentListings) =>
      currentListings.filter(
        (listing) =>
          listing.doctorId !== targetUser.id &&
          listing.doctorEmail !== targetUser.email &&
          listing.doctorName !== targetUser.name,
      ),
    )
    setAppointments((currentAppointments) =>
      currentAppointments.filter(
        (appointment) =>
          appointment.patientId !== targetUser.id &&
          !(
            targetUser.role === 'doctor' &&
            (appointment.doctorName === targetUser.name ||
              appointment.specialty === targetUser.specialty)
          ),
      ),
    )
    setSubscriptions((currentSubscriptions) => {
      const nextSubscriptions = { ...currentSubscriptions }
      delete nextSubscriptions[targetUser.id]
      return nextSubscriptions
    })
    listingDoctorIds.forEach(removeDoctorReferences)
    setToast({
      id: `admin-delete-user-${Date.now()}`,
      type: 'success',
      title: 'User removed',
      message: `${targetUser.name} was removed from MedLink.`,
    })
  }, [currentUser, doctorListings, removeDoctorReferences])

  const deletePublicDoctor = useCallback((doctor) => {
    if (doctor.sourceListingId) {
      const sourceListing = doctorListings.find(
        (listing) => listing.id === doctor.sourceListingId,
      )

      if (sourceListing) {
        deleteDoctorListing(sourceListing)
        return
      }
    }

    setRemovedDoctorIds((currentIds) =>
      currentIds.includes(String(doctor.id))
        ? currentIds
        : [...currentIds, String(doctor.id)],
    )
    removeDoctorReferences(doctor.id)
    setToast({
      id: `admin-delete-doctor-${Date.now()}`,
      type: 'success',
      title: 'Doctor removed',
      message: `${doctor.name} is no longer visible in the doctors page.`,
    })
  }, [deleteDoctorListing, doctorListings, removeDoctorReferences])

  const subscribeToPlan = useCallback(
    async (plan) => {
      if (!currentUser) {
        setToast({
          id: `subscription-login-${Date.now()}`,
          type: 'success',
          title: 'Необходим е вход',
          message: 'Влезте в профила си, за да продължите към Stripe плащане.',
        })
        window.location.hash = '#/login'
        return
      }

      try {
        logStripeFrontendDiagnostics()

        const response = await fetch(buildApiUrl('/api/stripe/create-checkout-session'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId: plan.id,
            planName: plan.name,
            userId: currentUser.id,
            userEmail: currentUser.email,
          }),
        })

        const checkoutSession = await response.json().catch(() => ({}))

        if (!response.ok) {
          const stripeWarnings = checkoutSession.stripe?.warnings?.join(' ')

          throw new Error(
            checkoutSession.message ||
              checkoutSession.error ||
              stripeWarnings ||
              'Stripe backend is not configured.',
          )
        }

        if (checkoutSession.url) {
          window.location.href = checkoutSession.url
          return
        }

        throw new Error('Stripe checkout session did not return a redirect URL.')
      } catch (error) {
        setToast({
          id: `stripe-error-${Date.now()}`,
          type: 'error',
          title: 'Stripe плащането не стартира',
          message:
            error.message ||
            'Проверете STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET и frontend publishable key настройките.',
        })
      }
    },
    [currentUser],
  )

  const verifyStripeCheckout = useCallback(
    async (sessionId) => {
      try {
        const response = await fetch(
          buildApiUrl(`/api/stripe/checkout-session/${sessionId}`),
        )
        const result = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(
            result.message ||
              result.error ||
              'Stripe session could not be verified.',
          )
        }

        const planId = result.metadata?.planId
        const userId = result.metadata?.userId || currentUser?.id
        const plan = subscriptionPlans.find((item) => item.id === planId)
        const isPaid =
          result.status === 'complete' || result.paymentStatus === 'paid'

        if (!isPaid || !userId || !planId) {
          throw new Error(
            'Stripe не върна успешно платена сесия. Моля, опитайте отново.',
          )
        }

        const subscriptionStatus = ['active', 'trialing'].includes(
          result.subscriptionStatus,
        )
          ? 'active'
          : result.subscriptionStatus || 'active'
        let refreshedSubscription = null

        for (const delay of [0, 1200]) {
          if (delay) {
            await new Promise((resolve) => {
              window.setTimeout(resolve, delay)
            })
          }

          const statusResponse = await fetch(
            buildApiUrl(
              `/api/stripe/subscription-status/${encodeURIComponent(userId)}`,
            ),
          )
          const statusPayload = await statusResponse.json().catch(() => ({}))

          if (statusResponse.ok && statusPayload.subscription) {
            refreshedSubscription = statusPayload.subscription
            break
          }
        }

        const nextSubscription = {
          planId,
          planName: result.metadata?.planName || plan?.name || planId,
          userId,
          status: subscriptionStatus,
          audience: plan?.audience || '',
          price: plan?.price || '',
          interval: plan?.interval || '',
          stripeCustomerId: result.customer,
          stripeSubscriptionId: result.subscriptionId,
          updatedAt: new Date().toISOString(),
          ...(refreshedSubscription || {}),
        }

        setSubscriptions((currentSubscriptions) => ({
          ...currentSubscriptions,
          [userId]: {
            ...(currentSubscriptions[userId] || {}),
            ...nextSubscription,
          },
        }))

        setToast({
          id: `stripe-success-${Date.now()}`,
          type: 'success',
          title: 'Плащането е успешно',
          message: 'Абонаментът е активиран и профилът е обновен.',
        })

        return {
          ok: true,
          message: 'Абонаментът е активиран успешно.',
        }
      } catch (error) {
        const message =
          error.message || 'Не успяхме да потвърдим Stripe плащането.'

        setToast({
          id: `stripe-verify-error-${Date.now()}`,
          type: 'error',
          title: 'Плащането не е потвърдено',
          message,
        })

        return { ok: false, message }
      }
    },
    [currentUser],
  )

  const remindDoctor = useCallback((doctor) => {
    setRemindersByProfile((currentProfiles) => {
      const currentIds = currentProfiles[activeProfileId] || []
      const nextIds = currentIds.includes(doctor.id)
        ? currentIds
        : [...currentIds, doctor.id]

      return { ...currentProfiles, [activeProfileId]: nextIds }
    })
    setToast({
      id: `${doctor.id}-reminder-${Date.now()}`,
      type: 'reminder',
      title: 'Напомнянето е добавено',
      message: `Ще видите напомняне за ${doctor.name} в запазените обяви.`,
    })
  }, [activeProfileId])

  const toggleDoctorLike = useCallback(
    (doctor) => {
      const isLiked = likedDoctorIds.includes(doctor.id)

      if (isLiked) {
        setLikedByProfile((currentProfiles) => {
          const currentIds = currentProfiles[activeProfileId] || []

          return {
            ...currentProfiles,
            [activeProfileId]: currentIds.filter((id) => id !== doctor.id),
          }
        })
        setToast({
          id: `${doctor.id}-unliked-${Date.now()}`,
          type: 'success',
          title: 'Премахнато от харесани',
          message: `${doctor.name} вече не е в харесаните обяви.`,
        })
        return
      }

      setLikedByProfile((currentProfiles) => {
        const currentIds = currentProfiles[activeProfileId] || []

        return {
          ...currentProfiles,
          [activeProfileId]: currentIds.includes(doctor.id)
            ? currentIds
            : [...currentIds, doctor.id],
        }
      })
      setToast({
        id: `${doctor.id}-liked-${Date.now()}`,
        type: 'liked',
        title: 'Обявата е харесана',
        message: `${doctor.name} е добавен в харесаните лекари.`,
        actionLabel: reminderDoctorIds.includes(doctor.id)
          ? null
          : 'Напомни ми',
        doctorId: doctor.id,
      })
    },
    [activeProfileId, likedDoctorIds, reminderDoctorIds],
  )

  const bookAppointment = useCallback(
    ({ doctor, day, slot, service, mode, details = {} }) => {
      const appointment = {
        id: `${doctor.id}-${day.id}-${slot.id}-${service.id}`,
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        city: doctor.city,
        dayId: day.id,
        dayLabel: day.label,
        date: day.date,
        slotId: slot.id,
        time: slot.time,
        serviceId: service.id,
        serviceTitle: service.title,
        price: service.price,
        mode,
        patientId: currentUser?.id || 'guest',
        patientName: details.patientName || currentUser?.name || 'Гост',
        patientPhone: details.patientPhone || currentUser?.phone || '',
        reason: details.reason || '',
        note: details.note || '',
        createdAt: new Date().toISOString(),
      }
      const isAlreadyBooked = appointments.some(
        (item) => item.id === appointment.id,
      )

      if (!isAlreadyBooked) {
        setAppointments((currentAppointments) => [
          appointment,
          ...currentAppointments,
        ])
      }

      setToast({
        id: `${appointment.id}-${Date.now()}`,
        type: 'success',
        title: isAlreadyBooked ? 'Часът вече е запазен' : 'Часът е запазен',
        message: `${doctor.name}: ${day.label}, ${day.date} в ${slot.time} - ${service.title}, ${formatEuroPrice(service.price)}.`,
      })
    },
    [appointments, currentUser],
  )

  const recordDoctorProfileView = useCallback(
    (doctor) => {
      const sessionKey = `medlink-view-${doctor.id}-${activeProfileId}`

      if (window.sessionStorage.getItem(sessionKey)) return
      window.sessionStorage.setItem(sessionKey, '1')

      setProfileViews((currentViews) => [
        {
          id: `${doctor.id}-${activeProfileId}-${Date.now()}`,
          doctorId: doctor.id,
          doctorName: doctor.name,
          specialty: doctor.specialty,
          city: doctor.city,
          viewerId: activeProfileId,
          createdAt: new Date().toISOString(),
        },
        ...currentViews,
      ])
    },
    [activeProfileId],
  )

  const handleToastAction = useCallback(
    (activeToast) => {
      const doctor = publicDoctors.find((item) => item.id === activeToast.doctorId)
      if (doctor) remindDoctor(doctor)
    },
    [publicDoctors, remindDoctor],
  )

  const sharedDoctorProps = {
    likedDoctorIds,
    reminderDoctorIds,
    likedCount: likedDoctorIds.length,
    currentUser,
    onLogout: logoutUser,
    onToggleLike: toggleDoctorLike,
    onRemind: remindDoctor,
    doctorsList: publicDoctors,
  }

  const page =
    route === 'doctors' ? (
      <DoctorsPage {...sharedDoctorProps} />
    ) : route === 'liked' ? (
      <LikedPage {...sharedDoctorProps} />
    ) : route === 'login' ? (
      <LoginPage likedCount={likedDoctorIds.length} onLogin={loginUser} />
    ) : route === 'verify-email' ? (
      <VerifyEmailPage
        likedCount={likedDoctorIds.length}
        email={pendingVerificationEmail || currentUser?.email || ''}
        onVerify={verifyEmail}
        onResend={resendVerification}
      />
    ) : route === 'forgot-password' ? (
      <ForgotPasswordPage
        likedCount={likedDoctorIds.length}
        onForgotPassword={sendPasswordReset}
        onResetPassword={resetPassword}
      />
    ) : route === 'register' ? (
      <RegisterPage
        likedCount={likedDoctorIds.length}
        onRegisterPatient={registerPatient}
        onRegisterDoctor={registerDoctor}
      />
    ) : route === 'register/patient' ? (
      <RegisterPage
        likedCount={likedDoctorIds.length}
        mode="patient"
        onRegisterPatient={registerPatient}
        onRegisterDoctor={registerDoctor}
      />
    ) : route === 'register/doctor' ? (
      <RegisterPage
        likedCount={likedDoctorIds.length}
        mode="doctor"
        onRegisterPatient={registerPatient}
        onRegisterDoctor={registerDoctor}
      />
    ) : route.startsWith('checkout/success') ? (
      <CheckoutResultPage
        status="success"
        likedCount={likedDoctorIds.length}
        currentUser={currentUser}
        onLogout={logoutUser}
        onVerifyCheckout={verifyStripeCheckout}
      />
    ) : route.startsWith('checkout/cancel') ? (
      <CheckoutResultPage
        status="cancel"
        likedCount={likedDoctorIds.length}
        currentUser={currentUser}
        onLogout={logoutUser}
      />
    ) : route === 'about' ? (
      <AboutPage
        likedCount={likedDoctorIds.length}
        currentUser={currentUser}
        onLogout={logoutUser}
      />
    ) : route === 'doctor/dashboard' ? (
      <ProtectedRoute
        user={currentUser}
        allowedRoles={['doctor']}
        redirectForbidden="#/"
      >
        <DoctorDashboard
          user={currentUser}
          listings={doctorListings}
          appointments={appointments}
          profileViews={profileViews}
          subscription={currentSubscription}
          onSubscribe={subscribeToPlan}
          onCreateListing={createDoctorListing}
          onUpdateListing={updateDoctorListing}
          onDeleteListing={deleteDoctorListing}
          onLogout={logoutUser}
        />
      </ProtectedRoute>
    ) : route === 'admin' ? (
      <ProtectedRoute
        user={currentUser}
        allowedRoles={['admin']}
        redirectForbidden="#/"
      >
        <AdminPage
          user={currentUser}
          users={users}
          doctors={publicDoctors}
          listings={doctorListings}
          appointments={appointments}
          onChangeUserRole={changeUserRole}
          onDeleteUser={deleteUser}
          onDeleteDoctor={deletePublicDoctor}
          onDeleteListing={deleteDoctorListing}
          onLogout={logoutUser}
        />
      </ProtectedRoute>
    ) : route.startsWith('doctors/') ? (
      <DoctorProfilePage
        doctorId={route.split('/')[1]}
        doctorsList={publicDoctors}
        likedCount={likedDoctorIds.length}
        currentUser={currentUser}
        onLogout={logoutUser}
        appointments={appointments}
        onBookAppointment={bookAppointment}
        onRecordView={recordDoctorProfileView}
      />
    ) : (
      <HomePage
        likedCount={likedDoctorIds.length}
        currentUser={currentUser}
        onLogout={logoutUser}
        onSubscribe={subscribeToPlan}
      />
    )

  return (
    <>
      {page}
      <Toast toast={toast} onAction={handleToastAction} onClose={closeToast} />
    </>
  )
}

export default App
