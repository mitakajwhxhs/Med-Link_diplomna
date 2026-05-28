import { useEffect, useState } from 'react'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import Navbar from '../components/Navbar'
import VerificationCodeInput from '../components/VerificationCodeInput'

export default function VerifyEmailPage({
  email = '',
  likedCount = 0,
  onVerify,
  onResend,
}) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    if (countdown <= 0) return undefined

    const timer = window.setTimeout(() => setCountdown((current) => current - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [countdown])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setStatus('')

    if (!email) {
      setError('Липсва имейл за потвърждение. Моля, регистрирайте се отново.')
      return
    }

    if (!/^\d{6}$/.test(code)) {
      setError('Въведете 6-цифрения код.')
      return
    }

    setIsSubmitting(true)
    const result = await onVerify?.({ email, code })
    setIsSubmitting(false)

    if (!result?.ok) {
      setError(result?.message || 'Кодът е невалиден или изтекъл.')
    }
  }

  const handleResend = async () => {
    if (countdown > 0 || !email) return

    setError('')
    setStatus('')
    const result = await onResend?.({ email })

    if (result?.ok) {
      setStatus('Изпратихме нов код за потвърждение.')
      setCountdown(60)
      return
    }

    setError(result?.message || 'Не успяхме да изпратим нов код.')
  }

  return (
    <main className="min-h-screen bg-[#F5F8FC] text-[#0D2E8B]">
      <Navbar activePage="login" compact likedCount={likedCount} />

      <section className="mx-auto flex max-w-[1180px] items-center justify-center px-5 py-10 sm:px-8 xl:px-0">
        <form
          className="w-full max-w-[440px] rounded-[18px] border border-[#CFE0F4] bg-white p-7 shadow-[0_18px_45px_rgba(13,46,139,0.10)]"
          onSubmit={handleSubmit}
        >
          <a
            href="#/login"
            className="inline-flex items-center gap-2 text-[13px] font-extrabold text-[#0D2E8B] transition hover:text-[#087F91]"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </a>

          <div className="mt-7 flex justify-center">
            <span className="grid h-20 w-20 place-items-center rounded-[22px] bg-[#EAFBFD] text-[#087F91]">
              <ShieldCheck className="h-11 w-11" />
            </span>
          </div>

          <h1 className="mt-7 text-center text-[24px] font-extrabold text-[#0D2E8B]">
            Потвърдете самоличността си
          </h1>
          <p className="mt-3 text-center text-[15px] font-semibold leading-6 text-[#526383]">
            Изпратихме 6-цифрен код на{' '}
            <span className="font-extrabold text-[#087F91]">{email || 'вашия имейл'}</span>
          </p>

          <label className="mt-7 block">
            <span className="text-[13px] font-extrabold text-[#0D2E8B]">
              Код за потвърждение
            </span>
            <div className="mt-3">
              <VerificationCodeInput value={code} onChange={setCode} disabled={isSubmitting} />
            </div>
          </label>

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

          <p className="mt-5 text-center text-[13px] font-semibold text-[#526383]">
            Не получихте код?{' '}
            <button
              type="button"
              className="font-extrabold text-[#087F91] disabled:text-[#8A98B3]"
              disabled={countdown > 0}
              onClick={handleResend}
            >
              Изпрати отново{countdown > 0 ? ` (${countdown})` : ''}
            </button>
          </p>

          <button
            type="submit"
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-[10px] bg-gradient-to-r from-[#008CA2] to-[#14B8C9] text-[15px] font-extrabold text-white shadow-[0_14px_30px_rgba(19,181,200,0.24)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Проверка...' : 'Потвърди'}
          </button>
        </form>
      </section>
    </main>
  )
}
