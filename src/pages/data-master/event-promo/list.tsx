import Button from '@mui/material/Button'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductCategoryOptions } from '../../../api/productCategory'
import PromoTableRow from '../../../components/data-master/event-promo/PromoTableRow'
import ConfirmDeleteModal from '../../../components/global/ConfirmDeleteModal'
import DashboardLayout from '../../../components/global/DashboardLayout'
import FilterDropdown, { type FilterDropdownOption } from '../../../components/global/FilterDropdown'
import Pagination from '../../../components/global/Pagination'
import DynamicLucideIcon from '../../../icon/DynamicLucideIcon'
import PlusIcon from '../../../icon/PlusIcon'
import { usePromoStore } from '../../../store/promoStore'
import { PROMO_STATUS_LABEL, type Promo, type PromoStatus } from './types'

const PAGE_SIZE = 10
const CREATE_PATH = '/data-master/event-promo/create'

const STATUS_OPTIONS: FilterDropdownOption<PromoStatus>[] = (
    Object.keys(PROMO_STATUS_LABEL) as PromoStatus[]
).map((value) => ({ value, label: PROMO_STATUS_LABEL[value] }))

export default function EventPromoList() {
    const navigate = useNavigate()
    const promos = usePromoStore((state) => state.promos)
    const removePromo = usePromoStore((state) => state.removePromo)

    const categoryOptions = useProductCategoryOptions()

    const [search, setSearch] = useState('')
    const [categoryId, setCategoryId] = useState<string | null>(null)
    const [status, setStatus] = useState<PromoStatus | null>(null)
    const [page, setPage] = useState(1)
    const [promoToDelete, setPromoToDelete] = useState<Promo | null>(null)

    const countByStatus = (target: PromoStatus) => promos.filter((promo) => promo.status === target).length

    // Promo products are snapshots that keep the category name, so match on the selected category's name
    const categoryName = categoryOptions.find((option) => option.value === categoryId)?.label

    const filteredPromos = promos.filter((promo) => {
        const keyword = search.trim().toLowerCase()
        if (keyword && !promo.name.toLowerCase().includes(keyword)) return false
        if (categoryName && !promo.products.some((product) => product.category === categoryName)) return false
        if (status && promo.status !== status) return false
        return true
    })

    const totalPages = Math.max(1, Math.ceil(filteredPromos.length / PAGE_SIZE))
    const currentPage = Math.min(page, totalPages)
    const pageStartIndex = (currentPage - 1) * PAGE_SIZE
    const pagePromos = filteredPromos.slice(pageStartIndex, pageStartIndex + PAGE_SIZE)
    const rangeStart = pagePromos.length === 0 ? 0 : pageStartIndex + 1
    const rangeEnd = rangeStart === 0 ? 0 : pageStartIndex + pagePromos.length

    const handleConfirmDelete = () => {
        if (!promoToDelete) return
        removePromo(promoToDelete.id)
        setPromoToDelete(null)
    }

    return (
        <DashboardLayout pageTitle="Promo & Event">
            <div className="flex w-full flex-col gap-5 px-7 pt-6 pb-4">
                <div className="flex w-full items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold leading-[1.2] text-[#20242d]">Promo &amp; Event</h1>
                        <p className="text-sm leading-[1.4] text-[#6a7789]">
                            Buat dan kelola promo, voucher, serta kampanye diskon
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="contained"
                        onClick={() => navigate(CREATE_PATH)}
                        startIcon={<PlusIcon size={18} className="text-[#fdfeff]" />}
                        sx={{
                            height: '40px',
                            bgcolor: '#4e5bd6',
                            color: '#fdfeff',
                            textTransform: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            boxShadow: 'none',
                            '&:hover': { bgcolor: '#3f4bc0', boxShadow: 'none' },
                        }}
                    >
                        Tambah Promo
                    </Button>
                </div>

                <div className="flex w-full items-center gap-3">
                    <div className="flex flex-1 items-center gap-2 rounded-xl border border-[#e9e9ea] bg-white p-3">
                        <DynamicLucideIcon name="search" size={18} className="text-[#8f99a7]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                setPage(1)
                            }}
                            placeholder="Cari nama promo...."
                            className="w-full text-sm text-[#20242d] placeholder:text-[#8f99a7] focus:outline-none"
                        />
                    </div>

                    <FilterDropdown
                        allLabel="Semua Kategori"
                        searchPlaceholder="Cari kategori..."
                        options={categoryOptions}
                        value={categoryId}
                        onChange={(value) => {
                            setCategoryId(value)
                            setPage(1)
                        }}
                    />

                    <FilterDropdown
                        allLabel="Semua Status"
                        options={STATUS_OPTIONS}
                        value={status}
                        onChange={(value) => {
                            setStatus(value)
                            setPage(1)
                        }}
                    />
                </div>

                <div className="flex w-full flex-wrap items-center gap-2">
                    <p className="text-sm leading-[1.4] font-medium whitespace-nowrap text-[#4e5bd6]">
                        {promos.length} Promo
                    </p>
                    <span className="size-[5px] shrink-0 rounded-full bg-[#d0d5dc]" />
                    <p className="text-sm leading-[1.4] font-medium whitespace-nowrap text-[#1fa971]">
                        {countByStatus('active')} Aktif
                    </p>
                    <span className="size-[5px] shrink-0 rounded-full bg-[#d0d5dc]" />
                    <p className="text-sm leading-[1.4] font-medium whitespace-nowrap text-[#8066b5]">
                        {countByStatus('scheduled')} Terjadwal
                    </p>
                    <span className="size-[5px] shrink-0 rounded-full bg-[#d0d5dc]" />
                    <p className="text-sm leading-[1.4] font-medium whitespace-nowrap text-[#268f89]">
                        {countByStatus('finished')} Selesai
                    </p>
                    <span className="size-[5px] shrink-0 rounded-full bg-[#d0d5dc]" />
                    <p className="text-sm leading-[1.4] font-medium whitespace-nowrap text-[#94a3b8]">
                        {countByStatus('inactive')} Nonaktif
                    </p>
                </div>

                <div className="w-full overflow-x-auto rounded-xl border border-[#ebedf1] bg-white">
                    <div className="flex min-w-[960px] flex-col items-start">
                        <div className="flex h-11 w-full items-center border-b border-[#ebedf1] bg-[#fbfcfe]">
                            <p className="min-w-0 flex-1 pr-6 pl-4 text-xs leading-[1.4] font-medium text-[#797c81]">Promo</p>
                            <p className="w-[236px] shrink-0 text-xs leading-[1.4] font-medium text-[#797c81]">Produk</p>
                            <p className="w-[136px] shrink-0 text-xs leading-[1.4] font-medium text-[#797c81]">Diskon</p>
                            <p className="w-[196px] shrink-0 text-xs leading-[1.4] font-medium text-[#797c81]">Periode</p>
                            <p className="w-[160px] shrink-0 text-xs leading-[1.4] font-medium text-[#797c81]">Status</p>
                            <p className="w-[84px] shrink-0 text-xs leading-[1.4] font-medium text-[#797c81]">Aksi</p>
                        </div>

                        {pagePromos.length === 0 && (
                            <p className="w-full py-10 text-center text-sm text-[#8f99a7]">
                                Tidak ada promo ditemukan
                            </p>
                        )}

                        {pagePromos.map((promo, index) => (
                            <PromoTableRow
                                key={promo.id}
                                promo={promo}
                                isAlternate={index % 2 === 1}
                                onEdit={() => navigate(`/data-master/event-promo/${promo.id}/update`)}
                                onDelete={() => setPromoToDelete(promo)}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex w-full items-center justify-between pt-1">
                    <p className="text-[13px] leading-[normal] whitespace-nowrap text-[#6a7789]">
                        Menampilkan {rangeStart}–{rangeEnd} dari {filteredPromos.length} promo &amp; event
                    </p>

                    <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
                </div>
            </div>

            <ConfirmDeleteModal
                open={promoToDelete !== null}
                itemName={promoToDelete?.name ?? ''}
                entityLabel="promo"
                description={
                    <>
                        Promo <span className="font-medium">{promoToDelete?.name}</span> akan dihapus
                        secara permanen, tindakan ini tidak dapat dibatalkan.
                    </>
                }
                onCancel={() => setPromoToDelete(null)}
                onConfirm={handleConfirmDelete}
            />
        </DashboardLayout>
    )
}
