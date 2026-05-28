import { buildApiUrl } from '../utils/apiBase'

export const demoUsers = [
  {
    id: 'patient-demo',
    role: 'patient',
    name: 'Ива Пациентова',
    email: '',
    phone: '+359 888 000 101',
  },
  {
    id: 'doctor-demo',
    role: 'doctor',
    name: 'Д-р Александър Петров',
    email: '',
    phone: '+359 888 120 137',
    specialty: 'Кардиолог',
    city: 'София',
    doctorCode: 'UIN-123456',
    status: 'verified',
    experience: 15,
    languages: ['Български', 'Английски'],
    bio: 'Кардиолог с опит в профилактиката и проследяването на сърдечно-съдови заболявания.',
  },
  {
    id: 'admin-demo',
    role: 'admin',
    name: 'MedLink Admin',
    email: 'mitkoadmin@gmail.com',
    phone: '+359 888 000 999',
  },
]

export const specialties = [
  'Кардиолог',
  'Дерматолог',
  'Невролог',
  'Ендокринолог',
  'Ортопед',
  'Педиатър',
  'Гастроентеролог',
  'Офталмолог',
  'Уролог',
  'Акушер-гинеколог',
  'Психиатър',
  'Ревматолог',
  'Пулмолог',
  'Нефролог',
  'Хирург',
]

export const cities = ['София', 'Пловдив', 'Варна', 'Бургас']

export const languageOptions = [
  'Български',
  'Английски',
  'Немски',
  'Френски',
  'Руски',
]

export const patientSubscriptionPlans = [
  {
    id: 'patient_plus',
    name: 'Patient Plus',
    audience: 'За пациенти',
    price: '4.60',
    currencyLabel: 'EUR',
    interval: 'месец',
    description: 'По-бързо управление на часове и харесани лекари.',
    features: [
      'Напомняния за предстоящи прегледи',
      'История на запазени часове',
      'Приоритетна поддръжка',
    ],
  },
  {
    id: 'patient_family',
    name: 'Family Care',
    audience: 'За семейства',
    price: '9.71',
    currencyLabel: 'EUR',
    interval: 'месец',
    highlighted: true,
    description: 'Един профил за управление на часове на цялото семейство.',
    features: [
      'До 5 семейни профила',
      'Общи напомняния за прегледи',
      'История на часове и лекари',
    ],
  },
  {
    id: 'patient_priority',
    name: 'Priority Health',
    audience: 'За активни пациенти',
    price: '14.83',
    currencyLabel: 'EUR',
    interval: 'месец',
    description: 'Разширена поддръжка и по-бърз достъп до свободни часове.',
    features: [
      'Приоритетна поддръжка',
      'Следене за нови свободни часове',
      'Разширени известия',
    ],
  },
]

export const doctorSubscriptionPlans = [
  {
    id: 'doctor_pro',
    name: 'Doctor Pro',
    audience: 'За лекари',
    price: '19.94',
    currencyLabel: 'EUR',
    interval: 'месец',
    highlighted: true,
    description: 'Професионален профил, обяви и аналитики.',
    features: [
      'Неограничени профилни обяви',
      'Разширени анализи',
      'Онлайн консултации',
    ],
  },
  {
    id: 'doctor_premium',
    name: 'Doctor Premium',
    audience: 'За активни специалисти',
    price: '35.28',
    currencyLabel: 'EUR',
    interval: 'месец',
    description: 'По-висока видимост, повече анализи и приоритетна поддръжка.',
    features: [
      'Активна обява в търсенето',
      'Подробни пациентски метрики',
      'Приоритет в резултатите',
    ],
  },
]

export const subscriptionPlans = [
  ...patientSubscriptionPlans,
  ...doctorSubscriptionPlans,
]

export function publicUser(user) {
  if (!user) return null

  return { ...user }
}

export async function validateDoctorCodeWithBackend(code) {
  const normalizedCode = code.trim().toUpperCase()

  try {
    const response = await fetch(buildApiUrl('/api/doctors/validate-code'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorCode: normalizedCode }),
    })

    if (response.ok) {
      const result = await response.json()
      return Boolean(result.valid)
    }
  } catch {
    return false
  }

  return false
}
