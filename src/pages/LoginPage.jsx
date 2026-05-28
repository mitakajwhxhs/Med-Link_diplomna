import { useState } from 'react'
import { Eye, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function LoginPage({ likedCount = 0, onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    setIsSubmitting(true)
    const result = await onLogin?.(form)
    setIsSubmitting(false)

    if (!result?.ok) {
      setError(result?.message || 'Грешен имейл или парола.')
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F8FC] text-[#0D2E8B]">
      <Navbar activePage="login" compact likedCount={likedCount} />

      <section className="mx-auto flex min-h-[calc(100vh-76px)] max-w-[1180px] items-center justify-center px-4 py-6 sm:px-8 sm:py-10 xl:px-0">
        <form
          className="w-full max-w-[460px] rounded-[18px] border border-[#CFE0F4] bg-white p-5 shadow-[0_18px_45px_rgba(13,46,139,0.10)] sm:p-7"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center justify-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-[14px] bg-gradient-to-br from-[#0D2E8B] to-[#13B5C8] text-white">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <span className="text-[28px] font-extrabold tracking-normal text-[#0D2E8B]">
              Med<span className="text-[#087F91]">Link</span>
            </span>
          </div>

          <div className="mt-8 text-center">
            <h1 className="text-[26px] font-extrabold text-[#0D2E8B]">
              Добре дошли!
            </h1>
            <p className="mt-2 text-[15px] font-semibold text-[#526383]">
              Влезте в своя профил
            </p>
          </div>

          <label className="mt-7 block">
            <span className="text-[13px] font-extrabold text-[#0D2E8B]">Имейл</span>
            <span className="relative mt-2 block">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#087F91]" />
              <input
                className="h-12 w-full rounded-[10px] border border-[#C9D8EA] bg-white pl-10 pr-3 text-[14px] font-semibold text-[#0D2E8B] outline-none transition placeholder:text-[#8A98B3] focus:border-[#13B5C8]"
                type="email"
                placeholder="имейл@пример.bg"
                autoComplete="email"
                value={form.email}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    email: event.target.value,
                  }))
                }
              />
            </span>
          </label>

          <label className="mt-4 block">
            <span className="text-[13px] font-extrabold text-[#0D2E8B]">Парола</span>
            <span className="relative mt-2 block">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#087F91]" />
              <input
                className="h-12 w-full rounded-[10px] border border-[#C9D8EA] bg-white pl-10 pr-11 text-[14px] font-semibold text-[#0D2E8B] outline-none transition placeholder:text-[#8A98B3] focus:border-[#13B5C8]"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={form.password}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    password: event.target.value,
                  }))
                }
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0D2E8B]"
                aria-label="Покажи паролата"
                onClick={() => setShowPassword((current) => !current)}
              >
                <Eye className="h-4 w-4" />
              </button>
            </span>
          </label>

          <a
            href="#/forgot-password"
            className="mt-3 inline-flex w-full justify-end text-[13px] font-extrabold text-[#0D2E8B] transition hover:text-[#087F91]"
          >
            Забравена парола?
          </a>

          {error ? (
            <p className="mt-4 rounded-[12px] bg-[#FFF2F1] px-3 py-2 text-[13px] font-bold text-[#D92D20]">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-[10px] bg-gradient-to-r from-[#008CA2] to-[#14B8C9] text-[15px] font-extrabold text-white shadow-[0_14px_30px_rgba(19,181,200,0.24)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Влизане...' : 'Вход'}
          </button>

          <a
            href="#/register"
            className="mt-5 inline-flex w-full flex-wrap justify-center text-center text-[14px] font-bold text-[#0D2E8B] transition hover:text-[#087F91]"
          >
            Нямате профил? <span className="ml-1 text-[#087F91]">Регистрирайте се</span>
          </a>
        </form>
      </section>
    </main>
  )
}
