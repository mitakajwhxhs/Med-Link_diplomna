import {
  Bell,
  CalendarCheck2,
  Crown,
  CreditCard,
  FileText,
  Headphones,
  MessageCircle,
  ShieldCheck,
  Tag,
} from 'lucide-react'

const benefits = [
  {
    title: 'Профилни обяви',
    text: 'Публикуването е достъпно и без абонамент',
    icon: CalendarCheck2,
  },
  {
    title: 'Онлайн консултации',
    text: 'Пациентите виждат видео услугите ви',
    icon: MessageCircle,
  },
  {
    title: 'Напомняния',
    text: 'По-добра проследимост на заявките',
    icon: Bell,
  },
  {
    title: 'Медицинска история',
    text: 'Данните стоят на едно място',
    icon: FileText,
  },
  {
    title: 'Ексклузивни оферти',
    text: 'Промоции при партньори на MedLink',
    icon: Tag,
  },
  {
    title: 'Приоритетна поддръжка',
    text: 'По-бърза помощ за лекарски профили',
    icon: Headphones,
  },
]

export default function DoctorSubscriptionGate({
  subscription,
  onChoosePlan,
}) {
  const hasActiveSubscription = subscription?.status?.startsWith('active')

  return (
    <section className="grid gap-6">
      <div className="rounded-[12px] bg-gradient-to-r from-[#0D6D91] via-[#00899A] to-[#12B7C8] p-6 text-white shadow-[0_18px_42px_rgba(13,46,139,0.16)] md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-[12px] bg-white/14 text-white">
                <Crown className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="text-[28px] font-extrabold md:text-[34px]">
                MedLink Plus
              </h2>
              {hasActiveSubscription ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#9BE7B7] px-3 py-1 text-[12px] font-extrabold text-[#075E2B]">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  Платен
                </span>
              ) : null}
            </div>

            <div className="mt-5 grid gap-2 text-[14px] font-bold text-white/88">
              <p>
                Статус:{' '}
                <span className="text-white">
                  {hasActiveSubscription ? 'Активен абонамент' : 'Неактивен'}
                </span>
              </p>
              <p>
                План:{' '}
                <span className="text-white">
                  {subscription?.planName || 'Изберете лекарски план'}
                </span>
              </p>
              <p>
                Лимит обяви: <span className="text-white">2</span>
              </p>
            </div>
          </div>

          {hasActiveSubscription ? (
            <div className="rounded-[14px] border border-white/20 bg-white/12 px-5 py-4 text-left lg:min-w-[260px]">
              <p className="text-[13px] font-extrabold uppercase text-white/75">
                Абонамент
              </p>
              <p className="mt-2 text-[24px] font-extrabold">Платен</p>
              <p className="mt-1 text-[13px] font-semibold text-white/80">
                Абонаментът е активен за допълнителните Plus предимства.
              </p>
            </div>
          ) : (
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-white px-5 text-[14px] font-extrabold text-[#087F91] transition hover:bg-[#EAFBFD]"
              onClick={onChoosePlan}
            >
              <CreditCard className="h-5 w-5" aria-hidden="true" />
              Избери план
            </button>
          )}
        </div>
      </div>

      <section>
        <h3 className="text-[18px] font-extrabold text-[#0D2E8B]">
          Вашите предимства
        </h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon

            return (
              <article
                key={benefit.title}
                className="rounded-[10px] border border-[#E1E8F3] bg-white p-5 shadow-[0_12px_28px_rgba(13,46,139,0.06)]"
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-[#EAFBFD] text-[#087F91]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h4 className="text-[14px] font-extrabold text-[#0D2E8B]">
                      {benefit.title}
                    </h4>
                    <p className="mt-1 text-[12px] font-semibold leading-5 text-[#526383]">
                      {benefit.text}
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </section>
  )
}
