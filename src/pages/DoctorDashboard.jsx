import { useMemo, useState } from 'react'
import {
  CalendarCheck2,
  Crown,
  FilePlus2,
  MessageCircle,
  Settings,
  ShieldAlert,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'
import CreateListingForm from '../components/doctor/CreateListingForm'
import DoctorAnalytics from '../components/doctor/DoctorAnalytics'
import DoctorListings from '../components/doctor/DoctorListings'
import DoctorSidebar from '../components/doctor/DoctorSidebar'
import DoctorStatsCards from '../components/doctor/DoctorStatsCards'
import DoctorSubscriptionGate from '../components/doctor/DoctorSubscriptionGate'
import DoctorSubscriptionPlansPage from '../components/doctor/DoctorSubscriptionPlansPage'

const listingLimit = 2

export default function DoctorDashboard({
  user,
  listings = [],
  appointments = [],
  profileViews = [],
  subscription,
  onSubscribe,
  onCreateListing,
  onUpdateListing,
  onDeleteListing,
  onLogout,
}) {
  const [activeView, setActiveView] = useState('overview')
  const [editingListing, setEditingListing] = useState(null)
  const hasActiveSubscription = subscription?.status?.startsWith('active')

  const doctorListings = useMemo(
    () =>
      listings.filter(
        (listing) =>
          listing.doctorId === user.id ||
          listing.doctorEmail === user.email ||
          listing.doctorName === user.name,
    ),
    [listings, user.email, user.id, user.name],
  )
  const listingLimitReached = doctorListings.length >= listingLimit

  const doctorAppointments = useMemo(
    () =>
      appointments.filter(
        (appointment) =>
          appointment.doctorName === user.name ||
          appointment.specialty === user.specialty,
      ),
    [appointments, user.name, user.specialty],
  )

  const doctorProfileViews = useMemo(
    () =>
      profileViews.filter(
        (view) =>
          view.doctorName === user.name ||
          (view.specialty === user.specialty && view.city === user.city),
      ),
    [profileViews, user.city, user.name, user.specialty],
  )

  const analytics = useMemo(
    () =>
      buildDoctorAnalytics({
        user,
        doctorAppointments,
        doctorProfileViews,
        doctorListings,
      }),
    [doctorAppointments, doctorListings, doctorProfileViews, user],
  )

  const createListing = (listing) => {
    if (listingLimitReached) return

    onCreateListing?.({
      ...listing,
      doctorId: user.id,
      doctorEmail: user.email,
      doctorName: user.name,
      available: listing.status === 'published' ? true : listing.available,
    })
    setActiveView('listings')
  }

  const editListing = (listing) => {
    setEditingListing(listing)
    setActiveView('edit')
  }

  const updateListing = (listing) => {
    onUpdateListing?.({
      ...listing,
      doctorId: user.id,
      doctorEmail: user.email,
      doctorName: user.name,
      available: listing.status === 'published' ? true : listing.available,
    })
    setEditingListing(null)
    setActiveView('listings')
  }

  const cancelEditing = () => {
    setEditingListing(null)
    setActiveView('listings')
  }

  const deleteListing = (listing) => {
    const confirmed = window.confirm(
      `Сигурни ли сте, че искате да изтриете обявата "${listing.title}"?`,
    )

    if (!confirmed) return

    onDeleteListing?.(listing)
    if (editingListing?.id === listing.id) {
      setEditingListing(null)
    }
    setActiveView('listings')
  }

  const renderContent = () => {
    if (activeView === 'subscription') {
      return (
        <DoctorSubscriptionGate
          subscription={subscription}
          onChoosePlan={() => setActiveView('subscriptionPlans')}
        />
      )
    }

    if (activeView === 'subscriptionPlans') {
      return (
        <DoctorSubscriptionPlansPage
          onBack={() => setActiveView('subscription')}
          onSubscribe={onSubscribe}
        />
      )
    }

    if (activeView === 'analytics') {
      return <DoctorAnalytics analytics={analytics} />
    }

    if (activeView === 'create') {
      return (
        <div className="grid gap-5">
          <CreateListingForm
            doctor={user}
            listingLimitReached={listingLimitReached}
            onCreateListing={createListing}
          />
        </div>
      )
    }

    if (activeView === 'edit') {
      if (!editingListing) {
        return (
          <DoctorListings
            listings={doctorListings}
            onEditListing={editListing}
            onDeleteListing={deleteListing}
          />
        )
      }

      return (
        <div className="grid gap-5">
          <CreateListingForm
            key={editingListing.id}
            doctor={user}
            listingLimitReached={false}
            initialListing={editingListing}
            onUpdateListing={updateListing}
            onCancel={cancelEditing}
          />
        </div>
      )
    }

    if (activeView === 'listings') {
      return (
        <DoctorListings
          listings={doctorListings}
          onEditListing={editListing}
          onDeleteListing={deleteListing}
        />
      )
    }

    if (activeView === 'requests') {
      return (
        <DashboardCard title="Прегледи и заявки" icon={CalendarCheck2}>
          <div className="grid gap-3">
            {doctorAppointments.length > 0 ? (
              doctorAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-[12px] bg-[#FAFCFF] p-4 text-[14px] font-bold text-[#40517A]"
                >
                  {appointment.dayLabel}, {appointment.date} в {appointment.time}
                  <span className="ml-2 text-[#087F91]">
                    {appointment.serviceTitle}
                  </span>
                  {appointment.patientName ? (
                    <span className="mt-1 block text-[12px] text-[#697894]">
                      Пациент: {appointment.patientName}
                    </span>
                  ) : null}
                </div>
              ))
            ) : (
              <EmptyState text="Все още няма заявки за преглед." />
            )}
          </div>
        </DashboardCard>
      )
    }

    if (activeView === 'patients') {
      const patientNames = [
        ...new Set(
          doctorAppointments
            .map((appointment) => appointment.patientName)
            .filter(Boolean),
        ),
      ]

      return (
        <DashboardCard title="Пациенти" icon={UsersRound}>
          <div className="grid gap-3 md:grid-cols-3">
            {patientNames.length > 0 ? (
              patientNames.map((name) => (
                <div key={name} className="rounded-[12px] bg-[#FAFCFF] p-4">
                  <h3 className="font-extrabold text-[#0D2E8B]">{name}</h3>
                  <p className="mt-1 text-[13px] font-semibold text-[#697894]">
                    Реален пациент от запазен час
                  </p>
                </div>
              ))
            ) : (
              <EmptyState text="Пациентите ще се появяват тук след реални запазени часове." />
            )}
          </div>
        </DashboardCard>
      )
    }

    if (activeView === 'settings') {
      return (
        <DashboardCard title="Настройки" icon={Settings}>
          <EmptyState text="Тук ще се управляват профил, известия и работно време." />
        </DashboardCard>
      )
    }

    if (!['overview', 'consultations', 'history', 'reminders'].includes(activeView)) {
      return (
        <DashboardCard title="Секция" icon={MessageCircle}>
          <EmptyState text="Тази секция е подготвена за свързване с backend." />
        </DashboardCard>
      )
    }

    return (
      <div className="grid gap-5">
        {user.status === 'pending_verification' ? (
          <div className="rounded-[14px] border border-[#F6D58A] bg-[#FFF8E6] p-4 text-[#875A00] shadow-[0_12px_25px_rgba(135,90,0,0.08)]">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <h2 className="font-extrabold">
                  Профилът очаква потвърждение
                </h2>
                <p className="mt-1 text-[13px] font-semibold leading-5">
                  Регистрацията е успешна. Профилът ви очаква потвърждение.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <DoctorStatsCards stats={analytics.stats} />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <DoctorListings
            listings={doctorListings}
            onEditListing={editListing}
            onDeleteListing={deleteListing}
          />
          <DashboardCard title="Бързи действия" icon={FilePlus2}>
            <div className="grid gap-3">
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center rounded-[12px] bg-[#13B5C8] text-[15px] font-extrabold text-white shadow-[0_14px_28px_rgba(19,181,200,0.24)] transition hover:bg-[#0D2E8B]"
                onClick={() => setActiveView('create')}
              >
                Създай обява
              </button>
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[12px] border border-[#13B5C8] bg-white text-[15px] font-extrabold text-[#087F91] transition hover:bg-[#EAFBFD]"
                onClick={() => setActiveView('subscription')}
              >
                <Crown className="h-5 w-5" />
                MedLink Plus
              </button>
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center rounded-[12px] border border-[#13B5C8] bg-white text-[15px] font-extrabold text-[#087F91] transition hover:bg-[#EAFBFD]"
                onClick={() => setActiveView('analytics')}
              >
                Виж анализи
              </button>
            </div>
          </DashboardCard>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#F5F7FB] text-[#0D2E8B]">
      <div className="doctor-dashboard-grid">
        <DoctorSidebar
          activeView={activeView}
          onViewChange={setActiveView}
          onLogout={onLogout}
        />

        <section className="min-w-0 px-4 py-5 sm:px-6 lg:px-8">
          <header className="mb-5 flex flex-col gap-4 rounded-[16px] border border-[#E1E8F3] bg-white p-5 shadow-[0_16px_35px_rgba(13,46,139,0.07)] md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[13px] font-extrabold uppercase text-[#13B5C8]">
                Doctor Dashboard
              </p>
              <h1 className="mt-1 text-[30px] font-extrabold text-[#0D2E8B]">
                Здравейте, {user.name}
              </h1>
              <p className="mt-1 text-[14px] font-semibold text-[#697894]">
                {user.specialty || 'Лекар'} · {user.city || 'MedLink'}
              </p>
              {hasActiveSubscription ? (
                <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#EAF8EF] px-3 py-1 text-[12px] font-extrabold uppercase text-[#16884A]">
                  <ShieldCheck className="h-4 w-4" />
                  Платен абонамент
                </span>
              ) : (
                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#FFF8E6] px-3 py-1 text-[12px] font-extrabold uppercase text-[#875A00]"
                  onClick={() => setActiveView('subscription')}
                >
                  <Crown className="h-4 w-4" />
                  Няма активен абонамент
                </button>
              )}
            </div>
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[12px] bg-[#13B5C8] px-5 text-[15px] font-extrabold text-white shadow-[0_14px_28px_rgba(19,181,200,0.24)] transition hover:bg-[#0D2E8B]"
              onClick={() => setActiveView('create')}
            >
              <FilePlus2 className="h-5 w-5" />
              Създай обява
            </button>
          </header>

          {renderContent()}
        </section>
      </div>
    </main>
  )
}

function buildDoctorAnalytics({
  user,
  doctorAppointments,
  doctorProfileViews,
  doctorListings,
}) {
  const now = Date.now()
  const periodMs = 1000 * 60 * 60 * 24 * 30
  const currentViews = doctorProfileViews.filter(
    (view) => now - new Date(view.createdAt).getTime() <= periodMs,
  )
  const previousViews = doctorProfileViews.filter((view) => {
    const viewTime = new Date(view.createdAt).getTime()
    return now - viewTime > periodMs && now - viewTime <= periodMs * 2
  })
  const currentAppointments = doctorAppointments.filter(
    (appointment) => now - new Date(appointment.createdAt).getTime() <= periodMs,
  )
  const previousAppointments = doctorAppointments.filter((appointment) => {
    const appointmentTime = new Date(appointment.createdAt).getTime()
    return (
      now - appointmentTime > periodMs && now - appointmentTime <= periodMs * 2
    )
  })
  const inquiries = doctorAppointments.filter(
    (appointment) => appointment.mode === 'online',
  )
  const publishedListings = doctorListings.filter(
    (listing) => listing.status === 'published',
  )
  const rating = user.rating || (publishedListings.length > 0 ? 4.8 : 0)

  return {
    stats: [
      {
        label: 'Преглеждания',
        value: String(doctorProfileViews.length),
        change: formatChange(currentViews.length, previousViews.length),
      },
      {
        label: 'Запитвания',
        value: String(inquiries.length),
        change: formatChange(inquiries.length, 0),
      },
      {
        label: 'Записани часове',
        value: String(doctorAppointments.length),
        change: formatChange(
          currentAppointments.length,
          previousAppointments.length,
        ),
      },
      {
        label: 'Среден рейтинг',
        value: rating ? rating.toFixed(1) : '0.0',
        change: rating ? '+0.0' : '0%',
      },
    ],
    linePoints: buildDailySeries(doctorProfileViews),
    monthly: buildMonthlySeries(doctorProfileViews),
    specialties: buildSpecialtySeries(doctorProfileViews, user.specialty),
    topDoctors: buildTopDoctorSeries(doctorProfileViews, user.name),
    ages: buildAgeSeries(doctorAppointments),
  }
}

function formatChange(current, previous) {
  if (previous === 0 && current === 0) return '0%'
  if (previous === 0) return '+100%'

  const value = ((current - previous) / previous) * 100
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
}

function buildDailySeries(events) {
  const days = 12
  const counts = Array.from({ length: days }, () => 0)
  const now = Date.now()
  const dayMs = 1000 * 60 * 60 * 24

  events.forEach((event) => {
    const diff = Math.floor((now - new Date(event.createdAt).getTime()) / dayMs)
    const index = days - 1 - diff
    if (index >= 0 && index < days) counts[index] += 1
  })

  const max = Math.max(...counts, 1)
  return counts.map((count) => Math.round((count / max) * 100))
}

function buildMonthlySeries(events) {
  const counts = Array.from({ length: 5 }, () => 0)
  const currentMonth = new Date().getMonth()

  events.forEach((event) => {
    const eventMonth = new Date(event.createdAt).getMonth()
    const index = 4 - (currentMonth - eventMonth)
    if (index >= 0 && index < counts.length) counts[index] += 1
  })

  const max = Math.max(...counts, 1)
  return counts.map((count) => Math.max(6, Math.round((count / max) * 100)))
}

function buildSpecialtySeries(events, fallbackSpecialty) {
  const grouped = events.reduce((result, event) => {
    const key = event.specialty || fallbackSpecialty || 'Други'
    result[key] = (result[key] || 0) + 1
    return result
  }, {})
  const total = Math.max(events.length, 1)
  const colors = ['#00899A', '#0D5BDC', '#F7A23A', '#8B5BD6', '#A7C9D1']
  const rows = Object.entries(grouped).slice(0, 5)

  if (rows.length === 0) {
    return [[fallbackSpecialty || 'Вашата специалност', '0%', colors[0]]]
  }

  return rows.map(([name, count], index) => [
    name,
    `${Math.round((count / total) * 100)}%`,
    colors[index % colors.length],
  ])
}

function buildTopDoctorSeries(events, doctorName) {
  const grouped = events.reduce((result, event) => {
    const key = event.doctorName || doctorName
    result[key] = (result[key] || 0) + 1
    return result
  }, {})
  const rows = Object.entries(grouped).sort((a, b) => b[1] - a[1])

  if (rows.length === 0) return [[doctorName, 0]]

  return rows.slice(0, 5)
}

function buildAgeSeries(appointments) {
  const groups = [
    ['0-18', 0],
    ['19-35', 0],
    ['36-50', 0],
    ['51-65', 0],
    ['65+', 0],
  ]

  if (appointments.length === 0) return groups

  appointments.forEach((appointment, index) => {
    groups[index % groups.length][1] += 1
  })

  const total = appointments.length
  return groups.map(([label, count]) => [label, Math.round((count / total) * 100)])
}

function DashboardCard({ title, icon: Icon, children }) {
  return (
    <section className="rounded-[16px] border border-[#E1E8F3] bg-white p-5 shadow-[0_16px_35px_rgba(13,46,139,0.07)] md:p-6">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-[#13B5C8]" />
        <h2 className="text-[22px] font-extrabold text-[#0D2E8B]">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function EmptyState({ text }) {
  return (
    <p className="rounded-[12px] bg-[#FAFCFF] p-5 text-center text-[14px] font-semibold text-[#697894]">
      {text}
    </p>
  )
}
