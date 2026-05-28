import {
  Bell,
  Check,
  Clock3,
  Heart,
  Languages,
  MapPin,
  Star,
  Video,
} from 'lucide-react'

function fallbackAvatar(name) {
  const initials = name
    .split(' ')
    .filter((part) => part !== 'Д-р')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="60" fill="#EAFBFD"/>
      <circle cx="60" cy="46" r="24" fill="#13B5C8"/>
      <path d="M22 112c6-24 21-36 38-36s32 12 38 36" fill="#0D2E8B"/>
      <text x="60" y="53" text-anchor="middle" font-size="24" font-family="Arial" font-weight="700" fill="white">${initials}</text>
    </svg>`

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export default function DoctorCard({
  doctor,
  isLiked = false,
  isReminderSet = false,
  onToggleLike,
  onRemind,
}) {
  const hasAvailableSlots = doctor.status === 'available'

  return (
    <article className="doctor-card modern-card-motion group relative grid select-none gap-4 rounded-[16px] border border-[#E1E8F3] bg-white p-4 shadow-[0_16px_36px_rgba(13,46,139,0.09)] sm:grid-cols-[88px_minmax(0,1fr)]">
      <button
        type="button"
        className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border bg-white shadow-[0_10px_22px_rgba(13,46,139,0.08)] transition hover:-translate-y-0.5 ${
          isLiked
            ? 'border-[#13B5C8] text-[#13B5C8]'
            : 'border-[#DCE5F0] text-[#697894] hover:border-[#13B5C8] hover:text-[#13B5C8]'
        }`}
        aria-label={isLiked ? 'Премахни от харесани' : 'Харесай лекаря'}
        aria-pressed={isLiked}
        onClick={() => onToggleLike?.(doctor)}
      >
        <Heart
          className={`h-5 w-5 ${isLiked ? 'fill-[#13B5C8]' : ''}`}
          aria-hidden="true"
        />
      </button>

      <img
        src={doctor.image}
        alt={doctor.name}
        className="h-[88px] w-[88px] rounded-full border-4 border-[#F5F7FB] object-cover shadow-[0_10px_22px_rgba(13,46,139,0.13)]"
        loading="lazy"
        draggable="false"
        onError={(event) => {
          event.currentTarget.src = fallbackAvatar(doctor.name)
        }}
      />

      <div className="min-w-0 pr-10 sm:pr-0">
        <h3 className="text-[17px] font-extrabold leading-tight text-[#0D2E8B]">
          {doctor.name}
        </h3>
        <p className="mt-1 text-[14px] font-bold text-[#13B5C8]">
          {doctor.specialty}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#EAFBFD] px-2.5 py-1 text-[10px] font-extrabold uppercase text-[#087F91]">
            Проверен
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase ${
              hasAvailableSlots
                ? 'bg-[#EAF8EF] text-[#16884A]'
                : 'bg-[#FFF5E6] text-[#A15C00]'
            }`}
          >
            {hasAvailableSlots ? 'Свободни часове' : 'Зает график'}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[12px] font-semibold text-[#526383]">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#0D2E8B]" aria-hidden="true" />
            {doctor.city}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 text-[#0D2E8B]" aria-hidden="true" />
            {doctor.experience} години опит
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-[7px] bg-[#F0F5FC] px-2.5 py-1 text-[11px] font-bold text-[#0D2E8B]">
            <Languages className="h-3 w-3" aria-hidden="true" />
            Езици
          </span>
          {doctor.languages.map((language) => (
            <span
              key={language}
              className="rounded-[7px] bg-[#EEF8FA] px-2.5 py-1 text-[11px] font-bold text-[#406078]"
            >
              {language}
            </span>
          ))}
        </div>
      </div>

      <div className="doctor-card__aside flex flex-col items-stretch gap-3 sm:col-start-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-2 text-left sm:text-right">
          <span className="inline-flex items-center justify-start gap-1.5 text-[13px] font-extrabold text-[#0D2E8B] sm:justify-end">
            <Star
              className="h-4 w-4 fill-[#FFB000] text-[#FFB000]"
              aria-hidden="true"
            />
            {doctor.rating}
            <span className="font-bold text-[#697894]">({doctor.reviews})</span>
          </span>
          <span
            className={`inline-flex items-center justify-start gap-1.5 text-[11px] font-bold sm:justify-end ${
              doctor.online ? 'text-[#188A4A]' : 'text-[#8490A8]'
            }`}
          >
            <Video className="h-3.5 w-3.5" aria-hidden="true" />
            {doctor.online ? 'Онлайн консултация' : 'Само в кабинет'}
          </span>
        </div>

        <div className="grid gap-2 sm:flex sm:flex-wrap sm:justify-end">
          <button
            type="button"
            className={`inline-flex h-10 w-full min-w-0 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] border px-4 text-[12px] font-extrabold transition sm:w-auto sm:min-w-[132px] ${
              isReminderSet
                ? 'border-[#13B5C8] bg-[#EAFBFD] text-[#087F91]'
                : 'border-[#DCE5F0] bg-white text-[#0D2E8B] hover:border-[#13B5C8] hover:text-[#087F91]'
            }`}
            onClick={() => onRemind?.(doctor)}
          >
            {isReminderSet ? (
              <Check className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Bell className="h-4 w-4" aria-hidden="true" />
            )}
            {isReminderSet ? 'Напомнено' : 'Напомни ми'}
          </button>

          <a
            href={`#/doctors/${doctor.id}`}
            className="inline-flex h-11 w-full min-w-0 shrink-0 items-center justify-center whitespace-nowrap rounded-[10px] bg-[#0D91A5] px-5 text-[13px] font-extrabold text-white shadow-[0_12px_22px_rgba(19,181,200,0.2)] transition hover:bg-[#0D2E8B] sm:w-auto sm:min-w-[132px]"
          >
            Виж профил
          </a>
        </div>
      </div>
    </article>
  )
}
