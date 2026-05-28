import { CheckCircle2, CreditCard, ShieldCheck, Sparkles } from 'lucide-react'
import { patientSubscriptionPlans } from '../data/authMock'

export default function SubscriptionPlans({
  currentUser,
  onSubscribe,
  plans = patientSubscriptionPlans,
  title = 'Планове за пациенти',
  subtitle = 'Пациентските планове помагат с напомняния, история на часове и по-удобно управление на здравната грижа.',
  badge = 'Абонаменти за пациенти',
}) {
  return (
    <section className="bg-[#F5F7FB] px-5 py-14 sm:px-8">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#EAFBFD] px-3 py-1 text-[12px] font-extrabold uppercase text-[#087F91]">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {badge}
            </span>
            <h2 className="mt-4 text-[34px] font-extrabold leading-tight text-[#0D2E8B] md:text-[44px]">
              {title}
            </h2>
          </div>
          <p className="max-w-[430px] text-[15px] font-semibold leading-7 text-[#526383]">
            {subtitle}
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`relative rounded-[18px] border bg-white p-6 shadow-[0_18px_42px_rgba(13,46,139,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(13,46,139,0.14)] ${
                plan.highlighted
                  ? 'border-[#13B5C8] ring-4 ring-[#13B5C8]/10'
                  : 'border-[#E1E8F3]'
              }`}
            >
              {plan.highlighted ? (
                <span className="absolute right-5 top-5 rounded-full bg-[#13B5C8] px-3 py-1 text-[11px] font-extrabold uppercase text-white">
                  Препоръчан
                </span>
              ) : null}

              <p className="text-[13px] font-extrabold uppercase text-[#13B5C8]">
                {plan.audience}
              </p>
              <h3 className="mt-3 text-[25px] font-extrabold text-[#0D2E8B]">
                {plan.name}
              </h3>
              <p className="mt-3 min-h-[52px] text-[14px] font-semibold leading-6 text-[#526383]">
                {plan.description}
              </p>

              <div className="mt-6 flex items-end gap-1 text-[#0D2E8B]">
                <span className="text-[42px] font-extrabold">{plan.price}</span>
                <span className="pb-2 text-[15px] font-bold">
                  {plan.currencyLabel || 'EUR'} / {plan.interval}
                </span>
              </div>

              <div className="mt-6 grid gap-3">
                {plan.features.map((feature) => (
                  <span
                    key={feature}
                    className="flex items-center gap-2 text-[14px] font-semibold text-[#40517A]"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#13B5C8]" />
                    {feature}
                  </span>
                ))}
              </div>

              <button
                type="button"
                className={`mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[12px] text-[15px] font-extrabold transition ${
                  plan.highlighted
                    ? 'bg-[#13B5C8] text-white shadow-[0_14px_28px_rgba(19,181,200,0.24)] hover:bg-[#0D2E8B]'
                    : 'border border-[#13B5C8] bg-white text-[#087F91] hover:bg-[#EAFBFD]'
                }`}
                onClick={() => onSubscribe?.(plan)}
              >
                <CreditCard className="h-5 w-5" aria-hidden="true" />
                Плащане със Stripe
              </button>

              {!currentUser ? (
                <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] font-bold text-[#697894]">
                  <ShieldCheck className="h-4 w-4 text-[#13B5C8]" />
                  Необходим е вход преди плащане.
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
