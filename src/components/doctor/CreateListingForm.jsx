import { useState } from 'react'
import { Camera, Info, MapPin, Save, Send, Stethoscope, X } from 'lucide-react'
import { cities, specialties } from '../../data/authMock'

const defaultWorkingHours = '09:00 - 17:00'
const defaultFreeSlots = '09:00, 10:00, 11:00, 13:00, 14:00, 15:00, 16:00'

const initialForm = {
  title: '',
  specialty: '',
  description: '',
  price: '',
  location: '',
  online: true,
  image: '',
  imageName: '',
}

function buildInitialForm(doctor, listing) {
  return {
    ...initialForm,
    specialty: doctor?.specialty || '',
    location: doctor?.city || '',
    ...(listing || {}),
    price: listing?.price ? String(listing.price) : '',
    workingHours: defaultWorkingHours,
    freeSlots: defaultFreeSlots,
  }
}

export default function CreateListingForm({
  doctor,
  canPublish = true,
  listingLimitReached = false,
  initialListing = null,
  onCreateListing,
  onUpdateListing,
  onCancel,
}) {
  const [form, setForm] = useState(() => buildInitialForm(doctor, initialListing))
  const [errors, setErrors] = useState({})
  const isEditMode = Boolean(initialListing)
  const publishDisabled = !canPublish || (!isEditMode && listingLimitReached)
  const draftDisabled = !isEditMode && listingLimitReached

  const updateField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [field]: '' }))
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setForm((currentForm) => ({
        ...currentForm,
        imageName: file.name,
        image: typeof reader.result === 'string' ? reader.result : '',
      }))
    }
    reader.readAsDataURL(file)
  }

  const validate = () => {
    const nextErrors = {}

    if (!form.title.trim()) nextErrors.title = 'Въведете заглавие.'
    if (!form.specialty) nextErrors.specialty = 'Изберете специалност.'
    if (!form.description.trim()) nextErrors.description = 'Добавете описание.'
    if (!form.price || Number(form.price) <= 0) {
      nextErrors.price = 'Въведете цена в EUR.'
    }
    if (!form.location) nextErrors.location = 'Изберете локация.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const submitListing = (status) => {
    if (status === 'published' && publishDisabled) return
    if (status === 'draft' && draftDisabled) return
    if (!validate()) return

    const payload = {
      ...initialListing,
      ...form,
      id: initialListing?.id || `${Date.now()}`,
      price: Number(form.price),
      currency: 'EUR',
      workingHours: defaultWorkingHours,
      freeSlots: defaultFreeSlots,
      status,
      createdAt: initialListing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (isEditMode) {
      onUpdateListing?.(payload)
      return
    }

    onCreateListing?.(payload)
    setForm(buildInitialForm(doctor, null))
  }

  return (
    <section className="rounded-[16px] border border-[#E1E8F3] bg-white p-5 shadow-[0_16px_35px_rgba(13,46,139,0.07)] md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[24px] font-extrabold text-[#0D2E8B]">
            {isEditMode ? 'Редакция на обява' : 'Създай обява'}
          </h2>
          <p className="mt-1 text-[14px] font-semibold text-[#697894]">
            Работното време се задава автоматично: 09:00 - 17:00.
          </p>

          {!canPublish ? (
            <p className="mt-2 rounded-[10px] bg-[#FFF8E6] px-3 py-2 text-[13px] font-bold text-[#875A00]">
              За публикуване е нужен активен MedLink Plus абонамент.
            </p>
          ) : null}

          {!isEditMode && listingLimitReached ? (
            <p className="mt-2 rounded-[10px] bg-[#FFF3F2] px-3 py-2 text-[13px] font-bold text-[#B42318]">
              Достигнат е лимитът от 2 обяви. Изтрийте стара обява, за да
              създадете нова.
            </p>
          ) : null}
        </div>

        {isEditMode ? (
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-[10px] border border-[#DCE5F0] bg-white text-[#526383] transition hover:border-[#13B5C8] hover:text-[#087F91]"
            aria-label="Откажи редакцията"
            onClick={onCancel}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4">
        <Field
          label="Заглавие"
          value={form.title}
          error={errors.title}
          placeholder="Напр. Кардиологичен преглед и профилактика"
          onChange={(value) => updateField('title', value)}
        />

        <div className="grid gap-4 md:grid-cols-3">
          <SelectField
            icon={Stethoscope}
            label="Специалност"
            value={form.specialty}
            options={specialties}
            error={errors.specialty}
            onChange={(value) => updateField('specialty', value)}
          />
          <Field
            label="Цена за преглед (EUR)"
            value={form.price}
            error={errors.price}
            type="number"
            placeholder="35"
            onChange={(value) => updateField('price', value)}
          />
          <SelectField
            icon={MapPin}
            label="Локация"
            value={form.location}
            options={cities}
            error={errors.location}
            onChange={(value) => updateField('location', value)}
          />
        </div>

        <label className="block">
          <span className="text-[13px] font-extrabold text-[#0D2E8B]">
            Описание
          </span>
          <textarea
            className={`mt-2 min-h-[120px] w-full rounded-[12px] border bg-white px-3 py-3 text-[14px] font-semibold text-[#0D2E8B] outline-none transition focus:border-[#13B5C8] ${
              errors.description ? 'border-[#F04438]' : 'border-[#DCE5F0]'
            }`}
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
          />
          {errors.description ? <ErrorText>{errors.description}</ErrorText> : null}
        </label>

        <div className="rounded-[12px] border border-[#DCE5F0] bg-[#FAFCFF] p-4">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#13B5C8]" />
            <div>
              <p className="text-[13px] font-extrabold text-[#0D2E8B]">
                Работно време
              </p>
              <p className="mt-1 text-[13px] font-semibold text-[#526383]">
                Всички обяви използват стандартно работно време 09:00 - 17:00.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_260px]">
          <label className="flex cursor-pointer items-center gap-3 rounded-[12px] border border-dashed border-[#C9D5E8] bg-[#FAFCFF] p-4 text-[#0D2E8B] transition hover:border-[#13B5C8]">
            {form.image ? (
              <img
                src={form.image}
                alt=""
                className="h-14 w-14 rounded-[14px] object-cover shadow-[0_10px_22px_rgba(13,46,139,0.12)]"
              />
            ) : (
              <span className="grid h-11 w-11 place-items-center rounded-[12px] bg-[#EAFBFD] text-[#13B5C8]">
                <Camera className="h-5 w-5" />
              </span>
            )}
            <span className="min-w-0">
              <span className="block text-[13px] font-extrabold">Снимка</span>
              <span className="block truncate text-[12px] font-semibold text-[#697894]">
                {form.imageName || 'Изберете снимка за обявата'}
              </span>
            </span>
            <input
              className="sr-only"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>

          <label className="flex items-center justify-between rounded-[12px] border border-[#DCE5F0] bg-white px-4 py-3">
            <span>
              <span className="block text-[13px] font-extrabold text-[#0D2E8B]">
                Онлайн консултация
              </span>
              <span className="text-[12px] font-semibold text-[#697894]">
                Да / не
              </span>
            </span>
            <input
              type="checkbox"
              checked={form.online}
              className="h-5 w-5 accent-[#13B5C8]"
              onChange={(event) => updateField('online', event.target.checked)}
            />
          </label>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[12px] border border-[#13B5C8] bg-white px-6 text-[15px] font-extrabold text-[#087F91] transition hover:bg-[#EAFBFD] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={draftDisabled}
            onClick={() => submitListing('draft')}
          >
            <Save className="h-5 w-5" />
            {isEditMode ? 'Запази като чернова' : 'Запази'}
          </button>
          {isEditMode ? (
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center rounded-[12px] border border-[#DCE5F0] bg-white px-6 text-[15px] font-extrabold text-[#526383] transition hover:border-[#13B5C8] hover:text-[#087F91]"
              onClick={onCancel}
            >
              Откажи
            </button>
          ) : null}
          <button
            type="button"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[12px] bg-[#13B5C8] px-6 text-[15px] font-extrabold text-white shadow-[0_14px_28px_rgba(19,181,200,0.24)] transition hover:bg-[#0D2E8B] disabled:cursor-not-allowed disabled:bg-[#9AA7C2]"
            disabled={publishDisabled}
            onClick={() => submitListing('published')}
          >
            <Send className="h-5 w-5" />
            {isEditMode ? 'Запази и публикувай' : 'Публикувай'}
          </button>
        </div>
      </div>
    </section>
  )
}

function Field({
  icon: Icon,
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder = '',
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-extrabold text-[#0D2E8B]">{label}</span>
      <span className="relative mt-2 block">
        {Icon ? (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#13B5C8]" />
        ) : null}
        <input
          className={`h-12 w-full rounded-[12px] border bg-white px-3 text-[14px] font-semibold text-[#0D2E8B] outline-none transition focus:border-[#13B5C8] ${
            Icon ? 'pl-10' : ''
          } ${error ? 'border-[#F04438]' : 'border-[#DCE5F0]'}`}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      </span>
      {error ? <ErrorText>{error}</ErrorText> : null}
    </label>
  )
}

function SelectField({ icon: Icon, label, value, options, onChange, error }) {
  return (
    <label className="block">
      <span className="text-[13px] font-extrabold text-[#0D2E8B]">{label}</span>
      <span className="relative mt-2 block">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#13B5C8]" />
        <select
          className={`h-12 w-full appearance-none rounded-[12px] border bg-white pl-10 pr-3 text-[14px] font-semibold text-[#0D2E8B] outline-none transition focus:border-[#13B5C8] ${
            error ? 'border-[#F04438]' : 'border-[#DCE5F0]'
          }`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">Изберете</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </span>
      {error ? <ErrorText>{error}</ErrorText> : null}
    </label>
  )
}

function ErrorText({ children }) {
  return (
    <span className="mt-1 block text-[12px] font-bold text-[#F04438]">
      {children}
    </span>
  )
}
