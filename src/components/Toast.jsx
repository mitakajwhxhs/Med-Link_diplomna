import { AlertCircle, Bell, CheckCircle2, Heart, X } from 'lucide-react'
import { useEffect } from 'react'

const icons = {
  liked: Heart,
  reminder: Bell,
  success: CheckCircle2,
  error: AlertCircle,
}

export default function Toast({ toast, onAction, onClose }) {
  useEffect(() => {
    if (!toast) return undefined

    const timeoutId = window.setTimeout(onClose, 5200)
    return () => window.clearTimeout(timeoutId)
  }, [toast, onClose])

  if (!toast) return null

  const Icon = icons[toast.type] || CheckCircle2
  const isError = toast.type === 'error'

  return (
    <div
      className="fixed bottom-5 right-5 z-50 w-[calc(100%-2.5rem)] max-w-[390px] rounded-[16px] border border-[#DCE5F0] bg-white p-4 shadow-[0_22px_55px_rgba(13,46,139,0.18)]"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-[12px] ${
            isError
              ? 'bg-[#FFF2F1] text-[#F04438]'
              : 'bg-[#EAFBFD] text-[#13B5C8]'
          }`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="text-[15px] font-extrabold text-[#0D2E8B]">
            {toast.title}
          </h2>
          <p className="mt-1 text-[13px] font-semibold leading-5 text-[#526383]">
            {toast.message}
          </p>

          {toast.actionLabel ? (
            <button
              type="button"
              className="mt-3 inline-flex h-9 items-center justify-center gap-2 rounded-[10px] bg-[#13B5C8] px-4 text-[13px] font-extrabold text-white transition hover:bg-[#0D2E8B]"
              onClick={() => onAction(toast)}
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              {toast.actionLabel}
            </button>
          ) : null}
        </div>

        <button
          type="button"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] text-[#697894] transition hover:bg-[#F0F5FC] hover:text-[#0D2E8B]"
          aria-label="Затвори известието"
          onClick={onClose}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
