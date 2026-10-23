import Button from '@mui/material/Button'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeletePromo, usePromos, useUpdatePromoStatus, type Promo } from '../../../api/promo'
import PromoDetailDrawer from '../../../components/data-master/event-promo/PromoDetailDrawer'
import PromoTableRow from '../../../components/data-master/event-promo/PromoTableRow'
import ConfirmDeleteModal from '../../../components/global/ConfirmDeleteModal'
import DashboardLayout from '../../../components/global/DashboardLayout'
import FilterDropdown, { type FilterDropdownOption } from '../../../components/global/FilterDropdown'
import Pagination from '../../../components/global/Pagination'
import DynamicLucideIcon from '../../../icon/DynamicLucideIcon'
import PageHeader from '../../../components/global/PageHeader'
import { PROMO_STATUSES, type PromoStatus } from './types'

const PAGE_SIZE = 10
const CREATE_PATH = '/data-master/event-promo/create'

const STATUS_OPTIONS: FilterDropdownOption<PromoStatus>[] = PROMO_STATUSES.map((value) => ({
    value,
    label: value,
}))

export default function EventPromoList() {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState<PromoStatus | null>(null)
    const [page, setPage] = useState(1)
    const [promoToDelete, setPromoToDelete] = useState<Promo | null>(null)
    const [promoToView, setPromoToView] = useState<Promo | null>(null)

    const { data, isLoading } = usePromos({
        search: search.trim() || undefined,
        filter: status ? [{ key: 'status', operator: 'equal', value: status }] : [],
        sort: 'created_at',
        order: 'desc',
        page,
        limit: PAGE_SIZE,
    })

    const promos = data?.data ?? []

    const deletePromoMutation = useDeletePromo()
    const updatePromoStatusMutation = useUpdatePromoStatus()

    const handleConfirmDelete = () => {
        if (!promoToDelete) return
        deletePromoMutation.mutate(promoToDelete.id, {
            onSuccess: () => {
                setPromoToDelete(null)
                setPromoToView((current) => (current?.id === promoToDelete.id ? null : current))
            },
        })
    }

    const handleDeactivate = (promo: Promo) => {
        updatePromoStatusMutation.mutate(
            {
                id: promo.id,
                status: 'Nonaktif',
                // The API needs the product list on every update, so send the current one unchanged
                products: promo.products.map((product) => ({
                    id: product.id,
                    promo_discount: product.promo_discount === null ? null : Number(product.promo_discount),
                })),
            },
            {
                // The API returns the promo with its new status, so the open drawer stays in sync
                onSuccess: (response) => setPromoToView(response.data),
            },
        )
    }

    const totalPages = data?.meta.total_pages ?? 1
    const currentPage = data?.meta.page ?? page
    const rangeStart = promos.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
    const rangeEnd = rangeStart === 0 ? 0 : rangeStart + promos.length - 1

    return (
        <DashboardLayout pageTitle="Promo & Event">
            <div className="flex w-full flex-col gap-5 px-7 pt-6 pb-4">
                <PageHeader
                    title="Promo & Event"
                    description="Buat dan kelola promo, voucher, serta kampanye diskon"
                    actionLabel="Tambah Promo"
                    onAction={() => navigate(CREATE_PATH)}
                />

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
                        {data?.total_promo ?? 0} Promo
                    </p>
                    <span className="size-[5px] shrink-0 rounded-full bg-[#d0d5dc]" />
                    <p className="text-sm leading-[1.4] font-medium whitespace-nowrap text-[#1fa971]">
                        {data?.total_aktif ?? 0} Aktif
                    </p>
                    <span className="size-[5px] shrink-0 rounded-full bg-[#d0d5dc]" />
                    <p className="text-sm leading-[1.4] font-medium whitespace-nowrap text-[#8066b5]">
                        {data?.total_terjadwal ?? 0} Terjadwal
                    </p>
                    <span className="size-[5px] shrink-0 rounded-full bg-[#d0d5dc]" />
                    <p className="text-sm leading-[1.4] font-medium whitespace-nowrap text-[#268f89]">
                        {data?.total_selesai ?? 0} Selesai
                    </p>
                    <span className="size-[5px] shrink-0 rounded-full bg-[#d0d5dc]" />
                    <p className="text-sm leading-[1.4] font-medium whitespace-nowrap text-[#94a3b8]">
                        {data?.total_nonaktif ?? 0} Nonaktif
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

                        {!isLoading && promos.length === 0 && (
                            <p className="w-full py-10 text-center text-sm text-[#8f99a7]">
                                Tidak ada promo ditemukan
                            </p>
                        )}

                        {promos.map((promo, index) => (
                            <PromoTableRow
                                key={promo.id}
                                promo={promo}
                                isAlternate={index % 2 === 1}
                                onEdit={() => navigate(`/data-master/event-promo/${promo.id}/update`)}
                                onViewDetail={() => setPromoToView(promo)}
                                onDelete={() => setPromoToDelete(promo)}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex w-full items-center justify-between pt-1">
                    <p className="text-[13px] leading-[normal] whitespace-nowrap text-[#6a7789]">
                        Menampilkan {rangeStart}–{rangeEnd} dari {data?.meta.total ?? 0} promo &amp; event
                    </p>

                    <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
                </div>
            </div>

            <PromoDetailDrawer
                promo={promoToView}
                isDeactivating={updatePromoStatusMutation.isPending}
                onClose={() => setPromoToView(null)}
                onDeactivate={() => promoToView && handleDeactivate(promoToView)}
                onEdit={() => promoToView && navigate(`/data-master/event-promo/${promoToView.id}/update`)}
            />

            <ConfirmDeleteModal
                open={promoToDelete !== null}
                itemName={promoToDelete?.name ?? ''}
                entityLabel="promo"
                description={
                    <>
                        <span className="font-medium">{promoToDelete?.name} </span>
                        akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
                    </>
                }
                onCancel={() => setPromoToDelete(null)}
                isLoading={deletePromoMutation.isPending}
                onConfirm={handleConfirmDelete}
            />
        </DashboardLayout>
    )
}
