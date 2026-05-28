import { useState } from 'react'
import {
  BadgeCheck,
  Camera,
  Languages,
  Mail,
  MapPin,
  Phone,
  Stethoscope,
  UserRound,
} from 'lucide-react'
import { cities, languageOptions, specialties } from '../data/authMock'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  specialty: '',
  city: '',
  doctorCode: '',
  bio: '',
  experience: '',
  languages: [],
  avatarName: '',
}

export default function RegisterDoctorForm({ onRegister }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [field]: '' }))
  }

  const toggleLanguage = (language) => {
    setForm((currentForm) => {
      const languages = currentForm.languages.includes(language)
        ? currentForm.languages.filter((item) => item !== language)
        : [...currentForm.languages, language]

      return { ...currentForm, languages }
    })
    setErrors((currentErrors) => ({ ...currentErrors, languages: '' }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!form.name.trim()) nextErrors.name = 'Въведете име и фамилия.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = 'Въведете валиден имейл.'
    }
    if (!form.phone.trim()) nextErrors.phone = 'Въведете телефон.'
    if (!isStrongPassword(form.password)) {
      nextErrors.password =
        'Паролата трябва да е поне 8 символа и да съдържа малка буква, главна буква и цифра.'
    }
    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Паролите не съвпадат.'
    }
    if (!form.specialty) nextErrors.specialty = 'Изберете специалност.'
    if (!form.city) nextErrors.city = 'Изберете град.'
    if (!form.doctorCode.trim()) {
      nextErrors.doctorCode = 'Лекарският код е задължителен.'
    }
    if (!form.bio.trim()) nextErrors.bio = 'Добавете кратко описание.'
    if (!form.experience || Number(form.experience) < 0) {
      nextErrors.experience = 'Въведете години опит.'
    }
    if (form.languages.length === 0) nextErrors.languages = 'Изберете поне един език.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    const result = await onRegister?.(form)
    setIsSubmitting(false)

    if (result?.ok) setForm(initialForm)
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          icon={UserRound}
          label="Име и фамилия"
          value={form.name}
          error={errors.name}
          onChange={(value) => updateField('name', value)}
        />
        <Field
          icon={Mail}
          label="Имейл"
          value={form.email}
          error={errors.email}
          type="email"
          onChange={(value) => updateField('email', value)}
        />
        <Field
          icon={Phone}
          label="Телефон"
          value={form.phone}
          error={errors.phone}
          onChange={(value) => updateField('phone', value)}
        />
        <Field
          icon={BadgeCheck}
          label="УИН / лекарски идентификационен код"
          value={form.doctorCode}
          error={errors.doctorCode}
          placeholder="пример: UIN-123456"
          onChange={(value) => updateField('doctorCode', value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          icon={Stethoscope}
          label="Специалност"
          value={form.specialty}
          error={errors.specialty}
          options={specialties}
          onChange={(value) => updateField('specialty', value)}
        />
        <SelectField
          icon={MapPin}
          label="Град"
          value={form.city}
          error={errors.city}
          options={cities}
          onChange={(value) => updateField('city', value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Парола"
          value={form.password}
          error={errors.password}
          type="password"
          onChange={(value) => updateField('password', value)}
        />
        <Field
          label="Потвърждение на парола"
          value={form.confirmPassword}
          error={errors.confirmPassword}
          type="password"
          onChange={(value) => updateField('confirmPassword', value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-[160px_minmax(0,1fr)]">
        <Field
          label="Години опит"
          value={form.experience}
          error={errors.experience}
          type="number"
          onChange={(value) => updateField('experience', value)}
        />
        <label className="block">
          <span className="flex items-center gap-2 text-[13px] font-extrabold text-[#0D2E8B]">
            <Languages className="h-4 w-4 text-[#13B5C8]" />
            Езици
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {languageOptions.map((language) => (
              <button
                key={language}
                type="button"
                className={`rounded-full border px-3 py-2 text-[12px] font-bold transition ${
                  form.languages.includes(language)
                    ? 'border-[#13B5C8] bg-[#EAFBFD] text-[#087F91]'
                    : 'border-[#DCE5F0] bg-white text-[#526383] hover:border-[#13B5C8]'
                }`}
                onClick={() => toggleLanguage(language)}
              >
                {language}
              </button>
            ))}
          </div>
          {errors.languages ? (
            <span className="mt-1 block text-[12px] font-bold text-[#F04438]">
              {errors.languages}
            </span>
          ) : null}
        </label>
      </div>

      <label className="block">
        <span className="text-[13px] font-extrabold text-[#0D2E8B]">
          Кратко описание
        </span>
        <textarea
          className={`mt-2 min-h-[112px] w-full rounded-[12px] border bg-white px-3 py-3 text-[14px] font-semibold text-[#0D2E8B] outline-none transition placeholder:text-[#9AA7C2] focus:border-[#13B5C8] ${
            errors.bio ? 'border-[#F04438]' : 'border-[#DCE5F0]'
          }`}
          value={form.bio}
          onChange={(event) => updateField('bio', event.target.value)}
        />
        {errors.bio ? <span className="mt-1 block text-[12px] font-bold text-[#F04438]">{errors.bio}</span> : null}
      </label>

      <label className="flex cursor-pointer items-center gap-3 rounded-[12px] border border-dashed border-[#C9D5E8] bg-[#FAFCFF] p-4 text-[#0D2E8B] transition hover:border-[#13B5C8]">
        <span className="grid h-11 w-11 place-items-center rounded-[12px] bg-[#EAFBFD] text-[#13B5C8]">
          <Camera className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-[13px] font-extrabold">Снимка / аватар</span>
          <span className="block truncate text-[12px] font-semibold text-[#697894]">
            {form.avatarName || 'Изберете файл за профилна снимка'}
          </span>
        </span>
        <input
          className="sr-only"
          type="file"
          accept="image/*"
          onChange={(event) =>
            updateField('avatarName', event.target.files?.[0]?.name || '')
          }
        />
      </label>

      <button
        type="submit"
        className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-[12px] bg-gradient-to-r from-[#008CA2] to-[#14B8C9] px-3 text-center text-[15px] font-extrabold text-white shadow-[0_14px_28px_rgba(19,181,200,0.24)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Изпращане...' : 'Създай лекарски профил'}
      </button>
    </form>
  )
}

function isStrongPassword(password) {
  return password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password)
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
          <Icon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#13B5C8]"
            aria-hidden="true"
          />
        ) : null}
        <input
          className={`h-12 w-full rounded-[12px] border bg-white px-3 text-[14px] font-semibold text-[#0D2E8B] outline-none transition placeholder:text-[#9AA7C2] focus:border-[#13B5C8] ${
            Icon ? 'pl-10' : ''
          } ${error ? 'border-[#F04438]' : 'border-[#DCE5F0]'}`}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      </span>
      {error ? <span className="mt-1 block text-[12px] font-bold text-[#F04438]">{error}</span> : null}
    </label>
  )
}

function SelectField({ icon: Icon, label, value, onChange, error, options }) {
  return (
    <label className="block">
      <span className="text-[13px] font-extrabold text-[#0D2E8B]">{label}</span>
      <span className="relative mt-2 block">
        <Icon
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#13B5C8]"
          aria-hidden="true"
        />
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
      {error ? <span className="mt-1 block text-[12px] font-bold text-[#F04438]">{error}</span> : null}
    </label>
  )
}
