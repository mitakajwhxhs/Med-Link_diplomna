import { ChevronDown, ChevronUp, Filter, Star } from 'lucide-react'
import { useMemo, useState } from 'react'

function CheckboxRow({ label, checked = false, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-[12px] font-semibold text-[#40517A]">
      <input
        type="checkbox"
        checked={checked}
        className="h-4 w-4 rounded border-[#C9D5E8] accent-[#13B5C8]"
        onChange={onChange}
      />
      <span>{label}</span>
    </label>
  )
}

export default function FilterSidebar({
  filters = {},
  specialtyOptions = [],
  languageOptions = [],
  onFilterChange,
  onToggleSpecialty,
  onClearFilters,
}) {
  const [showAllSpecialties, setShowAllSpecialties] = useState(false)
  const specialtySearch = filters.specialtySearch || ''
  const selectedSpecialties = filters.specialties || []

  const filteredSpecialties = useMemo(() => {
    const searchValue = specialtySearch.trim().toLocaleLowerCase('bg-BG')

    if (!searchValue) return specialtyOptions

    return specialtyOptions.filter((specialty) =>
      specialty.label.toLocaleLowerCase('bg-BG').includes(searchValue),
    )
  }, [specialtyOptions, specialtySearch])

  const visibleSpecialties = showAllSpecialties
    ? filteredSpecialties
    : filteredSpecialties.slice(0, 8)
  const canToggleSpecialties = filteredSpecialties.length > 8

  const updateFilters = (updates) => {
    onFilterChange?.(updates)
  }

  return (
    <aside
      id="filters-panel"
      className="rounded-[16px] border border-[#E1E8F3] bg-white p-4 shadow-[0_16px_35px_rgba(13,46,139,0.07)]"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[13px] font-extrabold text-[#0D2E8B]">
          <Filter className="h-4 w-4 text-[#13B5C8]" aria-hidden="true" />
          ФИЛТРИ
        </div>
        <button
          type="button"
          className="text-[11px] font-bold text-[#13B5C8] transition hover:text-[#0D2E8B]"
          onClick={onClearFilters}
        >
          Изчисти всички
        </button>
      </div>

      <div className="mt-5 border-t border-[#ECF1F7] pt-4">
        <h3 className="text-[12px] font-extrabold text-[#0D2E8B]">
          СПЕЦИАЛНОСТ
        </h3>
        <label className="relative mt-3 block">
          <span className="sr-only">Търси специалност</span>
          <input
            className="h-10 w-full rounded-[8px] border border-[#DCE5F0] bg-[#FAFCFF] px-3 text-[12px] font-semibold text-[#0D2E8B] outline-none placeholder:text-[#9AA7C2] focus:border-[#13B5C8]"
            placeholder="Търси специалност..."
            type="search"
            value={specialtySearch}
            onChange={(event) =>
              updateFilters({ specialtySearch: event.target.value })
            }
          />
        </label>
        <div className="mt-3 grid gap-2.5">
          {visibleSpecialties.length > 0 ? (
            visibleSpecialties.map((specialty) => (
              <CheckboxRow
                key={specialty.value}
                label={specialty.label}
                checked={selectedSpecialties.includes(specialty.value)}
                onChange={() => onToggleSpecialty?.(specialty.value)}
              />
            ))
          ) : (
            <p className="rounded-[8px] bg-[#FAFCFF] px-3 py-2 text-[12px] font-semibold text-[#697894]">
              Няма намерена специалност
            </p>
          )}
        </div>
        {canToggleSpecialties ? (
          <button
            type="button"
            className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[#13B5C8]"
            onClick={() => setShowAllSpecialties((value) => !value)}
          >
            {showAllSpecialties ? 'Покажи по-малко' : 'Покажи още'}
            {showAllSpecialties ? (
              <ChevronUp className="h-3 w-3" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-3 w-3" aria-hidden="true" />
            )}
          </button>
        ) : null}
      </div>

      <div className="mt-4 border-t border-[#ECF1F7] pt-4">
        <h3 className="text-[12px] font-extrabold text-[#0D2E8B]">
          ОПИТ (ГОДИНИ)
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <input
            className="h-10 min-w-0 rounded-[8px] border border-[#DCE5F0] px-3 text-[12px] font-semibold text-[#0D2E8B] outline-none placeholder:text-[#9AA7C2] focus:border-[#13B5C8]"
            placeholder="от"
            type="number"
            min="0"
            max="60"
            value={filters.minExperience || ''}
            onChange={(event) =>
              updateFilters({ minExperience: event.target.value })
            }
          />
          <input
            className="h-10 min-w-0 rounded-[8px] border border-[#DCE5F0] px-3 text-[12px] font-semibold text-[#0D2E8B] outline-none placeholder:text-[#9AA7C2] focus:border-[#13B5C8]"
            placeholder="до"
            type="number"
            min="0"
            max="60"
            value={filters.maxExperience || ''}
            onChange={(event) =>
              updateFilters({ maxExperience: event.target.value })
            }
          />
        </div>
      </div>

      <div className="mt-4 border-t border-[#ECF1F7] pt-4">
        <h3 className="text-[12px] font-extrabold text-[#0D2E8B]">
          ОЦЕНКА ОТ ПАЦИЕНТИ
        </h3>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {['5', '4', '3', '2'].map((score) => {
            const isActive = filters.minRating === score

            return (
              <button
                key={score}
                type="button"
                className={`inline-flex h-9 min-w-0 items-center justify-center gap-1 rounded-[8px] border text-[12px] font-bold transition hover:border-[#13B5C8] hover:text-[#087F91] ${
                  isActive
                    ? 'border-[#13B5C8] bg-[#EAFBFD] text-[#087F91]'
                    : 'border-[#DCE5F0] bg-white text-[#0D2E8B]'
                }`}
                aria-pressed={isActive}
                onClick={() =>
                  updateFilters({ minRating: isActive ? '' : score })
                }
              >
                <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                {score}
                {score === '5' ? '' : '+'}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-4 border-t border-[#ECF1F7] pt-4">
        <h3 className="text-[12px] font-extrabold text-[#0D2E8B]">
          ГОВОРИМИ ЕЗИЦИ
        </h3>
        <label className="relative mt-3 block">
          <span className="sr-only">Изберете език</span>
          <select
            className="h-10 w-full appearance-none rounded-[8px] border border-[#DCE5F0] bg-white pl-3 pr-8 text-[12px] font-semibold text-[#677696] outline-none focus:border-[#13B5C8]"
            value={filters.language || ''}
            onChange={(event) => updateFilters({ language: event.target.value })}
          >
            <option value="">Изберете език</option>
            {languageOptions.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0D2E8B]"
            aria-hidden="true"
          />
        </label>
      </div>

      <div className="mt-4 border-t border-[#ECF1F7] pt-4">
        <CheckboxRow
          label="Само със свободни часове"
          checked={Boolean(filters.availableOnly)}
          onChange={() =>
            updateFilters({ availableOnly: !filters.availableOnly })
          }
        />
      </div>
    </aside>
  )
}
