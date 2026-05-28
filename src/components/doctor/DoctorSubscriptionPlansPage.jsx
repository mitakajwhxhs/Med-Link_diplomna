import { ArrowLeft, CheckCircle2, CreditCard } from 'lucide-react'
import { doctorSubscriptionPlans } from '../../data/authMock'

export default function DoctorSubscriptionPlansPage({
  onBack,
  onSubscribe,
}) {
  return (
    <section className="grid gap-5">
      <header className="flex flex-col gap-3 rounded-[12px] border border-[#E1E8F3] bg-white p-5 shadow-[0_14px_34px_rgba(13,46,139,0.07)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[12px] font-extrabold uppercase text-[#13B5C8]">
            MedLink Plus
          </p>
          <h2 className="mt-1 text-[28px] font-extrabold text-[#0D2E8B]">
            Изберете лекарски план
          </h2>
          <p className="mt-1 max-w-[640px] text-[14px] font-semibold leading-6 text-[#526383]">
            Абонаментът добавя онлайн консултации, допълнителни Plus функции и
            приоритетна поддръжка.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] border border-[#DCE5F0] bg-white px-4 text-[13px] font-extrabold text-[#0D2E8B] transition hover:border-[#13B5C8] hover:text-[#087F91]"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Назад
        </button>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {doctorSubscriptionPlans.map((plan) => (
          <article
            key={plan.id}
            className={`rounded-[12px] border bg-white p-6 shadow-[0_14px_34px_rgba(13,46,139,0.08)] ${
              plan.highlighted
                ? 'border-[#13B5C8] ring-4 ring-[#13B5C8]/10'
                : 'border-[#E1E8F3]'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[12px] font-extrabold uppercase text-[#087F91]">
                  {plan.audience}
                </p>
                <h3 className="mt-2 text-[26px] font-extrabold text-[#0D2E8B]">
                  {plan.name}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-[34px] font-extrabold text-[#0D2E8B]">
                  {plan.price}
                </p>
                <p className="text-[12px] font-bold text-[#697894]">
                  {plan.currencyLabel || 'EUR'} / {plan.interval}
                </p>
              </div>
            </div>

            <p className="mt-4 text-[14px] font-semibold leading-6 text-[#526383]">
              {plan.description}
            </p>

            <div className="mt-5 grid gap-2">
              {plan.features.map((feature) => (
                <span
                  key={feature}
                  className="flex items-center gap-2 text-[13px] font-bold text-[#40517A]"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#13B5C8]" />
                  {feature}
                </span>
              ))}
            </div>

            <button
              type="button"
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#13B5C8] text-[15px] font-extrabold text-white shadow-[0_12px_25px_rgba(19,181,200,0.18)] transition hover:bg-[#0D2E8B]"
              onClick={() => onSubscribe?.(plan)}
            >
              <CreditCard className="h-5 w-5" aria-hidden="true" />
              Активирай със Stripe
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
