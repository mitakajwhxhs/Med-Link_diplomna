import {
  CalendarCheck2,
  HeartPulse,
  Search,
  ShieldCheck,
  Stethoscope,
  Video,
} from 'lucide-react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

const stats = [
  ['45+', 'лекарски профила'],
  ['15', 'специалности'],
  ['24/7', 'достъп до профили'],
  ['4.8', 'средна оценка'],
]

const values = [
  {
    icon: ShieldCheck,
    title: 'Проверена информация',
    text: 'Профилите показват специалност, опит, езици, рейтинг, кабинет и възможност за онлайн консултация.',
  },
  {
    icon: CalendarCheck2,
    title: 'Бързо запазване',
    text: 'Пациентът избира свободен ден, час и услуга, вижда цената предварително и получава потвърждение.',
  },
  {
    icon: HeartPulse,
    title: 'По-спокойна грижа',
    text: 'MedLink помага изборът на лекар да бъде ясен, подреден и удобен както на телефон, така и на компютър.',
  },
]

function ValueCard({ icon: Icon, title, text }) {
  return (
    <article className="rounded-[16px] border border-[#E1E8F3] bg-white p-6 shadow-[0_16px_35px_rgba(13,46,139,0.07)]">
      <div className="grid h-12 w-12 place-items-center rounded-[14px] bg-[#EAFBFD] text-[#13B5C8]">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-[20px] font-extrabold text-[#0D2E8B]">
        {title}
      </h3>
      <p className="mt-3 text-[15px] font-semibold leading-7 text-[#526383]">
        {text}
      </p>
    </article>
  )
}

export default function AboutPage({ likedCount = 0, currentUser, onLogout }) {
  return (
    <main className="min-h-screen bg-[#F5F7FB] text-[#0D2E8B]">
      <Navbar
        activePage="about"
        compact
        likedCount={likedCount}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <section className="mx-auto max-w-[1240px] px-5 py-8 sm:px-8 sm:py-10 xl:px-0">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#EAFBFD] px-3 py-1 text-[12px] font-extrabold uppercase text-[#087F91]">
              <Stethoscope className="h-4 w-4" aria-hidden="true" />
              За MedLink
            </span>
            <h1 className="mt-5 max-w-[780px] text-[32px] font-extrabold leading-tight text-[#0D2E8B] sm:text-[38px] md:text-[54px]">
              По-лесен път до правилния лекар.
            </h1>
            <p className="mt-5 max-w-[720px] text-[16px] font-semibold leading-7 text-[#40517A] sm:text-[18px] sm:leading-8">
              MedLink е модерна платформа за търсене на специалисти,
              сравняване на профили и запазване на час онлайн. Сайтът събира
              на едно място важната информация, която пациентът търси преди
              преглед: специалност, град, опит, езици, оценки, свободни часове
              и ориентировъчни цени.
            </p>
          </div>

          <aside className="rounded-[18px] border border-[#E1E8F3] bg-white p-4 shadow-[0_18px_42px_rgba(13,46,139,0.09)] sm:p-5">
            <div className="rounded-[16px] bg-[#EAFBFD] p-5">
              <Search className="h-9 w-9 text-[#13B5C8]" aria-hidden="true" />
              <h2 className="mt-4 text-[24px] font-extrabold text-[#0D2E8B]">
                Какво прави платформата?
              </h2>
              <div className="mt-5 grid gap-3 text-[14px] font-bold text-[#40517A]">
                <span className="inline-flex items-center gap-2">
                  <Search className="h-4 w-4 text-[#13B5C8]" />
                  Търсене по име, специалност и град
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarCheck2 className="h-4 w-4 text-[#13B5C8]" />
                  Избор на свободен ден и час
                </span>
                <span className="inline-flex items-center gap-2">
                  <Video className="h-4 w-4 text-[#13B5C8]" />
                  Онлайн консултации при избрани лекари
                </span>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([value, label]) => (
            <div
              key={label}
              className="rounded-[16px] border border-[#E1E8F3] bg-white p-5 shadow-[0_14px_30px_rgba(13,46,139,0.06)]"
            >
              <p className="text-[34px] font-extrabold text-[#13B5C8]">
                {value}
              </p>
              <p className="mt-1 text-[14px] font-bold text-[#526383]">
                {label}
              </p>
            </div>
          ))}
        </div>

        <section className="mt-10">
          <h2 className="text-[26px] font-extrabold text-[#0D2E8B] sm:text-[30px]">
            Нашият подход
          </h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {values.map((value) => (
              <ValueCard key={value.title} {...value} />
            ))}
          </div>
        </section>

      </section>

      <Footer />
    </main>
  )
}
