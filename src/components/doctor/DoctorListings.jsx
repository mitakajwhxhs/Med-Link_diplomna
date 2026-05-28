import { Eye, MapPin, Pencil, Trash2, Video } from 'lucide-react'
import { getListingDoctorId } from '../../utils/publicDoctors'
import { formatEuroPrice } from '../../utils/currency'

export default function DoctorListings({
  listings = [],
  onEditListing,
  onDeleteListing,
}) {
  return (
    <section className="rounded-[16px] border border-[#E1E8F3] bg-white p-5 shadow-[0_16px_35px_rgba(13,46,139,0.07)] md:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[24px] font-extrabold text-[#0D2E8B]">
            Моите обяви
          </h2>
          <p className="mt-1 text-[14px] font-semibold text-[#697894]">
            Чернови и публикувани профилни публикации.
          </p>
        </div>
        <span className="rounded-full bg-[#EAFBFD] px-3 py-1 text-[12px] font-extrabold text-[#087F91]">
          {listings.length}/2 обяви
        </span>
      </div>

      <div className="mt-5 grid gap-4">
        {listings.length > 0 ? (
          listings.map((listing) => {
            const publicDoctorId =
              listing.publicDoctorId || getListingDoctorId(listing.id)

            return (
              <article
                key={listing.id}
                className="grid gap-4 rounded-[14px] border border-[#E1E8F3] bg-[#FAFCFF] p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[18px] font-extrabold text-[#0D2E8B]">
                      {listing.title}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase ${
                        listing.status === 'published'
                          ? 'bg-[#EAF8EF] text-[#16884A]'
                          : 'bg-[#F0F5FC] text-[#697894]'
                      }`}
                    >
                      {listing.status === 'published' ? 'Публикувана' : 'Чернова'}
                    </span>
                  </div>
                  <p className="mt-1 text-[14px] font-bold text-[#13B5C8]">
                    {listing.specialty}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3 text-[12px] font-semibold text-[#526383]">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-[#0D2E8B]" />
                      {listing.location}
                    </span>
                    <span>{formatEuroPrice(listing.price)}</span>
                    {listing.online ? (
                      <span className="inline-flex items-center gap-1 text-[#16884A]">
                        <Video className="h-4 w-4" />
                        Онлайн консултация
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 md:justify-end">
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[#DCE5F0] bg-white px-4 text-[12px] font-extrabold text-[#0D2E8B] transition hover:border-[#13B5C8] hover:text-[#087F91]"
                    onClick={() => onEditListing?.(listing)}
                  >
                    <Pencil className="h-4 w-4" />
                    Редакция
                  </button>

                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[#F7C6C2] bg-white px-4 text-[12px] font-extrabold text-[#B42318] transition hover:border-[#F04438] hover:bg-[#FFF3F2]"
                    onClick={() => onDeleteListing?.(listing)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Изтрий
                  </button>

                  {listing.status === 'published' ? (
                    <a
                      href={`#/doctors/${publicDoctorId}`}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-[#13B5C8] px-4 text-[12px] font-extrabold text-white transition hover:bg-[#0D2E8B]"
                    >
                      <Eye className="h-4 w-4" />
                      Преглед
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex h-10 cursor-not-allowed items-center justify-center gap-2 rounded-[10px] bg-[#9AA7C2] px-4 text-[12px] font-extrabold text-white"
                      disabled
                    >
                      <Eye className="h-4 w-4" />
                      Чернова
                    </button>
                  )}
                </div>
              </article>
            )
          })
        ) : (
          <div className="rounded-[14px] bg-[#FAFCFF] p-6 text-center">
            <h3 className="text-[20px] font-extrabold text-[#0D2E8B]">
              Все още няма обяви
            </h3>
            <p className="mt-2 text-[14px] font-semibold text-[#697894]">
              Създайте първата си обява от бутона „Създай обява“.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
