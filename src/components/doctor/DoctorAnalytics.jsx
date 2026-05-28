import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import {
  CalendarDays,
  Download,
  Filter,
  MapPin,
  Stethoscope,
} from 'lucide-react'
import DoctorStatsCards from './DoctorStatsCards'

const linePoints = [28, 54, 50, 78, 43, 74, 39, 42, 32, 60, 45, 76]
const specialties = [
  ['Кардиология', '28%', '#00899A'],
  ['Дерматология', '22%', '#0D5BDC'],
  ['Неврология', '18%', '#F7A23A'],
  ['Ортопедия', '15%', '#8B5BD6'],
  ['Други', '17%', '#A7C9D1'],
]
const monthly = [48, 62, 70, 69, 82]
const monthlyLabels = ['Яну', 'Фев', 'Мар', 'Апр', 'Май']
const topDoctors = [
  ['Д-р Александър Петров', 312],
  ['Д-р Мария Иванова', 276],
  ['Д-р Георги Димитров', 198],
  ['Д-р Елена Стоянова', 154],
  ['Д-р Иван Иванов', 108],
]
const ages = [
  ['0-18', 28],
  ['19-35', 22],
  ['36-50', 30],
  ['51-65', 25],
  ['65+', 15],
]

const defaultAnalytics = {
  stats: undefined,
  linePoints,
  specialties,
  monthly,
  topDoctors,
  ages,
}

const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#0D2E8B',
      titleColor: '#FFFFFF',
      bodyColor: '#FFFFFF',
      padding: 12,
      cornerRadius: 10,
      displayColors: false,
    },
  },
}

const lineChartOptions = {
  ...baseChartOptions,
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#697894', font: { size: 11, weight: 700 } },
    },
    y: {
      min: 0,
      max: 100,
      grid: { color: '#E8EEF7' },
      ticks: { color: '#697894', font: { size: 11, weight: 700 } },
    },
  },
}

const doughnutChartOptions = {
  ...baseChartOptions,
  cutout: '58%',
}

const barChartOptions = {
  ...baseChartOptions,
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#526383', font: { size: 11, weight: 700 } },
    },
    y: {
      beginAtZero: true,
      grid: { color: '#E8EEF7' },
      ticks: { color: '#697894', font: { size: 11, weight: 700 } },
    },
  },
}

export default function DoctorAnalytics({ analytics = defaultAnalytics }) {
  const activeLinePoints = analytics.linePoints?.length
    ? analytics.linePoints
    : linePoints
  const activeSpecialties = analytics.specialties?.length
    ? analytics.specialties
    : specialties
  const activeMonthly = analytics.monthly?.length ? analytics.monthly : monthly
  const activeTopDoctors = analytics.topDoctors?.length
    ? analytics.topDoctors
    : topDoctors
  const activeAges = analytics.ages?.length ? analytics.ages : ages

  return (
    <section className="grid gap-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <h2 className="text-[28px] font-extrabold text-[#0D2E8B]">Анализи</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <FilterButton icon={CalendarDays}>01.05.2026 - 31.05.2026</FilterButton>
          <FilterButton icon={MapPin}>Всички локации</FilterButton>
          <FilterButton icon={Stethoscope}>Всички лекари</FilterButton>
          <FilterButton icon={Filter}>Филтри</FilterButton>
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-[#087F91] px-4 text-[13px] font-extrabold text-white shadow-[0_12px_25px_rgba(19,181,200,0.18)] transition hover:bg-[#0D2E8B]"
          >
            <Download className="h-4 w-4" />
            Експорт
          </button>
        </div>
      </div>

      <DoctorStatsCards stats={analytics.stats} />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
        <ChartCard title="Прегледи по дни">
          <div className="mt-4 h-[250px]">
            <ChartCanvas
              ariaLabel="Графика на прегледите по дни"
              config={{
                type: 'line',
                data: {
                  labels: [
                    '01.05',
                    '04.05',
                    '08.05',
                    '11.05',
                    '15.05',
                    '18.05',
                    '22.05',
                    '25.05',
                    '27.05',
                    '29.05',
                    '30.05',
                    '31.05',
                  ],
                  datasets: [
                    {
                      label: 'Прегледи',
                      data: activeLinePoints,
                      borderColor: '#0D5BDC',
                      backgroundColor: 'rgba(13, 91, 220, 0.12)',
                      fill: true,
                      tension: 0.38,
                      pointBackgroundColor: '#0D5BDC',
                      pointBorderColor: '#FFFFFF',
                      pointBorderWidth: 3,
                      pointRadius: 5,
                    },
                  ],
                },
                options: lineChartOptions,
              }}
            />
          </div>
        </ChartCard>

        <ChartCard title="Прегледи по специалности">
          <div className="mt-5 grid gap-6 sm:grid-cols-[170px_minmax(0,1fr)] sm:items-center">
            <div className="mx-auto h-44 w-44">
              <ChartCanvas
                ariaLabel="Кръгова графика на прегледите по специалности"
                config={{
                  type: 'doughnut',
                  data: {
                    labels: activeSpecialties.map(([name]) => name),
                    datasets: [
                      {
                        data: activeSpecialties.map(([, value]) =>
                          Number.parseInt(value, 10),
                        ),
                        backgroundColor: activeSpecialties.map(
                          ([, , color]) => color,
                        ),
                        borderColor: '#FFFFFF',
                        borderWidth: 4,
                      },
                    ],
                  },
                  options: doughnutChartOptions,
                }}
              />
            </div>
            <div className="grid gap-3">
              {activeSpecialties.map(([name, value, color]) => (
                <div
                  key={name}
                  className="flex items-center justify-between gap-3 text-[13px] font-bold text-[#526383]"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {name}
                  </span>
                  <span className="text-[#0D2E8B]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <ChartCard title="Прегледи по месеци">
          <div className="mt-4 h-[210px]">
            <ChartCanvas
              ariaLabel="Бар графика на прегледите по месеци"
              config={{
                type: 'bar',
                data: {
                  labels: monthlyLabels.slice(0, activeMonthly.length),
                  datasets: [
                    {
                      label: 'Прегледи',
                      data: activeMonthly,
                      backgroundColor: activeMonthly.map((_, index) =>
                        index === activeMonthly.length - 1
                          ? '#0D5BDC'
                          : '#BFDDE5',
                      ),
                      borderRadius: 8,
                    },
                  ],
                },
                options: barChartOptions,
              }}
            />
          </div>
        </ChartCard>

        <ChartCard title="Топ лекари по прегледи">
          <div className="mt-4 grid gap-3">
            {activeTopDoctors.map(([name, value], index) => (
              <div key={name} className="grid grid-cols-[24px_minmax(0,1fr)_40px] items-center gap-3">
                <span className="text-[12px] font-extrabold text-[#697894]">{index + 1}</span>
                <div>
                  <p className="truncate text-[12px] font-extrabold text-[#0D2E8B]">
                    {name}
                  </p>
                  <div className="mt-1 h-1.5 rounded-full bg-[#E8EEF7]">
                    <div
                      className="h-full rounded-full bg-[#0D5BDC]"
                      style={{ width: `${Math.min((value / 320) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-right text-[12px] font-extrabold text-[#0D2E8B]">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Пациенти по възрастови групи">
          <div className="mt-4 grid gap-4">
            {activeAges.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[44px_minmax(0,1fr)_42px] items-center gap-3">
                <span className="text-[12px] font-bold text-[#526383]">{label}</span>
                <div className="h-3 rounded-full bg-[#E8EEF7]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#13B5C8] to-[#0D5BDC]"
                    style={{ width: `${value * 2.2}%` }}
                  />
                </div>
                <span className="text-right text-[12px] font-extrabold text-[#0D2E8B]">
                  {value}%
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </section>
  )
}

function ChartCanvas({ config, ariaLabel }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return undefined

    const chart = new Chart(canvasRef.current, config)

    return () => {
      chart.destroy()
    }
  }, [config])

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={ariaLabel}
      className="h-full w-full"
    />
  )
}

function FilterButton({ icon: Icon, children }) {
  return (
    <button
      type="button"
      className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] border border-[#DCE5F0] bg-white px-4 text-[12px] font-extrabold text-[#0D2E8B] transition hover:border-[#13B5C8]"
    >
      <Icon className="h-4 w-4 text-[#13B5C8]" />
      {children}
    </button>
  )
}

function ChartCard({ title, children }) {
  return (
    <article className="rounded-[14px] border border-[#E1E8F3] bg-white p-5 shadow-[0_16px_35px_rgba(13,46,139,0.07)]">
      <h3 className="text-[15px] font-extrabold text-[#0D2E8B]">{title}</h3>
      {children}
    </article>
  )
}
