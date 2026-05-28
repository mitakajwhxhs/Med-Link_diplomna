import { useState } from 'react'
import { Stethoscope, UserRound } from 'lucide-react'
import Navbar from '../components/Navbar'
import RegisterDoctorForm from '../components/RegisterDoctorForm'
import RegisterPatientForm from '../components/RegisterPatientForm'

export default function RegisterPage({
  likedCount = 0,
  mode = 'choice',
  onRegisterPatient,
  onRegisterDoctor,
}) {
  const [selectedMode, setSelectedMode] = useState(
    mode === 'doctor' || mode === 'patient' ? mode : 'choice',
  )

  return (
    <main className="min-h-screen bg-[#F5F8FC] text-[#0D2E8B]">
      <Navbar activePage="register" compact likedCount={likedCount} />

      <section className="mx-auto max-w-[1120px] px-5 py-8 sm:px-8 sm:py-10 xl:px-0">
        <div className="max-w-[760px]">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#EAFBFD] px-3 py-1 text-[12px] font-extrabold uppercase text-[#087F91]">
            <UserRound className="h-4 w-4" />
            Регистрация
          </span>
          <h1 className="mt-5 text-[30px] font-extrabold leading-tight text-[#0D2E8B] sm:text-[38px] md:text-[52px]">
            Изберете какъв профил искате да създадете.
          </h1>
        </div>

        {selectedMode === 'choice' ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <button
              type="button"
              className="rounded-[18px] border border-[#E1E8F3] bg-white p-5 text-left shadow-[0_18px_42px_rgba(13,46,139,0.08)] transition hover:-translate-y-1 hover:border-[#13B5C8] sm:p-7"
              onClick={() => setSelectedMode('patient')}
            >
              <UserRound className="h-10 w-10 text-[#13B5C8]" />
              <h2 className="mt-5 text-[22px] font-extrabold text-[#0D2E8B] sm:text-[26px]">
                Регистрация като пациент
              </h2>
              <p className="mt-3 text-[15px] font-semibold leading-7 text-[#526383]">
                Търсене на лекари, харесани профили, запазване на часове и напомняния.
              </p>
            </button>

            <button
              type="button"
              className="rounded-[18px] border border-[#13B5C8] bg-white p-5 text-left shadow-[0_18px_42px_rgba(13,46,139,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(13,46,139,0.14)] sm:p-7"
              onClick={() => setSelectedMode('doctor')}
            >
              <Stethoscope className="h-10 w-10 text-[#13B5C8]" />
              <h2 className="mt-5 text-[22px] font-extrabold text-[#0D2E8B] sm:text-[26px]">
                Регистрация като лекар
              </h2>
              <p className="mt-3 text-[15px] font-semibold leading-7 text-[#526383]">
                Лекарски dashboard, обяви, заявки, пациенти и анализи.
              </p>
            </button>
          </div>
        ) : (
          <section className="mt-8 rounded-[18px] border border-[#E1E8F3] bg-white p-5 shadow-[0_18px_42px_rgba(13,46,139,0.09)] md:p-7">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[24px] font-extrabold text-[#0D2E8B] sm:text-[28px]">
                  {selectedMode === 'doctor'
                    ? 'Лекарска регистрация'
                    : 'Пациентска регистрация'}
                </h2>
                <p className="mt-1 text-[14px] font-semibold text-[#697894]">
                  След регистрация ще изпратим 6-цифрен код за потвърждение на имейла.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-full items-center justify-center rounded-[10px] border border-[#DCE5F0] px-4 text-[13px] font-bold text-[#0D2E8B] transition hover:border-[#13B5C8] hover:text-[#087F91] sm:w-auto"
                onClick={() => setSelectedMode('choice')}
              >
                Смени типа
              </button>
            </div>

            {selectedMode === 'doctor' ? (
              <RegisterDoctorForm onRegister={onRegisterDoctor} />
            ) : (
              <RegisterPatientForm onRegister={onRegisterPatient} />
            )}
          </section>
        )}
      </section>
    </main>
  )
}
