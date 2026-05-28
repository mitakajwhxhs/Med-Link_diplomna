import { useState } from 'react'
import { ArrowLeft, LockKeyhole, Mail } from 'lucide-react'
import Navbar from '../components/Navbar'
import VerificationCodeInput from '../components/VerificationCodeInput'

export default function ForgotPasswordPage({
  likedCount = 0,
  onForgotPassword,
  onResetPassword,
}) {
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitEmail = async (event) => {
    event.preventDefault()
    setError('')
    setStatus('')

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Въведете валиден имейл адрес.')
      return
    }

    setIsSubmitting(true)
    const result = await onForgotPassword?.({ email: email.trim().toLowerCase() })
    setIsSubmitting(false)

    if (!result?.ok) {
      setError(result?.message || 'Не успяхме да изпратим код.')
      return
    }

    setStatus(result.message || 'Ако има профил с този имейл, ще получите код.')
    setStep('reset')
  }

  const submitReset = async (event) => {
    event.preventDefault()
    setError('')
    setStatus('')

    if (!/^\d{6}$/.test(code)) {
      setError('Въведете 6-цифрения код.')
      return
    }

    if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      setError('Паролата трябва да е поне 8 символа и да съдържа малка буква, главна буква и цифра.')
      return
    }

    if (password !== confirmPassword) {
      setError('Паролите не съвпадат.')
      return
    }

    setIsSubmitting(true)
    const result = await onResetPassword?.({
      email: email.trim().toLowerCase(),
      code,
      password,
    })
    setIsSubmitting(false)

    if (!result?.ok) {
      setError(result?.message || 'Паролата не беше обновена.')
      return
    }

    setStatus('Паролата е обновена успешно.')
    setPassword('')
    setConfirmPassword('')
    window.setTimeout(() => {
      window.location.hash = '#/login'
    }, 1200)
  }

  return (
    <main className="min-h-screen bg-[#F5F8FC] text-[#0D2E8B]">
      <Navbar activePage="login" compact likedCount={likedCount} />

      <section className="mx-auto flex max-w-[1180px] items-center justify-center px-5 py-10 sm:px-8 xl:px-0">
        <form
          className="w-full max-w-[430px] rounded-[18px] border border-[#CFE0F4] bg-white p-7 shadow-[0_18px_45px_rgba(13,46,139,0.10)]"
          onSubmit={step === 'email' ? submitEmail : submitReset}
        >
          <a
            href="#/login"
            className="inline-flex items-center gap-2 text-[13px] font-extrabold text-[#0D2E8B] transition hover:text-[#087F91]"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </a>

          <div className="mt-7">
            <h1 className="text-[28px] font-extrabold text-[#0D2E8B]">
              Забравена парола
            </h1>
            <p className="mt-2 text-[15px] font-semibold leading-6 text-[#526383]">
              {step === 'email'
                ? 'Въведете имейла си, за да получите код'
                : `Изпратихме код на ${email}`}
            </p>
          </div>

          {step === 'email' ? (
            <label className="mt-7 block">
              <span className="text-[13px] font-extrabold text-[#0D2E8B]">Имейл</span>
              <span className="relative mt-2 block">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#087F91]" />
                <input
                  className="h-12 w-full rounded-[10px] border border-[#C9D8EA] bg-white pl-10 pr-3 text-[14px] font-semibold text-[#0D2E8B] outline-none transition placeholder:text-[#8A98B3] focus:border-[#13B5C8]"
                  type="email"
                  placeholder="имейл@пример.bg"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </span>
            </label>
          ) : (
            <div className="mt-7 grid gap-4">
              <label className="block">
                <span className="text-[13px] font-extrabold text-[#0D2E8B]">
                  Код за потвърждение
                </span>
                <div className="mt-3">
                  <VerificationCodeInput value={code} onChange={setCode} disabled={isSubmitting} />
                </div>
              </label>

              <PasswordField
                label="Нова парола"
                value={password}
                onChange={setPassword}
              />
              <PasswordField
                label="Повторете новата парола"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
            </div>
          )}

          {error ? (
            <p className="mt-4 rounded-[12px] bg-[#FFF2F1] px-3 py-2 text-[13px] font-bold text-[#D92D20]">
              {error}
            </p>
          ) : null}

          {status ? (
            <p className="mt-4 rounded-[12px] bg-[#EAFBFD] px-3 py-2 text-[13px] font-bold text-[#087F91]">
              {status}
            </p>
          ) : null}

          <button
            type="submit"
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-[10px] bg-gradient-to-r from-[#008CA2] to-[#14B8C9] text-[15px] font-extrabold text-white shadow-[0_14px_30px_rgba(19,181,200,0.24)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Изпращане...'
              : step === 'email'
                ? 'Изпрати код'
                : 'Обнови парола'}
          </button>
        </form>
      </section>
    </main>
  )
}

function PasswordField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-[13px] font-extrabold text-[#0D2E8B]">{label}</span>
      <span className="relative mt-2 block">
        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#087F91]" />
        <input
          className="h-12 w-full rounded-[10px] border border-[#C9D8EA] bg-white pl-10 pr-3 text-[14px] font-semibold text-[#0D2E8B] outline-none transition placeholder:text-[#8A98B3] focus:border-[#13B5C8]"
          type="password"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </span>
    </label>
  )
}
