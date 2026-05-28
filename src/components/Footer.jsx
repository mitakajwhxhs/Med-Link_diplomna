import {
  CalendarDays,
  HeartPulse,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from 'lucide-react'

function LogoMark() {
  return (
    <svg className="h-12 w-12 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="18" y="3" width="12" height="42" rx="6" fill="#13B5C8" />
      <rect x="3" y="18" width="42" height="12" rx="6" fill="#EAFBFD" />
      <circle cx="24" cy="24" r="7" fill="#0D91B8" />
    </svg>
  )
}

function FooterLink({ href, children }) {
  return (
    <a
      href={href}
      className="block text-[15px] font-semibold text-[#C8D5EA] transition hover:text-white"
    >
      {children}
    </a>
  )
}

function ContactRow({ icon: Icon, children }) {
  return (
    <span className="flex items-center gap-3 text-[15px] font-semibold text-[#C8D5EA]">
      <Icon className="h-5 w-5 shrink-0 text-[#13B5C8]" aria-hidden="true" />
      {children}
    </span>
  )
}

export default function Footer() {
  return (
    <footer className="bg-[#081433] text-white">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-10 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1.1fr] xl:px-0">
        <section>
          <div className="flex items-center gap-3">
            <LogoMark />
            <div>
              <p className="text-[24px] font-extrabold leading-none">
                Med<span className="text-[#13B5C8]">Link</span>
              </p>
              <p className="mt-1 text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#9FB3D4]">
                дигитална здравна грижа
              </p>
            </div>
          </div>
          <p className="mt-6 max-w-[360px] text-[15px] font-semibold leading-7 text-[#C8D5EA]">
            MedLink свързва пациенти с проверени лекари, свободни часове,
            онлайн консултации и ясна информация за услуги и цени.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-[12px] font-bold text-[#EAFBFD]">
              <ShieldCheck className="h-4 w-4 text-[#13B5C8]" />
              Проверени профили
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-[12px] font-bold text-[#EAFBFD]">
              <CalendarDays className="h-4 w-4 text-[#13B5C8]" />
              Онлайн запазване
            </span>
          </div>
        </section>

        <section>
          <h2 className="text-[17px] font-extrabold">MedLink</h2>
          <div className="mt-5 grid gap-3">
            <FooterLink href="#/">Начало</FooterLink>
            <FooterLink href="#/doctors">Лекари</FooterLink>
            <FooterLink href="#/liked">Харесани</FooterLink>
            <FooterLink href="#/about">За нас</FooterLink>
          </div>
        </section>

        <section>
          <h2 className="text-[17px] font-extrabold">Пациенти</h2>
          <div className="mt-5 grid gap-3">
            <FooterLink href="#/doctors">Запази час</FooterLink>
            <FooterLink href="#/doctors">Онлайн консултация</FooterLink>
            <FooterLink href="#/doctors">Ценоразпис</FooterLink>
            <FooterLink href="#/about">Как работи</FooterLink>
          </div>
        </section>

        <section>
          <h2 className="text-[17px] font-extrabold">Контакти</h2>
          <div className="mt-5 grid gap-4">
            <ContactRow icon={Phone}>+359 888 120 274</ContactRow>
            <ContactRow icon={MessageCircle}>Viber консултант</ContactRow>
            <ContactRow icon={Mail}>support@medlink.bg</ContactRow>
            <ContactRow icon={MapPin}>бул. Здраве 14, София</ContactRow>
          </div>
        </section>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-3 px-5 py-5 text-[13px] font-semibold text-[#9FB3D4] sm:px-8 md:flex-row md:items-center md:justify-between xl:px-0">
          <span>© 2026 MedLink. Всички права запазени.</span>
          <span className="inline-flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-[#13B5C8]" />
            Грижа, която започва с правилния лекар.
          </span>
        </div>
      </div>
    </footer>
  )
}
