import { Heart, Menu, UserRound, X } from 'lucide-react'
import { useState } from 'react'

function LogoMark() {
  return (
    <svg className="h-9 w-9 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="18" y="3" width="12" height="42" rx="6" fill="#0D2E8B" />
      <rect x="3" y="18" width="42" height="12" rx="6" fill="#13B5C8" />
      <circle cx="24" cy="24" r="7" fill="#0D91B8" />
    </svg>
  )
}

function LikedNavLink({ active, likedCount, onClick }) {
  const hasLiked = likedCount > 0

  return (
    <a
      href="#/liked"
      className={`relative inline-grid h-10 w-10 place-items-center rounded-full transition hover:bg-[#EAFBFD] hover:text-[#13B5C8] ${
        active ? 'bg-[#EAFBFD] text-[#13B5C8]' : 'text-[#07135d]'
      }`}
      aria-label="Харесани лекари"
      title="Харесани"
      onClick={onClick}
    >
      <Heart
        className={`h-5 w-5 ${active ? 'fill-[#13B5C8]' : ''}`}
        aria-hidden="true"
      />
      {hasLiked ? (
        <span
          className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#F04438]"
          aria-hidden="true"
        />
      ) : null}
    </a>
  )
}

export default function Navbar({
  activePage = 'home',
  compact = false,
  likedCount = 0,
  currentUser,
  onLogout,
}) {
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { label: 'Начало', href: '#/', page: 'home' },
    { label: 'Лекари', href: '#/doctors', page: 'doctors' },
    { label: 'За нас', href: '#/about', page: 'about' },
  ]

  return (
    <header className="relative z-20 border-b border-[#E1E8F3] bg-white/95">
      <div
        className={`mx-auto flex min-w-0 items-center justify-between gap-2 px-4 sm:gap-4 sm:px-8 xl:px-0 ${
          compact
            ? 'min-h-[76px] max-w-[1240px]'
            : 'min-h-[92px] max-w-[1360px] md:min-h-[124px]'
        }`}
      >
        <a href="#/" className="flex min-w-0 items-center gap-2.5">
          <LogoMark />
          <span
            className={`truncate font-extrabold leading-none text-[#0D2E8B] ${
              compact ? 'text-[22px] sm:text-[24px]' : 'text-[26px] sm:text-[30px] md:text-[40px]'
            }`}
          >
            Med<span className="text-[#13B5C8]">Link</span>
          </span>
        </a>

        <nav
          className={`hidden items-center font-semibold text-[#07135d] md:flex ${
            compact ? 'gap-7 text-[15px] lg:gap-9' : 'gap-9 text-[20px] lg:gap-12'
          }`}
          aria-label="Основна навигация"
        >
          {links.map((link) => (
            <a
              key={link.page}
              href={link.href}
              className={`transition hover:text-[#13B5C8] ${
                activePage === link.page ? 'text-[#0D2E8B]' : ''
              }`}
            >
              {link.label}
            </a>
          ))}
          <LikedNavLink
            active={activePage === 'liked'}
            likedCount={likedCount}
          />
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {currentUser ? (
            <>
              <a
                href={
                  currentUser.role === 'doctor'
                    ? '#/doctor/dashboard'
                    : currentUser.role === 'admin'
                      ? '#/admin'
                      : '#/profile'
                }
                className={`inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#075bdc] font-semibold leading-none text-white shadow-[0_10px_22px_rgba(7,91,220,0.22)] transition hover:bg-[#13B5C8] ${
                  compact
                    ? 'h-10 px-3 text-[13px] sm:px-4'
                    : 'h-[52px] px-5 text-[18px] md:h-[56px] md:min-w-[144px] md:text-[24px]'
                }`}
              >
                <UserRound className="h-4 w-4" aria-hidden="true" />
                <span>{currentUser.role === 'doctor' ? 'Табло' : 'Профил'}</span>
              </a>
              <button
                type="button"
                className="hidden h-10 rounded-[10px] border border-[#DCE5F0] px-3 text-[13px] font-bold text-[#0D2E8B] transition hover:border-[#13B5C8] hover:text-[#087F91] sm:inline-flex sm:items-center"
                onClick={onLogout}
              >
                Изход
              </button>
            </>
          ) : (
            <a
              href="#/login"
              className={`inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#075bdc] font-semibold leading-none text-white shadow-[0_10px_22px_rgba(7,91,220,0.22)] transition hover:bg-[#13B5C8] ${
                compact
                  ? 'h-10 px-3 text-[13px] sm:px-4'
                  : 'h-[52px] px-5 text-[18px] md:h-[56px] md:min-w-[144px] md:text-[24px]'
              }`}
            >
              {compact ? <UserRound className="h-4 w-4" aria-hidden="true" /> : null}
              <span>Вход</span>
            </a>
          )}

          <button
            type="button"
            className="inline-grid h-10 w-10 place-items-center rounded-[10px] border border-[#DCE5F0] text-[#0D2E8B] transition hover:border-[#13B5C8] hover:text-[#13B5C8] md:hidden"
            aria-label="Меню"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
          >
            {isOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {isOpen ? (
        <nav
          className="grid gap-2 border-t border-[#E1E8F3] bg-white px-4 py-3 text-[14px] font-bold text-[#0D2E8B] md:hidden"
          aria-label="Мобилна навигация"
        >
          {links.map((link) => (
            <a
              key={link.page}
              href={link.href}
              className="rounded-[10px] px-3 py-2 transition hover:bg-[#EAFBFD] hover:text-[#087F91]"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <LikedNavLink
            active={activePage === 'liked'}
            likedCount={likedCount}
            onClick={() => setIsOpen(false)}
          />
          {currentUser ? (
            <button
              type="button"
              className="rounded-[10px] px-3 py-2 text-left transition hover:bg-[#EAFBFD] hover:text-[#087F91]"
              onClick={() => {
                setIsOpen(false)
                onLogout?.()
              }}
            >
              Изход
            </button>
          ) : (
            <a
              href="#/register"
              className="rounded-[10px] px-3 py-2 transition hover:bg-[#EAFBFD] hover:text-[#087F91]"
              onClick={() => setIsOpen(false)}
            >
              Регистрация
            </a>
          )}
        </nav>
      ) : null}
    </header>
  )
}
