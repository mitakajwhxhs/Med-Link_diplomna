import { CalendarDays, Search, ShieldCheck, UserRound } from 'lucide-react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import SubscriptionPlans from '../components/SubscriptionPlans'
import heroImage from '../assets/medlink-hero.png'

const features = [
  {
    icon: Search,
    title: 'Търси лекари',
    href: '#/doctors',
  },
  {
    icon: CalendarDays,
    title: 'Запази час',
    href: '#/doctors',
  },
  {
    icon: ShieldCheck,
    title: 'Сигурно и надеждно',
    href: '#/about',
  },
  {
    icon: UserRound,
    title: 'Управлявай профила си',
    subtitle: 'Поддържай лична информация',
    href: '#/profile',
  },
]

function FeatureCard({ icon: Icon, title, subtitle, href }) {
  return (
    <a
      href={href}
      className="flex min-h-[116px] items-center gap-4 rounded-[16px] bg-white px-5 shadow-[0_18px_45px_rgba(20,74,122,0.1)] transition hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(20,74,122,0.16)] sm:min-h-[142px] sm:gap-6 sm:px-8 md:min-h-[172px] md:gap-[27px] md:px-10 lg:px-8 xl:px-10"
    >
      <Icon
        className="h-11 w-11 shrink-0 text-[#075bdc] sm:h-[52px] sm:w-[52px] md:h-[54px] md:w-[54px]"
        strokeWidth={2.7}
        aria-hidden="true"
      />
      <div className="min-w-0">
        <h3 className="text-[18px] font-bold leading-tight text-[#08145e] sm:text-[21px] md:text-[23px]">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-2 text-[14px] font-semibold leading-tight text-[#26306f] md:text-[18px]">
            {subtitle}
          </p>
        ) : null}
      </div>
    </a>
  )
}

export default function HomePage({
  likedCount = 0,
  currentUser,
  onLogout,
  onSubscribe,
}) {
  return (
    <main className="min-h-screen bg-[#f6fbff] text-[#08145e]">
      <Navbar
        activePage="home"
        likedCount={likedCount}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <section className="relative isolate overflow-hidden lg:min-h-[calc(100vh-124px)]">
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <img
            src={heroImage}
            alt=""
            className="absolute left-1/2 top-[-40px] h-full min-h-[600px] w-auto min-w-full -translate-x-1/2 object-cover object-top sm:min-h-[700px] md:h-auto md:min-h-[calc(100vh-90px)] md:w-full"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.88)_39%,rgba(255,255,255,0.08)_73%)]" />

        <div className="relative mx-auto flex min-h-[620px] max-w-[1360px] flex-col px-5 pb-8 pt-14 sm:min-h-[690px] sm:px-6 sm:pt-20 md:px-10 md:pt-[112px] lg:min-h-[calc(100vh-124px)] lg:pb-[214px] xl:px-0">
          <div className="max-w-[760px]">
            <h1 className="text-[34px] font-extrabold leading-[1.18] text-[#07135d] sm:text-[42px] md:text-[58px] md:leading-[1.25]">
              <span className="block">Намери своя лекар.</span>
              <span className="block">Грижа за твоето здраве.</span>
            </h1>

            <div className="mt-[32px] h-px w-[84px] bg-[#19bfd2] md:mt-[35px]" />

            <p className="mt-[22px] max-w-[690px] text-[19px] font-medium leading-[1.48] text-[#0a155f] sm:mt-[26px] sm:text-[25px] md:text-[32px] md:leading-[1.58]">
              <span className="block">
                Лесно търси лекари, разглеждай профили
              </span>
              <span className="block">и запази час онлайн.</span>
            </p>

            <a
              href="#/doctors"
              className="mt-9 inline-flex h-14 w-full max-w-[238px] items-center justify-center rounded-[12px] bg-[#075bdc] text-[20px] font-semibold leading-none text-white shadow-[0_14px_28px_rgba(7,91,220,0.25)] transition hover:-translate-y-0.5 hover:bg-[#13B5C8] sm:mt-[54px] sm:h-[66px] sm:text-[24px] md:h-[78px] md:max-w-[282px] md:text-[27px]"
            >
              Търси лекари
            </a>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:absolute lg:inset-x-8 lg:bottom-[18px] lg:mt-0 lg:grid-cols-[1fr_0.96fr_1.1fr_1.1fr] lg:gap-[18px] xl:inset-x-0">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <SubscriptionPlans currentUser={currentUser} onSubscribe={onSubscribe} />

      <Footer />
    </main>
  )
}
