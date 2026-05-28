import { Heart } from 'lucide-react'
import { useMemo, useState } from 'react'
import DoctorCard from '../components/DoctorCard'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Pagination from '../components/Pagination'
import { doctors } from '../data/doctors'

const doctorsPerPage = 3

export default function LikedPage({
  likedDoctorIds = [],
  reminderDoctorIds = [],
  onToggleLike,
  onRemind,
  likedCount = 0,
  currentUser,
  onLogout,
  doctorsList = doctors,
}) {
  const [currentPage, setCurrentPage] = useState(1)

  const likedDoctors = useMemo(
    () => doctorsList.filter((doctor) => likedDoctorIds.includes(doctor.id)),
    [doctorsList, likedDoctorIds],
  )

  const totalPages = Math.ceil(likedDoctors.length / doctorsPerPage)
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1))
  const visibleDoctors = likedDoctors.slice(
    (safeCurrentPage - 1) * doctorsPerPage,
    safeCurrentPage * doctorsPerPage,
  )

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-[#F5F7FB] text-[#0D2E8B]">
      <Navbar
        activePage="liked"
        compact
        likedCount={likedCount}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <section className="mx-auto max-w-[980px] px-5 pb-10 pt-7 sm:px-8 xl:px-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#EAFBFD] px-3 py-1 text-[12px] font-extrabold uppercase text-[#087F91]">
              <Heart className="h-4 w-4 fill-[#13B5C8] text-[#13B5C8]" />
              Харесани
            </span>
            <h1 className="mt-3 text-[32px] font-extrabold leading-tight text-[#0D2E8B] md:text-[40px]">
              Харесани лекари
            </h1>
          </div>
          <p className="text-[15px] font-bold text-[#526383]">
            Общо: <span className="text-[#0D2E8B]">{likedDoctors.length}</span>
          </p>
        </div>

        {likedDoctors.length === 0 ? (
          <section className="mt-8 rounded-[18px] border border-[#E1E8F3] bg-white p-8 text-center shadow-[0_18px_42px_rgba(13,46,139,0.09)]">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-[16px] bg-[#EAFBFD] text-[#13B5C8]">
              <Heart className="h-8 w-8" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-[24px] font-extrabold text-[#0D2E8B]">
              Все още няма харесани лекари
            </h2>
            <p className="mx-auto mt-2 max-w-[520px] text-[15px] font-semibold leading-6 text-[#526383]">
              Натиснете сърцето върху обява на лекар, за да я запазите тук.
            </p>
            <a
              href="#/doctors"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-[12px] bg-[#13B5C8] px-6 text-[15px] font-extrabold text-white shadow-[0_14px_28px_rgba(19,181,200,0.24)] transition hover:bg-[#0D2E8B]"
            >
              Към лекарите
            </a>
          </section>
        ) : (
          <>
            <div className="mt-8 grid gap-5">
              {visibleDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  isLiked={likedDoctorIds.includes(doctor.id)}
                  isReminderSet={reminderDoctorIds.includes(doctor.id)}
                  onToggleLike={onToggleLike}
                  onRemind={onRemind}
                />
              ))}
            </div>

            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>

      <Footer />
    </main>
  )
}
