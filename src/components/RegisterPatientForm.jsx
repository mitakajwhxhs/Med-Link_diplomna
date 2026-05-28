import { useState } from 'react'
import { Mail, Phone, UserRound } from 'lucide-react'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

export default function RegisterPatientForm({ onRegister }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [field]: '' }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!form.name.trim()) nextErrors.name = 'Въведете име.'
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
          icon={Phone}
          label="Телефон"
          value={form.phone}
          error={errors.phone}
          onChange={(value) => updateField('phone', value)}
        />
      </div>
      <Field
        icon={Mail}
        label="Имейл"
        value={form.email}
        error={errors.email}
        type="email"
        onChange={(value) => updateField('email', value)}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Парола"
          value={form.password}
          error={errors.password}
          type="password"
          onChange={(value) => updateField('password', value)}
        />
        <Field
          label="Потвърждение"
          value={form.confirmPassword}
          error={errors.confirmPassword}
          type="password"
          onChange={(value) => updateField('confirmPassword', value)}
        />
      </div>
      <button
        type="submit"
        className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-[12px] bg-gradient-to-r from-[#008CA2] to-[#14B8C9] px-3 text-center text-[15px] font-extrabold text-white shadow-[0_14px_28px_rgba(19,181,200,0.24)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Изпращане...' : 'Създай пациентски профил'}
      </button>
    </form>
  )
}

function isStrongPassword(password) {
  return password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password)
}

function Field({ icon: Icon, label, value, onChange, error, type = 'text' }) {
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
          onChange={(event) => onChange(event.target.value)}
        />
      </span>
      {error ? <span className="mt-1 block text-[12px] font-bold text-[#F04438]">{error}</span> : null}
    </label>
  )
}
