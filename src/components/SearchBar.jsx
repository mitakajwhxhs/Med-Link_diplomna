import { useState } from 'react'
import {
  Building2,
  Check,
  ChevronDown,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  Stethoscope,
  Video,
} from 'lucide-react'

const allCitiesLabel = 'Всички градове'

function SelectShell({ icon: Icon, label, children }) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <Icon
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0D2E8B]"
        aria-hidden="true"
      />
      {children}
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0D2E8B]"
        aria-hidden="true"
      />
    </label>
  )
}

function FilterButton({ icon: Icon, active = false, open = false, children, onClick }) {
  return (
    <button
      type="button"
      className={`quick-filter-trigger inline-flex h-11 w-full min-w-0 items-center justify-center gap-1.5 rounded-[10px] border px-3 text-[12px] font-bold shadow-[0_8px_20px_rgba(13,46,139,0.04)] transition hover:border-[#13B5C8] hover:text-[#087F91] ${
        active || open
          ? 'border-[#13B5C8] bg-[#EAFBFD] text-[#087F91]'
          : 'border-[#DCE5F0] bg-white text-[#0D2E8B]'
      }`}
      aria-expanded={open}
      aria-pressed={active}
      onClick={onClick}
    >
      <Icon className="h-4 w-4 shrink-0 text-[#13B5C8]" aria-hidden="true" />
      <span className="truncate">{children}</span>
      <ChevronDown
        className={`h-3.5 w-3.5 shrink-0 transition ${open ? 'rotate-180' : ''}`}
        aria-hidden="true"
      />
    </button>
  )
}

function DropdownMenu({ open, children }) {
  if (!open) return null

  return (
    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-[14px] border border-[#DCE5F0] bg-white shadow-[0_18px_42px_rgba(13,46,139,0.14)]">
      <div className="max-h-[270px] overflow-auto p-2">{children}</div>
    </div>
  )
}

function MenuOption({ active = false, children, onClick }) {
  return (
    <button
      type="button"
      className={`flex w-full items-center justify-between gap-3 rounded-[10px] px-3 py-2.5 text-left text-[12px] font-bold transition hover:bg-[#EAFBFD] hover:text-[#087F91] ${
        active ? 'bg-[#EAFBFD] text-[#087F91]' : 'text-[#0D2E8B]'
      }`}
      onClick={onClick}
    >
      <span className="min-w-0 truncate">{children}</span>
      {active ? <Check className="h-4 w-4 shrink-0 text-[#13B5C8]" /> : null}
    </button>
  )
}

export default function SearchBar({
  filters = {},
  cityOptions = [allCitiesLabel],
  specialtyOptions = [],
  onFilterChange,
  onToggleSpecialty,
}) {
  const [openMenu, setOpenMenu] = useState(null)
  const minRating = filters.minRating || ''
  const city = filters.city || allCitiesLabel
  const selectedSpecialties = filters.specialties || []

  const selectedSpecialtyLabels = specialtyOptions
    .filter((specialty) => selectedSpecialties.includes(specialty.value))
    .map((specialty) => specialty.label)

  const specialtyLabel =
    selectedSpecialtyLabels.length === 0
      ? 'Всички специалности'
      : selectedSpecialtyLabels.length === 1
        ? selectedSpecialtyLabels[0]
        : `${selectedSpecialtyLabels.length} специалности`
  const cityLabel = city === allCitiesLabel ? 'Всички области' : city
  const ratingLabel = minRating ? `Оценка ${minRating}+` : 'Минимална оценка'

  const updateFilters = (updates) => {
    onFilterChange?.(updates)
  }

  const toggleMenu = (menu) => {
    setOpenMenu((currentMenu) => (currentMenu === menu ? null : menu))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    document
      .getElementById('doctor-results')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const scrollToFilters = () => {
    setOpenMenu(null)
    document
      .getElementById('filters-panel')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="mt-4" aria-label="Търсачка и бързи филтри">
      <form
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_170px_auto]"
        onSubmit={handleSubmit}
      >
        <label className="relative block">
          <span className="sr-only">Търси лекар</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0D2E8B]"
            aria-hidden="true"
          />
          <input
            className="h-14 w-full rounded-[12px] border border-[#DCE5F0] bg-white pl-12 pr-4 text-[14px] font-semibold text-[#0D2E8B] shadow-[0_12px_28px_rgba(13,46,139,0.05)] outline-none transition placeholder:text-[#7D8AAC] focus:border-[#13B5C8] focus:ring-4 focus:ring-[#13B5C8]/15"
            placeholder="Търси по име, специалност или ключова дума..."
            type="search"
            value={filters.query || ''}
            onChange={(event) => updateFilters({ query: event.target.value })}
          />
        </label>

        <SelectShell icon={MapPin} label="Град">
          <select
            className="h-14 w-full appearance-none rounded-[12px] border border-[#DCE5F0] bg-white py-0 pl-10 pr-9 text-[14px] font-bold text-[#0D2E8B] shadow-[0_12px_28px_rgba(13,46,139,0.05)] outline-none transition focus:border-[#13B5C8] focus:ring-4 focus:ring-[#13B5C8]/15"
            value={city}
            onChange={(event) => updateFilters({ city: event.target.value })}
          >
            {cityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </SelectShell>

        <button
          type="submit"
          className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-[12px] bg-[#13B5C8] px-7 text-[14px] font-extrabold text-white shadow-[0_14px_28px_rgba(19,181,200,0.24)] transition hover:-translate-y-0.5 hover:bg-[#0D2E8B] md:w-auto"
        >
          <Search className="h-5 w-5" aria-hidden="true" />
          Търси
        </button>
      </form>

      <div className="quick-filter-grid mt-4 grid gap-3 sm:grid-cols-2">
        <div className="quick-filter-item relative">
          <FilterButton
            icon={Stethoscope}
            active={selectedSpecialties.length > 0}
            open={openMenu === 'specialties'}
            onClick={() => toggleMenu('specialties')}
          >
            {specialtyLabel}
          </FilterButton>
          <DropdownMenu open={openMenu === 'specialties'}>
            <MenuOption
              active={selectedSpecialties.length === 0}
              onClick={() => updateFilters({ specialties: [], specialtySearch: '' })}
            >
              Всички специалности
            </MenuOption>
            {specialtyOptions.map((specialty) => (
              <MenuOption
                key={specialty.value}
                active={selectedSpecialties.includes(specialty.value)}
                onClick={() => onToggleSpecialty?.(specialty.value)}
              >
                {specialty.label}
              </MenuOption>
            ))}
          </DropdownMenu>
        </div>

        <div className="quick-filter-item relative">
          <FilterButton
            icon={Building2}
            active={city !== allCitiesLabel}
            open={openMenu === 'cities'}
            onClick={() => toggleMenu('cities')}
          >
            {cityLabel}
          </FilterButton>
          <DropdownMenu open={openMenu === 'cities'}>
            {cityOptions.map((option) => (
              <MenuOption
                key={option}
                active={city === option}
                onClick={() => {
                  updateFilters({ city: option })
                  setOpenMenu(null)
                }}
              >
                {option === allCitiesLabel ? 'Всички области' : option}
              </MenuOption>
            ))}
          </DropdownMenu>
        </div>

        <div className="quick-filter-item relative">
          <FilterButton
            icon={Star}
            active={Boolean(minRating)}
            open={openMenu === 'rating'}
            onClick={() => toggleMenu('rating')}
          >
            {ratingLabel}
          </FilterButton>
          <DropdownMenu open={openMenu === 'rating'}>
            {[
              ['', 'Без минимум'],
              ['5', '5 звезди'],
              ['4', '4+ звезди'],
              ['3', '3+ звезди'],
              ['2', '2+ звезди'],
            ].map(([value, label]) => (
              <MenuOption
                key={label}
                active={minRating === value}
                onClick={() => {
                  updateFilters({ minRating: value })
                  setOpenMenu(null)
                }}
              >
                {label}
              </MenuOption>
            ))}
          </DropdownMenu>
        </div>

        <div className="quick-filter-item relative">
          <FilterButton
            icon={Video}
            active={Boolean(filters.onlineOnly)}
            onClick={() => {
              setOpenMenu(null)
              updateFilters({ onlineOnly: !filters.onlineOnly })
            }}
          >
            Онлайн консултация
          </FilterButton>
        </div>

        <div className="quick-filter-item relative">
          <FilterButton
            icon={SlidersHorizontal}
            active={Boolean(
              filters.language ||
                filters.availableOnly ||
                filters.minExperience ||
                filters.maxExperience,
            )}
            onClick={scrollToFilters}
          >
            Още филтри
          </FilterButton>
        </div>
      </div>
    </section>
  )
}
