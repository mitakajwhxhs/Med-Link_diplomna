import { useEffect, useMemo, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import DoctorCard from '../components/DoctorCard'
import FilterSidebar from '../components/FilterSidebar'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Pagination from '../components/Pagination'
import SearchBar from '../components/SearchBar'
import { DoctorCardSkeleton } from '../components/Skeleton'
import { doctors } from '../data/doctors'

const doctorsPerPage = 3
const allCitiesLabel = 'Всички градове'

const defaultFilters = {
  query: '',
  city: allCitiesLabel,
  specialties: [],
  specialtySearch: '',
  minExperience: '',
  maxExperience: '',
  minRating: '',
  language: '',
  onlineOnly: false,
  availableOnly: false,
  sortBy: 'Релевантност',
}

const specialtyLabelByValue = {
  Кардиолог: 'Кардиология',
  Дерматолог: 'Дерматология',
  Невролог: 'Неврология',
  Ендокринолог: 'Ендокринология',
  Ортопед: 'Ортопедия',
  Педиатър: 'Педиатрия',
  Гастроентеролог: 'Гастроентерология',
  Офталмолог: 'Офталмология',
  Уролог: 'Урология',
  'Акушер-гинеколог': 'Акушерство и гинекология',
  Психиатър: 'Психиатрия',
  Ревматолог: 'Ревматология',
  Пулмолог: 'Пулмология',
  Нефролог: 'Нефрология',
  Хирург: 'Хирургия',
}

function normalize(value) {
  return String(value || '')
    .trim()
    .toLocaleLowerCase('bg-BG')
}

function uniqueSorted(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, 'bg-BG'))
}

function numberFilterValue(value) {
  if (value === '' || value === null || value === undefined) return null

  const parsedValue = Number(value)
  return Number.isNaN(parsedValue) ? null : parsedValue
}

export default function DoctorsPage({
  likedDoctorIds = [],
  reminderDoctorIds = [],
  onToggleLike,
  onRemind,
  likedCount = 0,
  currentUser,
  onLogout,
  doctorsList = doctors,
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState(defaultFilters)
  const [loadingUntil, setLoadingUntil] = useState(() => Date.now() + 360)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const delay = Math.max(0, loadingUntil - Date.now())
    const timeoutId = window.setTimeout(() => setNow(Date.now()), delay)

    return () => window.clearTimeout(timeoutId)
  }, [loadingUntil])

  const isLoading = now < loadingUntil

  const startLoading = () => {
    setNow(Date.now())
    setLoadingUntil(Date.now() + 360)
  }

  const specialtyOptions = useMemo(
    () =>
      uniqueSorted(doctorsList.map((doctor) => doctor.specialty)).map((value) => ({
        value,
        label: specialtyLabelByValue[value] || value,
      })),
    [doctorsList],
  )

  const cityOptions = useMemo(
    () => [allCitiesLabel, ...uniqueSorted(doctorsList.map((doctor) => doctor.city))],
    [doctorsList],
  )

  const languageOptions = useMemo(
    () =>
      uniqueSorted(doctorsList.flatMap((doctor) => doctor.languages)).filter(
        Boolean,
      ),
    [doctorsList],
  )

  const updateFilters = (updates) => {
    startLoading()
    setFilters((currentFilters) => ({ ...currentFilters, ...updates }))
    setCurrentPage(1)
  }

  const toggleSpecialty = (specialty) => {
    startLoading()
    setFilters((currentFilters) => {
      const currentSpecialties = currentFilters.specialties || []
      const nextSpecialties = currentSpecialties.includes(specialty)
        ? currentSpecialties.filter((item) => item !== specialty)
        : [...currentSpecialties, specialty]

      return { ...currentFilters, specialties: nextSpecialties }
    })
    setCurrentPage(1)
  }

  const clearFilters = () => {
    startLoading()
    setFilters(defaultFilters)
    setCurrentPage(1)
  }

  const filteredDoctors = useMemo(() => {
    const query = normalize(filters.query)
    const minExperience = numberFilterValue(filters.minExperience)
    const maxExperience = numberFilterValue(filters.maxExperience)
    const minRating = numberFilterValue(filters.minRating)
    const selectedSpecialties = filters.specialties || []
    const selectedCity = filters.city || allCitiesLabel

    const results = doctorsList.filter((doctor) => {
      if (query) {
        const searchableContent = [
          doctor.name,
          doctor.specialty,
          specialtyLabelByValue[doctor.specialty],
          doctor.city,
          doctor.clinic,
          doctor.languages.join(' '),
          doctor.services.join(' '),
        ]
          .map(normalize)
          .join(' ')

        if (!searchableContent.includes(query)) return false
      }

      if (
        selectedCity !== allCitiesLabel &&
        normalize(doctor.city) !== normalize(selectedCity)
      ) {
        return false
      }

      if (
        selectedSpecialties.length > 0 &&
        !selectedSpecialties.includes(doctor.specialty)
      ) {
        return false
      }

      if (minExperience !== null && doctor.experience < minExperience) {
        return false
      }

      if (maxExperience !== null && doctor.experience > maxExperience) {
        return false
      }

      if (minRating !== null && doctor.rating < minRating) {
        return false
      }

      if (filters.language && !doctor.languages.includes(filters.language)) {
        return false
      }

      if (filters.onlineOnly && !doctor.online) {
        return false
      }

      if (filters.availableOnly && doctor.availability.length === 0) {
        return false
      }

      return true
    })

    return results.sort((firstDoctor, secondDoctor) => {
      if (filters.sortBy === 'Рейтинг') {
        return (
          secondDoctor.rating - firstDoctor.rating ||
          secondDoctor.reviews - firstDoctor.reviews
        )
      }

      if (filters.sortBy === 'Име') {
        return firstDoctor.name.localeCompare(secondDoctor.name, 'bg-BG')
      }

      if (filters.sortBy === 'Опит') {
        return (
          secondDoctor.experience - firstDoctor.experience ||
          secondDoctor.rating - firstDoctor.rating
        )
      }

      return 0
    })
  }, [doctorsList, filters])

  const totalPages = Math.max(1, Math.ceil(filteredDoctors.length / doctorsPerPage))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const visibleDoctors = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * doctorsPerPage
    return filteredDoctors.slice(startIndex, startIndex + doctorsPerPage)
  }, [filteredDoctors, safeCurrentPage])

  const handlePageChange = (page) => {
    startLoading()
    setCurrentPage(page)
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
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
        <h1 className="text-[32px] font-extrabold leading-tight text-[#0D2E8B] md:text-[40px]">
          Търси лекари
        </h1>

        <SearchBar
          filters={filters}
          cityOptions={cityOptions}
          specialtyOptions={specialtyOptions}
          onFilterChange={updateFilters}
          onToggleSpecialty={toggleSpecialty}
        />

        <div className="doctor-results-layout mt-8 grid gap-7">
          <FilterSidebar
            filters={filters}
            specialtyOptions={specialtyOptions}
            languageOptions={languageOptions}
            onFilterChange={updateFilters}
            onToggleSpecialty={toggleSpecialty}
            onClearFilters={clearFilters}
          />

          <section id="doctor-results" aria-label="Резултати от търсене">
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[18px] font-bold text-[#40517A]">
                Намерени{' '}
                <span className="text-[#0D2E8B]">{filteredDoctors.length}</span>{' '}
                лекари
              </p>

              <label className="flex flex-col items-start gap-2 text-[14px] font-bold text-[#697894] sm:flex-row sm:items-center">
                Сортирай по:
                <span className="relative w-full sm:w-auto">
                  <select
                    className="h-12 w-full appearance-none rounded-[14px] border border-[#DCE5F0] bg-white pl-4 pr-10 text-[14px] font-bold text-[#0D2E8B] outline-none focus:border-[#13B5C8] sm:w-auto"
                    value={filters.sortBy}
                    onChange={(event) =>
                      updateFilters({ sortBy: event.target.value })
                    }
                  >
                    <option>Релевантност</option>
                    <option>Рейтинг</option>
                    <option>Име</option>
                    <option>Опит</option>
                  </select>
                  <SlidersHorizontal
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#13B5C8]"
                    aria-hidden="true"
                  />
                </span>
              </label>
            </div>

            {isLoading ? (
              <div className="grid gap-5">
                {Array.from({ length: doctorsPerPage }, (_, index) => (
                  <DoctorCardSkeleton key={index} />
                ))}
              </div>
            ) : visibleDoctors.length > 0 ? (
              <>
                <div className="grid gap-5">
                  {visibleDoctors.map((doctor) => (
                    <DoctorCard
                      key={doctor.id}
                      doctor={doctor}
                      isLiked={likedDoctorIds.includes(doctor.id)}
                      isReminderSet={reminderDoctorIds.includes(doctor.id)}
                      onToggleLike={onToggleLike}
                      onRemind={onRemind}
                    />
                  ))}
                </div>

                <Pagination
                  currentPage={safeCurrentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <section className="rounded-[16px] border border-[#E1E8F3] bg-white p-7 text-center shadow-[0_16px_35px_rgba(13,46,139,0.07)]">
                <h2 className="text-[22px] font-extrabold text-[#0D2E8B]">
                  Няма намерени лекари
                </h2>
                <p className="mx-auto mt-2 max-w-[520px] text-[14px] font-semibold leading-6 text-[#526383]">
                  Променете търсенето или изчистете филтрите, за да видите
                  повече резултати.
                </p>
                <button
                  type="button"
                  className="mt-5 inline-flex h-11 items-center justify-center rounded-[11px] bg-[#13B5C8] px-5 text-[13px] font-extrabold text-white shadow-[0_12px_22px_rgba(19,181,200,0.22)] transition hover:bg-[#0D2E8B]"
                  onClick={clearFilters}
                >
                  Изчисти филтрите
                </button>
              </section>
            )}
          </section>
        </div>
      </section>

      <Footer />
    </main>
  )
}
