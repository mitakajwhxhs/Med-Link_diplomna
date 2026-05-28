import {
  BarChart3,
  Bell,
  CalendarDays,
  ClipboardList,
  Crown,
  FilePlus2,
  FileText,
  Home,
  LogOut,
  Settings,
  UsersRound,
  Video,
} from 'lucide-react'

const navItems = [
  { id: 'overview', label: 'Моето табло', icon: Home },
  { id: 'create', label: 'Създай обява', icon: FilePlus2 },
  { id: 'listings', label: 'Моите обяви', icon: ClipboardList },
  { id: 'requests', label: 'Прегледи/заявки', icon: CalendarDays },
  { id: 'consultations', label: 'Онлайн консултации', icon: Video },
  { id: 'patients', label: 'Пациенти', icon: UsersRound },
  { id: 'history', label: 'Медицинска история', icon: FileText },
  { id: 'analytics', label: 'Анализи', icon: BarChart3 },
  { id: 'subscription', label: 'MedLink Plus', icon: Crown },
  { id: 'reminders', label: 'Напомняния', icon: Bell },
  { id: 'settings', label: 'Настройки', icon: Settings },
]

export default function DoctorSidebar({ activeView, onViewChange, onLogout }) {
  return (
    <aside className="doctor-dashboard-sidebar border-r border-[#DCE5F0] bg-white">
      <div className="sticky top-0 flex min-h-screen flex-col px-4 py-5">
        <a href="#/" className="mb-6 flex items-center gap-2 px-2">
          <svg className="h-9 w-9 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
            <rect x="18" y="3" width="12" height="42" rx="6" fill="#0D2E8B" />
            <rect x="3" y="18" width="42" height="12" rx="6" fill="#13B5C8" />
            <circle cx="24" cy="24" r="7" fill="#0D91B8" />
          </svg>
          <span className="text-[22px] font-extrabold text-[#0D2E8B]">
            Med<span className="text-[#13B5C8]">Link</span>
          </span>
        </a>

        <nav className="grid gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = activeView === item.id

            return (
              <button
                key={item.id}
                type="button"
                className={`flex items-center gap-3 rounded-[10px] px-3 py-3 text-left text-[13px] font-extrabold transition ${
                  active
                    ? 'bg-[#EAFBFD] text-[#087F91]'
                    : 'text-[#0D2E8B] hover:bg-[#F5F7FB] hover:text-[#087F91]'
                }`}
                onClick={() => onViewChange(item.id)}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <button
          type="button"
          className="mt-auto flex items-center gap-3 rounded-[10px] px-3 py-3 text-left text-[13px] font-extrabold text-[#697894] transition hover:bg-[#F5F7FB] hover:text-[#0D2E8B]"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Изход
        </button>
      </div>
    </aside>
  )
}
