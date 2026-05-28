import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  Award,
  Banknote,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Languages,
  MapPin,
  Phone,
  Star,
  Stethoscope,
  Video,
} from 'lucide-react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { doctors } from '../data/doctors'
import { formatEuroPrice } from '../utils/currency'

function InfoPill({ icon: Icon, children }) {
  return (
    <span className="inline-flex max-w-full min-w-0 items-center gap-2 rounded-[10px] bg-[#F0F5FC] px-3 py-2 text-[13px] font-bold text-[#0D2E8B]">
      <Icon className="h-4 w-4 text-[#13B5C8]" aria-hidden="true" />
      {children}
    </span>
  )
}

function SectionCard({ title, icon: Icon, children }) {
  return (
    <section className="rounded-[16px] border border-[#E1E8F3] bg-white p-5 shadow-[0_16px_35px_rgba(13,46,139,0.07)] md:p-6">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-[#13B5C8]" aria-hidden="true" />
        <h2 className="text-[20px] font-extrabold text-[#0D2E8B]">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function BookingPanel({
  doctor,
  currentUser,
  appointments = [],
  onBookAppointment,
}) {
  const schedule = useMemo(() => doctor.schedule || [], [doctor.schedule])
  const priceList = useMemo(() => doctor.priceList || [], [doctor.priceList])
  const firstAvailableDay = useMemo(
    () => schedule.find((day) => day.slots.length > 0),
    [schedule],
  )
  const [selectedDayId, setSelectedDayId] = useState(firstAvailableDay?.id || '')
  const [selectedSlotId, setSelectedSlotId] = useState(
    firstAvailableDay?.slots[0]?.id || '',
  )
  const [selectedServiceId, setSelectedServiceId] = useState(
    priceList[0]?.id || '',
  )
  const [bookingDetails, setBookingDetails] = useState({
    patientName: currentUser?.name || '',
    patientPhone: currentUser?.phone || '',
    reason: 'Първичен преглед',
    note: '',
  })

  const hasFreeSlots = Boolean(firstAvailableDay)
  const selectedDay =
    schedule.find((day) => day.id === selectedDayId) || firstAvailableDay
  const selectedSlot =
    selectedDay?.slots.find((slot) => slot.id === selectedSlotId) ||
    selectedDay?.slots[0]
  const selectedService =
    priceList.find((service) => service.id === selectedServiceId) || priceList[0]
  const isOnlineSelected = selectedService?.id === 'online'
  const isAlreadyBooked = appointments.some(
    (appointment) =>
      appointment.doctorId === doctor.id &&
      appointment.dayId === selectedDay?.id &&
      appointment.slotId === selectedSlot?.id,
  )

  const selectDay = (day) => {
    setSelectedDayId(day.id)
    setSelectedSlotId(day.slots[0]?.id || '')
  }

  const bookSelectedSlot = () => {
    if (!selectedDay || !selectedSlot || !selectedService) return

    onBookAppointment?.({
      doctor,
      day: selectedDay,
      slot: selectedSlot,
      service: selectedService,
      mode: isOnlineSelected ? 'online' : 'office',
      details: bookingDetails,
    })
  }

  const selectOnlineConsultation = () => {
    const onlineService = priceList.find((service) => service.id === 'online')
    if (onlineService) {
      setSelectedServiceId(onlineService.id)
    }
  }

  return (
    <aside className="rounded-[16px] border border-[#E1E8F3] bg-white p-5 shadow-[0_18px_40px_rgba(13,46,139,0.1)] lg:sticky lg:top-6">
      <h2 className="text-[20px] font-extrabold text-[#0D2E8B]">
        Запази час
      </h2>
      <p className="mt-1 text-[13px] font-semibold text-[#697894]">
        Избери ден, час и услуга
      </p>
      <div className="mt-4 rounded-[14px] bg-[#EAFBFD] p-4 text-[#0D2E8B]">
        <div className="flex items-center gap-2 text-[15px] font-extrabold">
          <CalendarDays className="h-5 w-5 text-[#13B5C8]" aria-hidden="true" />
          {selectedDay && selectedSlot
            ? `${selectedDay.label}, ${selectedSlot.time}`
            : doctor.nextSlot}
        </div>
        <p className="mt-2 text-[13px] font-bold text-[#087F91]">
          Цена: {selectedService ? formatEuroPrice(selectedService.price) : doctor.price}
        </p>
      </div>

      {hasFreeSlots ? (
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {schedule.map((day) => {
            const isSelected = selectedDay?.id === day.id
            const isDisabled = day.slots.length === 0

            return (
              <button
                key={day.id}
                type="button"
                className={`rounded-[10px] border px-3 py-3 text-left transition ${
                  isSelected
                    ? 'border-[#13B5C8] bg-[#EAFBFD] text-[#087F91]'
                    : 'border-[#DCE5F0] bg-white text-[#0D2E8B] hover:border-[#13B5C8] hover:bg-[#FAFCFF]'
                } ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={isDisabled}
                onClick={() => selectDay(day)}
              >
                <span className="block text-[13px] font-extrabold">
                  {day.label}
                </span>
                <span className="mt-0.5 block text-[11px] font-bold text-[#697894]">
                  {day.date}
                </span>
              </button>
            )
          })}
        </div>
      ) : null}

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {hasFreeSlots ? (
          selectedDay.slots.map((slot) => {
            const isSelected = selectedSlot?.id === slot.id

            return (
            <button
              key={slot.id}
              type="button"
              className={`h-10 rounded-[10px] border text-[13px] font-extrabold transition ${
                isSelected
                  ? 'border-[#13B5C8] bg-[#13B5C8] text-white'
                  : 'border-[#DCE5F0] bg-white text-[#0D2E8B] hover:border-[#13B5C8] hover:bg-[#EAFBFD]'
              }`}
              onClick={() => setSelectedSlotId(slot.id)}
            >
              {slot.time}
            </button>
            )
          })
        ) : (
          <p className="rounded-[10px] bg-[#F5F7FB] px-3 py-3 text-center text-[13px] font-bold text-[#697894] sm:col-span-2">
            Няма свободни часове в момента
          </p>
        )}
      </div>

      <div className="mt-5 border-t border-[#ECF1F7] pt-5">
        <h3 className="text-[13px] font-extrabold uppercase text-[#0D2E8B]">
          Ценоразпис
        </h3>
        <div className="mt-3 grid gap-2">
          {priceList.map((service) => {
            const isSelected = selectedService?.id === service.id

            return (
              <button
                key={service.id}
                type="button"
                className={`rounded-[12px] border px-3 py-3 text-left transition ${
                  isSelected
                    ? 'border-[#13B5C8] bg-[#EAFBFD]'
                    : 'border-[#DCE5F0] bg-white hover:border-[#13B5C8]'
                }`}
                onClick={() => setSelectedServiceId(service.id)}
              >
                <span className="flex items-start justify-between gap-3">
                  <span>
                    <span className="block text-[13px] font-extrabold text-[#0D2E8B]">
                      {service.title}
                    </span>
                    <span className="mt-1 block text-[11px] font-semibold text-[#697894]">
                      {service.description}
                    </span>
                  </span>
                  <span className="shrink-0 text-[13px] font-extrabold text-[#087F91]">
                    {formatEuroPrice(service.price)}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-5 border-t border-[#ECF1F7] pt-5">
        <h3 className="text-[13px] font-extrabold uppercase text-[#0D2E8B]">
          Данни за резервация
        </h3>
        <div className="mt-3 grid gap-2">
          <input
            className="h-10 rounded-[10px] border border-[#DCE5F0] px-3 text-[13px] font-semibold text-[#0D2E8B] outline-none focus:border-[#13B5C8]"
            placeholder="Име на пациент"
            value={bookingDetails.patientName}
            onChange={(event) =>
              setBookingDetails((currentDetails) => ({
                ...currentDetails,
                patientName: event.target.value,
              }))
            }
          />
          <input
            className="h-10 rounded-[10px] border border-[#DCE5F0] px-3 text-[13px] font-semibold text-[#0D2E8B] outline-none focus:border-[#13B5C8]"
            placeholder="Телефон за връзка"
            value={bookingDetails.patientPhone}
            onChange={(event) =>
              setBookingDetails((currentDetails) => ({
                ...currentDetails,
                patientPhone: event.target.value,
              }))
            }
          />
          <select
            className="h-10 rounded-[10px] border border-[#DCE5F0] px-3 text-[13px] font-semibold text-[#0D2E8B] outline-none focus:border-[#13B5C8]"
            value={bookingDetails.reason}
            onChange={(event) =>
              setBookingDetails((currentDetails) => ({
                ...currentDetails,
                reason: event.target.value,
              }))
            }
          >
            <option>Първичен преглед</option>
            <option>Контролен преглед</option>
            <option>Онлайн консултация</option>
            <option>Профилактика</option>
            <option>Второ мнение</option>
          </select>
          <textarea
            className="min-h-[78px] rounded-[10px] border border-[#DCE5F0] px-3 py-2 text-[13px] font-semibold text-[#0D2E8B] outline-none focus:border-[#13B5C8]"
            placeholder="Кратка бележка към лекаря"
            value={bookingDetails.note}
            onChange={(event) =>
              setBookingDetails((currentDetails) => ({
                ...currentDetails,
                note: event.target.value,
              }))
            }
          />
        </div>
      </div>

      <button
        type="button"
        className={`mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[12px] text-[15px] font-extrabold text-white shadow-[0_14px_28px_rgba(19,181,200,0.24)] transition ${
          hasFreeSlots &&
          selectedSlot &&
          bookingDetails.patientName.trim() &&
          bookingDetails.patientPhone.trim()
            ? 'bg-[#13B5C8] hover:bg-[#0D2E8B]'
            : 'cursor-not-allowed bg-[#9AA7C2]'
        }`}
        disabled={
          !hasFreeSlots ||
          !selectedSlot ||
          !bookingDetails.patientName.trim() ||
          !bookingDetails.patientPhone.trim()
        }
        onClick={bookSelectedSlot}
      >
        {isAlreadyBooked ? (
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        ) : (
          <CalendarDays className="h-5 w-5" aria-hidden="true" />
        )}
        {isAlreadyBooked ? 'Часът е запазен' : 'Запази час'}
      </button>

      {doctor.online ? (
        <button
          type="button"
          className={`mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[12px] border text-[15px] font-extrabold transition ${
            isOnlineSelected
              ? 'border-[#13B5C8] bg-[#EAFBFD] text-[#087F91]'
              : 'border-[#13B5C8] bg-white text-[#087F91] hover:bg-[#EAFBFD]'
          }`}
          onClick={selectOnlineConsultation}
        >
          <Video className="h-5 w-5" aria-hidden="true" />
          Онлайн консултация
        </button>
      ) : null}

      <div className="mt-6 border-t border-[#ECF1F7] pt-5">
        <h3 className="text-[13px] font-extrabold uppercase text-[#0D2E8B]">
          Кабинет
        </h3>
        <p className="mt-2 text-[14px] font-bold text-[#40517A]">
          {doctor.clinic}
        </p>
        <p className="mt-2 flex items-start gap-2 text-[13px] font-semibold text-[#697894]">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#13B5C8]" />
          {doctor.address}
        </p>
        <p className="mt-2 flex items-center gap-2 text-[13px] font-semibold text-[#697894]">
          <Phone className="h-4 w-4 shrink-0 text-[#13B5C8]" />
          {doctor.phone}
        </p>
      </div>
    </aside>
  )
}

export default function DoctorProfilePage({
  doctorId,
  doctorsList = doctors,
  likedCount = 0,
  currentUser,
  onLogout,
  appointments = [],
  onBookAppointment,
  onRecordView,
}) {
  const doctor = doctorsList.find((item) => String(item.id) === String(doctorId))

  useEffect(() => {
    if (doctor) onRecordView?.(doctor)
  }, [doctor, onRecordView])

  if (!doctor) {
    return (
      <main className="min-h-screen bg-[#F5F7FB] text-[#0D2E8B]">
        <Navbar
          activePage="doctors"
          compact
          likedCount={likedCount}
          currentUser={currentUser}
          onLogout={onLogout}
        />
        <section className="mx-auto max-w-[980px] px-5 py-10 sm:px-8">
          <a
            href="#/doctors"
            className="inline-flex items-center gap-2 text-[14px] font-bold text-[#087F91]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Назад към лекарите
          </a>
          <div className="mt-6 rounded-[16px] border border-[#E1E8F3] bg-white p-8 shadow-[0_16px_35px_rgba(13,46,139,0.07)]">
            <h1 className="text-[28px] font-extrabold">Лекарят не е намерен</h1>
            <p className="mt-3 text-[15px] font-semibold text-[#526383]">
              Проверете списъка с лекари и опитайте отново.
            </p>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F5F7FB] text-[#0D2E8B]">
      <Navbar
        activePage="doctors"
        compact
        likedCount={likedCount}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <section className="mx-auto max-w-[1240px] px-5 pb-10 pt-7 sm:px-8 xl:px-0">
        <a
          href="#/doctors"
          className="inline-flex items-center gap-2 text-[14px] font-bold text-[#087F91] transition hover:text-[#0D2E8B]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Назад към лекарите
        </a>

        <section className="mt-5 rounded-[18px] border border-[#E1E8F3] bg-white p-5 shadow-[0_18px_42px_rgba(13,46,139,0.09)] md:p-7">
          <div className="grid gap-6 md:grid-cols-[150px_minmax(0,1fr)_auto] md:items-center">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="h-[138px] w-[138px] rounded-full border-4 border-[#F5F7FB] object-cover shadow-[0_14px_28px_rgba(13,46,139,0.16)]"
            />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#EAFBFD] px-3 py-1 text-[12px] font-extrabold uppercase tracking-[0.02em] text-[#087F91]">
                  Потвърден профил
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-[12px] font-extrabold ${
                    doctor.online
                      ? 'bg-[#EAF8EF] text-[#188A4A]'
                      : 'bg-[#F2F5FA] text-[#697894]'
                  }`}
                >
                  {doctor.online ? 'Онлайн консултация' : 'Само в кабинет'}
                </span>
              </div>

              <h1 className="mt-3 text-[30px] font-extrabold leading-tight text-[#0D2E8B] md:text-[38px]">
                {doctor.name}
              </h1>
              <p className="mt-1 text-[19px] font-extrabold text-[#13B5C8]">
                {doctor.specialty}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <InfoPill icon={MapPin}>{doctor.city}</InfoPill>
                <InfoPill icon={Clock3}>{doctor.experience} години опит</InfoPill>
                <InfoPill icon={Languages}>
                  {doctor.languages.join(', ')}
                </InfoPill>
              </div>
            </div>

            <div className="rounded-[16px] bg-[#F5F7FB] p-4 text-left md:min-w-[170px] md:text-right">
              <div className="inline-flex items-center gap-1.5 text-[18px] font-extrabold text-[#0D2E8B]">
                <Star
                  className="h-5 w-5 fill-[#FFB000] text-[#FFB000]"
                  aria-hidden="true"
                />
                {doctor.rating}
              </div>
              <p className="mt-1 text-[13px] font-bold text-[#697894]">
                {doctor.reviews} оценки
              </p>
              <p className="mt-3 text-[13px] font-extrabold text-[#087F91]">
                {doctor.nextSlot}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="grid gap-7">
            <SectionCard title="За лекаря" icon={Stethoscope}>
              <p className="text-[15px] font-semibold leading-7 text-[#40517A]">
                {doctor.bio}
              </p>
            </SectionCard>

            <SectionCard title="Услуги" icon={CheckCircle2}>
              <div className="grid gap-3 sm:grid-cols-2">
                {doctor.services.map((service) => (
                  <div
                    key={service}
                    className="flex items-start gap-2 rounded-[12px] bg-[#FAFCFF] p-3 text-[14px] font-bold text-[#40517A]"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#13B5C8]"
                      aria-hidden="true"
                    />
                    {service}
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Ценоразпис" icon={Banknote}>
              <div className="grid gap-3">
                {doctor.priceList.map((service) => (
                  <div
                    key={service.id}
                    className="flex flex-col gap-2 rounded-[12px] bg-[#FAFCFF] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="text-[15px] font-extrabold text-[#0D2E8B]">
                        {service.title}
                      </h3>
                      <p className="mt-1 text-[13px] font-semibold text-[#697894]">
                        {service.description}
                      </p>
                    </div>
                    <span className="text-[17px] font-extrabold text-[#087F91]">
                      {formatEuroPrice(service.price)}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Образование и квалификация" icon={GraduationCap}>
              <div className="grid gap-3">
                {doctor.education.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-[14px] font-bold text-[#40517A]"
                  >
                    <Award className="h-4 w-4 shrink-0 text-[#13B5C8]" />
                    {item}
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Отзиви от пациенти" icon={Star}>
              <div className="grid gap-4">
                {doctor.patientReviews.map((review) => (
                  <article
                    key={review.author}
                    className="rounded-[14px] bg-[#FAFCFF] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-extrabold text-[#0D2E8B]">
                        {review.author}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[13px] font-extrabold text-[#0D2E8B]">
                        <Star
                          className="h-4 w-4 fill-[#FFB000] text-[#FFB000]"
                          aria-hidden="true"
                        />
                        5.0
                      </span>
                    </div>
                    <p className="mt-2 text-[14px] font-semibold leading-6 text-[#526383]">
                      {review.text}
                    </p>
                  </article>
                ))}
              </div>
            </SectionCard>
          </div>

          <BookingPanel
            doctor={doctor}
            currentUser={currentUser}
            appointments={appointments}
            onBookAppointment={onBookAppointment}
          />
        </div>
      </section>

      <Footer />
    </main>
  )
}
