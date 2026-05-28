import { formatEuroPrice } from './currency'

const appointmentDays = [
  { label: 'Днес', date: '27 май' },
  { label: 'Утре', date: '28 май' },
  { label: 'Петък', date: '29 май' },
  { label: 'Събота', date: '30 май' },
  { label: 'Неделя', date: '31 май' },
  { label: 'Понеделник', date: '1 юни' },
  { label: 'Сряда', date: '3 юни' },
]

function makeFallbackAvatar(name) {
  const initials = String(name || 'Dr')
    .replace('Д-р', '')
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
      <rect width="160" height="160" rx="80" fill="#EAFBFD"/>
      <circle cx="80" cy="61" r="34" fill="#13B5C8"/>
      <path d="M28 150c9-34 28-52 52-52s43 18 52 52" fill="#0D2E8B"/>
      <text x="80" y="71" text-anchor="middle" font-size="30" font-family="Arial" font-weight="700" fill="white">${initials}</text>
    </svg>`

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function parseSlots(value) {
  return String(value || '09:00, 10:00, 11:00, 13:00, 14:00, 15:00, 16:00')
    .split(/[,\n;]/)
    .map((slot) => slot.trim())
    .filter(Boolean)
}

function makePriceList(basePrice, online) {
  const price = Number(basePrice || 35)
  const prices = [
    {
      id: 'primary',
      title: 'Първичен преглед',
      description: 'Преглед, анамнеза и план за лечение',
      price,
    },
    {
      id: 'secondary',
      title: 'Контролен преглед',
      description: 'Проследяване след първичен преглед',
      price: Math.max(price - 10, 20),
    },
    {
      id: 'documents',
      title: 'Преглед на документи',
      description: 'Оценка на резултати и медицински документи',
      price: Math.max(price - 15, 18),
    },
  ]

  if (online) {
    prices.push({
      id: 'online',
      title: 'Онлайн консултация',
      description: 'Видео разговор през MedLink',
      price: Math.max(price - 8, 22),
    })
  }

  return prices
}

function makeSchedule(listingId, freeSlots, price) {
  const slots = parseSlots(freeSlots)

  if (slots.length === 0) return []

  return appointmentDays.map((day, dayIndex) => ({
    id: `${listingId}-${dayIndex}`,
    ...day,
    slots: slots.slice(0, 6).map((time, timeIndex) => ({
      id: `${listingId}-${dayIndex}-${timeIndex}`,
      time,
      price: Number(price || 35),
    })),
  }))
}

export function getListingDoctorId(listingId) {
  return `listing-${listingId}`
}

export function listingToPublicDoctor(listing) {
  const id = listing.publicDoctorId || getListingDoctorId(listing.id)
  const freeSlots = parseSlots(listing.freeSlots)
  const price = Number(listing.price || 35)
  const hasFreeSlots = freeSlots.length > 0
  const doctorName = listing.doctorName || 'Д-р MedLink'
  const city = listing.location || listing.doctorCity || 'София'

  return {
    id,
    sourceListingId: listing.id,
    doctorId: listing.doctorId,
    name: doctorName,
    specialty: listing.specialty,
    city,
    experience: Number(listing.doctorExperience || listing.experience || 0),
    languages: listing.doctorLanguages?.length
      ? listing.doctorLanguages
      : ['Български'],
    online: Boolean(listing.online),
    status: hasFreeSlots ? 'available' : 'busy',
    verificationStatus: 'pending_verification',
    subscriptionStatus: 'active',
    rating: Number(listing.rating || 5).toFixed(1),
    reviews: Number(listing.reviews || 0),
    image: listing.image || makeFallbackAvatar(doctorName),
    clinic: listing.clinic || `Медицински център MedLink ${city}`,
    address: listing.locationDetails || `Кабинет: ${city}`,
    price: formatEuroPrice(price),
    nextSlot: hasFreeSlots
      ? `${appointmentDays[0].label}, ${freeSlots[0]}`
      : 'Няма свободни часове',
    priceList: makePriceList(price, listing.online),
    schedule: makeSchedule(id, listing.freeSlots, price),
    phone: listing.doctorPhone || '+359 888 120274',
    bio:
      listing.description ||
      listing.doctorBio ||
      `${doctorName} предлага прегледи през MedLink.`,
    services: [
      listing.title,
      `${listing.specialty} консултация`,
      listing.online ? 'Онлайн консултация' : 'Преглед в кабинет',
    ].filter(Boolean),
    education: [
      `Специалност ${listing.specialty}`,
      `Работно време: ${listing.workingHours || '09:00 - 17:00'}`,
    ],
    availability: freeSlots,
    patientReviews: [
      {
        author: 'MedLink',
        text: 'Нов публичен лекарски профил, създаден през лекарския dashboard.',
      },
    ],
  }
}

export function buildPublicDoctors(baseDoctors, doctorListings) {
  const publishedListingDoctors = doctorListings
    .filter(
      (listing) =>
        listing.status === 'published' && listing.available !== false,
    )
    .map(listingToPublicDoctor)

  return [...publishedListingDoctors, ...baseDoctors]
}
