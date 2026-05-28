import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, CreditCard, Loader2 } from 'lucide-react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

function getSessionIdFromHash() {
  const query = window.location.hash.split('?')[1] || ''
  return new URLSearchParams(query).get('session_id')
}

export default function CheckoutResultPage({
  status = 'success',
  likedCount = 0,
  currentUser,
  onLogout,
  onVerifyCheckout,
}) {
  const [sessionId] = useState(() => getSessionIdFromHash())
  const [state, setState] = useState(() => {
    const missingSessionId = status === 'success' && !sessionId

    return {
      loading: status === 'success' && Boolean(sessionId),
      ok: false,
      message:
        status === 'cancel'
          ? 'Плащането беше отказано или прекъснато.'
          : missingSessionId
            ? 'Липсва Stripe session id. Моля, стартирайте плащането отново.'
            : 'Проверяваме плащането със Stripe...',
    }
  })

  useEffect(() => {
    if (status !== 'success') return

    if (!sessionId) return

    let isMounted = true

    async function verify() {
      const result = await onVerifyCheckout?.(sessionId)

      if (!isMounted) return

      setState({
        loading: false,
        ok: Boolean(result?.ok),
        message:
          result?.message ||
          (result?.ok
            ? 'Абонаментът е активиран успешно.'
            : 'Не успяхме да потвърдим плащането.'),
      })
    }

    verify()

    return () => {
      isMounted = false
    }
  }, [onVerifyCheckout, sessionId, status])

  const Icon = state.loading ? Loader2 : state.ok ? CheckCircle2 : AlertCircle
  const isDoctor = currentUser?.role === 'doctor'

  return (
    <main className="min-h-screen bg-[#F5F7FB] text-[#0D2E8B]">
      <Navbar
        activePage="home"
        compact
        likedCount={likedCount}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <section className="mx-auto grid max-w-[760px] px-5 py-14 sm:px-8">
        <article className="rounded-[20px] border border-[#E1E8F3] bg-white p-8 text-center shadow-[0_20px_48px_rgba(13,46,139,0.1)]">
          <div
            className={`mx-auto grid h-16 w-16 place-items-center rounded-[18px] ${
              state.loading
                ? 'bg-[#EAFBFD] text-[#13B5C8]'
                : state.ok
                  ? 'bg-[#EAF8EF] text-[#16884A]'
                  : 'bg-[#FFF3F2] text-[#B42318]'
            }`}
          >
            <Icon
              className={`h-8 w-8 ${state.loading ? 'animate-spin text-[#13B5C8]' : ''}`}
            />
          </div>
          <h1 className="mt-5 text-[32px] font-extrabold">
            {state.loading
              ? 'Проверка на плащането'
              : state.ok
                ? 'Плащането е успешно'
                : 'Плащането не е потвърдено'}
          </h1>
          <p className="mx-auto mt-3 max-w-[520px] text-[15px] font-semibold leading-7 text-[#526383]">
            {state.message}
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={isDoctor ? '#/doctor/dashboard' : '#/'}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[12px] bg-[#13B5C8] px-6 text-[15px] font-extrabold text-white shadow-[0_14px_28px_rgba(19,181,200,0.22)] transition hover:bg-[#0D2E8B]"
            >
              <CreditCard className="h-5 w-5" />
              {isDoctor ? 'Към лекарския панел' : 'Към началото'}
            </a>
            {!state.ok ? (
              <a
                href={isDoctor ? '#/doctor/dashboard' : '#/'}
                className="inline-flex h-12 items-center justify-center rounded-[12px] border border-[#13B5C8] bg-white px-6 text-[15px] font-extrabold text-[#087F91] transition hover:bg-[#EAFBFD]"
              >
                Опитай отново
              </a>
            ) : null}
          </div>
        </article>
      </section>

      <Footer />
    </main>
  )
}
