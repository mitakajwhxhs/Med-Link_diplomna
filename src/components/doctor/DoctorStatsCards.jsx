import {
  CalendarCheck2,
  Eye,
  MessageCircle,
  Star,
  TrendingUp,
} from 'lucide-react'

const defaultStats = [
  {
    label: 'Преглеждания',
    value: '1 248',
    change: '+12.5%',
    icon: Eye,
  },
  {
    label: 'Запитвания',
    value: '342',
    change: '+8.3%',
    icon: MessageCircle,
  },
  {
    label: 'Записани часове',
    value: '186',
    change: '+21.3%',
    icon: CalendarCheck2,
  },
  {
    label: 'Среден рейтинг',
    value: '4.8',
    change: '+0.4',
    icon: Star,
  },
]

export default function DoctorStatsCards({ stats = defaultStats, loading = false }) {
  if (loading) {
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon || [Eye, MessageCircle, CalendarCheck2, Star][index % 4]

        return (
          <article
            key={stat.label}
            className="rounded-[14px] border border-[#E1E8F3] bg-white p-5 shadow-[0_16px_35px_rgba(13,46,139,0.07)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] font-extrabold text-[#526383]">
                  {stat.label}
                </p>
                <p className="mt-3 text-[32px] font-extrabold leading-none text-[#0D2E8B]">
                  {stat.value}
                </p>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-[12px] bg-[#EAFBFD] text-[#0D2E8B]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-[13px] font-extrabold text-[#16884A]">
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
              {stat.change}
              <span className="font-semibold text-[#697894]">спрямо предходен период</span>
            </p>
          </article>
        )
      })}
    </div>
  )
}
