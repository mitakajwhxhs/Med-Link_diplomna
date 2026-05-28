import {
  CalendarCheck2,
  FileText,
  ShieldCheck,
  Stethoscope,
  Trash2,
  UserCog,
  UsersRound,
} from 'lucide-react'
import { formatEuroPrice } from '../utils/currency'

const roles = ['patient', 'doctor', 'admin']

export default function AdminPage({
  user,
  users = [],
  doctors = [],
  listings = [],
  appointments = [],
  onChangeUserRole,
  onDeleteUser,
  onDeleteDoctor,
  onDeleteListing,
  onLogout,
}) {
  const confirmDeleteUser = (targetUser) => {
    const confirmed = window.confirm(
      `Delete user "${targetUser.name}" and related data?`,
    )

    if (confirmed) onDeleteUser?.(targetUser)
  }

  const confirmDeleteDoctor = (doctor) => {
    const confirmed = window.confirm(
      `Remove doctor "${doctor.name}" from the public doctors page?`,
    )

    if (confirmed) onDeleteDoctor?.(doctor)
  }

  const confirmDeleteListing = (listing) => {
    const confirmed = window.confirm(`Delete listing "${listing.title}"?`)

    if (confirmed) onDeleteListing?.(listing)
  }

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-5 py-6 text-[#0D2E8B] sm:px-8">
      <section className="mx-auto max-w-[1320px]">
        <header className="flex flex-col gap-4 rounded-[18px] border border-[#E1E8F3] bg-white p-5 shadow-[0_18px_42px_rgba(13,46,139,0.08)] md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-[16px] bg-[#EAFBFD] text-[#13B5C8]">
              <ShieldCheck className="h-7 w-7" />
            </span>
            <div>
              <p className="text-[13px] font-extrabold uppercase text-[#13B5C8]">
                MedLink Admin
              </p>
              <h1 className="mt-1 text-[30px] font-extrabold md:text-[38px]">
                Control Center
              </h1>
              <p className="mt-1 text-[14px] font-semibold text-[#697894]">
                Logged in as {user.name} · full app control
              </p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-[12px] bg-[#13B5C8] px-5 text-[14px] font-extrabold text-white transition hover:bg-[#0D2E8B]"
            onClick={onLogout}
          >
            Logout
          </button>
        </header>

        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <StatCard icon={UsersRound} label="Users" value={users.length} />
          <StatCard icon={Stethoscope} label="Doctors" value={doctors.length} />
          <StatCard icon={FileText} label="Listings" value={listings.length} />
          <StatCard
            icon={CalendarCheck2}
            label="Appointments"
            value={appointments.length}
          />
        </div>

        <div className="mt-5 grid gap-5">
          <AdminSection title="Users and Roles" icon={UserCog}>
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2 text-left">
                <thead>
                  <tr className="text-[12px] font-extrabold uppercase text-[#697894]">
                    <th className="px-3 py-2">User</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Role</th>
                    <th className="px-3 py-2">Phone</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((targetUser) => {
                    const isSelf = targetUser.id === user.id

                    return (
                      <tr
                        key={targetUser.id}
                        className="rounded-[12px] bg-[#FAFCFF] text-[14px] font-bold text-[#40517A]"
                      >
                        <td className="rounded-l-[12px] px-3 py-3 text-[#0D2E8B]">
                          {targetUser.name}
                          {isSelf ? (
                            <span className="ml-2 rounded-full bg-[#EAFBFD] px-2 py-1 text-[10px] font-extrabold uppercase text-[#087F91]">
                              You
                            </span>
                          ) : null}
                        </td>
                        <td className="px-3 py-3">{targetUser.email}</td>
                        <td className="px-3 py-3">
                          <select
                            className="h-10 rounded-[10px] border border-[#DCE5F0] bg-white px-3 text-[13px] font-extrabold text-[#0D2E8B] outline-none focus:border-[#13B5C8] disabled:opacity-60"
                            value={targetUser.role}
                            disabled={isSelf}
                            onChange={(event) =>
                              onChangeUserRole?.(targetUser.id, event.target.value)
                            }
                          >
                            {roles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-3">{targetUser.phone || '-'}</td>
                        <td className="rounded-r-[12px] px-3 py-3 text-right">
                          <button
                            type="button"
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[#F7C6C2] bg-white px-4 text-[12px] font-extrabold text-[#B42318] transition hover:border-[#F04438] hover:bg-[#FFF3F2] disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={isSelf}
                            onClick={() => confirmDeleteUser(targetUser)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </AdminSection>

          <AdminSection title="Public Doctors" icon={Stethoscope}>
            <div className="grid gap-3">
              {doctors.map((doctor) => (
                <article
                  key={doctor.id}
                  className="grid gap-3 rounded-[14px] border border-[#E1E8F3] bg-[#FAFCFF] p-4 md:grid-cols-[64px_minmax(0,1fr)_auto] md:items-center"
                >
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-[17px] font-extrabold text-[#0D2E8B]">
                      {doctor.name}
                    </h3>
                    <p className="mt-1 text-[13px] font-bold text-[#13B5C8]">
                      {doctor.specialty} · {doctor.city}
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-[#697894]">
                      {doctor.sourceListingId ? 'Doctor listing' : 'Base doctor'}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[#F7C6C2] bg-white px-4 text-[12px] font-extrabold text-[#B42318] transition hover:border-[#F04438] hover:bg-[#FFF3F2]"
                    onClick={() => confirmDeleteDoctor(doctor)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </article>
              ))}
            </div>
          </AdminSection>

          <AdminSection title="Doctor Listings" icon={FileText}>
            <div className="grid gap-3">
              {listings.length > 0 ? (
                listings.map((listing) => (
                  <article
                    key={listing.id}
                    className="grid gap-3 rounded-[14px] border border-[#E1E8F3] bg-[#FAFCFF] p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[17px] font-extrabold text-[#0D2E8B]">
                          {listing.title}
                        </h3>
                        <span className="rounded-full bg-[#EAFBFD] px-2 py-1 text-[10px] font-extrabold uppercase text-[#087F91]">
                          {listing.status}
                        </span>
                      </div>
                      <p className="mt-1 text-[13px] font-bold text-[#13B5C8]">
                        {listing.doctorName || 'Doctor'} · {listing.specialty}
                      </p>
                      <p className="mt-1 text-[12px] font-semibold text-[#697894]">
                        {listing.location} · {formatEuroPrice(listing.price)}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[#F7C6C2] bg-white px-4 text-[12px] font-extrabold text-[#B42318] transition hover:border-[#F04438] hover:bg-[#FFF3F2]"
                      onClick={() => confirmDeleteListing(listing)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </article>
                ))
              ) : (
                <p className="rounded-[12px] bg-[#FAFCFF] p-5 text-center text-[14px] font-semibold text-[#697894]">
                  No doctor listings yet.
                </p>
              )}
            </div>
          </AdminSection>
        </div>
      </section>
    </main>
  )
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <article className="rounded-[16px] border border-[#E1E8F3] bg-white p-5 shadow-[0_16px_35px_rgba(13,46,139,0.07)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[13px] font-extrabold uppercase text-[#697894]">
            {label}
          </p>
          <p className="mt-2 text-[30px] font-extrabold text-[#0D2E8B]">
            {value}
          </p>
        </div>
        <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-[#EAFBFD] text-[#13B5C8]">
          <Icon className="h-6 w-6" />
        </span>
      </div>
    </article>
  )
}

function AdminSection({ title, icon: Icon, children }) {
  return (
    <section className="rounded-[18px] border border-[#E1E8F3] bg-white p-5 shadow-[0_18px_42px_rgba(13,46,139,0.08)]">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-[#13B5C8]" />
        <h2 className="text-[22px] font-extrabold text-[#0D2E8B]">
          {title}
        </h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}
