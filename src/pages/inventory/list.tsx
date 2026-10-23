import Button from '@mui/material/Button'
import { useState } from 'react'
import AccentSummaryCard from '../../components/global/AccentSummaryCard'
import DashboardLayout from '../../components/global/DashboardLayout'
import FilterDropdown, { type FilterDropdownOption } from '../../components/global/FilterDropdown'
import Pagination from '../../components/global/Pagination'
import InventoryTableRow from '../../components/inventory/InventoryTableRow'
import DynamicLucideIcon from '../../icon/DynamicLucideIcon'
import PlusIcon from '../../icon/PlusIcon'
import { DUMMY_INVENTORY } from './dummyData'
import { getInventoryStatus, INVENTORY_STATUSES, type InventoryStatus } from './types'

const PAGE_SIZE = 10

const toOptions = (values: string[]): FilterDropdownOption<string>[] =>
    [...new Set(values)].map((value) => ({ value, label: value }))

const BRANCH_OPTIONS = toOptions(DUMMY_INVENTORY.map((item) => item.branch))
const CATEGORY_OPTIONS = toOptions(DUMMY_INVENTORY.map((item) => item.category))
const STATUS_OPTIONS: FilterDropdownOption<InventoryStatus>[] = INVENTORY_STATUSES.map((value) => ({
    value,
    label: value,
}))

export default function InventoryList() {
    const [search, setSearch] = useState('')
    const [branch, setBranch] = useState<string | null>(null)
    const [category, setCategory] = useState<string | null>(null)
    const [status, setStatus] = useState<InventoryStatus | null>(null)
    const [page, setPage] = useState(1)

    const inventory = DUMMY_INVENTORY

    // The summary cards always cover the whole inventory, whatever the filters say
    const totalProducts = new Set(inventory.map((item) => item.productName)).size
    const totalStock = inventory.reduce((sum, item) => sum + item.stock, 0)
    const lowStockCount = inventory.filter((item) => getInventoryStatus(item) === 'Menipis').length
    const outOfStockCount = inventory.filter((item) => getInventoryStatus(item) === 'Habis').length

    const keyword = search.trim().toLowerCase()
    const filteredInventory = inventory.filter((item) => {
        if (keyword && !item.productName.toLowerCase().includes(keyword) && !item.sku.toLowerCase().includes(keyword)) {
            return false
        }
        if (branch && item.branch !== branch) return false
        if (category && item.category !== category) return false
        if (status && getInventoryStatus(item) !== status) return false
        return true
    })

    const totalPages = Math.max(1, Math.ceil(filteredInventory.length / PAGE_SIZE))
    const currentPage = Math.min(page, totalPages)
    const pageStartIndex = (currentPage - 1) * PAGE_SIZE
    const pageItems = filteredInventory.slice(pageStartIndex, pageStartIndex + PAGE_SIZE)
    const rangeStart = pageItems.length === 0 ? 0 : pageStartIndex + 1
    const rangeEnd = rangeStart === 0 ? 0 : pageStartIndex + pageItems.length

    // Downloads what the table currently shows (all pages of the active filters) as a CSV file
    const handleExport = () => {
        const rows = [
            ['Produk', 'Kategori', 'SKU', 'Cabang', 'Stok', 'Min. Stok', 'Status'],
            ...filteredInventory.map((item) => [
                item.productName,
                item.category,
                item.sku,
                item.branch,
                `${item.stock} ${item.unit}`,
                `${item.minStock} ${item.unit}`,
                getInventoryStatus(item),
            ]),
        ]
        const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')

        const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
        const link = document.createElement('a')
        link.href = url
        link.download = 'inventory.csv'
        link.click()
        URL.revokeObjectURL(url)
    }

    return (
        <DashboardLayout pageTitle="Inventory">
            <div className="flex w-full flex-col gap-5 px-7 pt-6 pb-4">
                <div className="flex w-full items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold leading-[1.2] text-[#20242d]">Inventory</h1>
                        <p className="text-sm leading-[1.4] text-[#6a7789]">
                            Pantau dan kelola ketersediaan stok produk di setiap cabang.
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="contained"
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
                        Tambah Stok
                    </Button>
                </div>

                <div className="grid w-full grid-cols-2 gap-4 lg:flex">
                    <AccentSummaryCard
                        label="Total Produk"
                        value={totalProducts.toLocaleString('id-ID')}
                        unit="Produk"
                        description="Produk dengan inventory aktif"
                        accentColor="#ced2ff"
                        iconBg="#dcdef7"
                        icon={<DynamicLucideIcon name="package" size={16} className="text-[#4e5bd6]" />}
                    />
                    <AccentSummaryCard
                        label="Stok Tersedia"
                        value={totalStock.toLocaleString('id-ID')}
                        unit="unit"
                        description="Total unit stok tersedia"
                        accentColor="#c1fffb"
                        iconBg="#e8f8f7"
                        icon={<DynamicLucideIcon name="layers" size={16} className="text-[#1a9e94]" />}
                    />
                    <AccentSummaryCard
                        label="Stok Menipis"
                        value={lowStockCount.toLocaleString('id-ID')}
                        unit="Produk"
                        description="Perlu segera diperhatikan"
                        accentColor="#ffeccf"
                        iconBg="#fff5e5"
                        icon={<DynamicLucideIcon name="triangle-alert" size={16} className="text-[#cb7b00]" />}
                    />
                    <AccentSummaryCard
                        label="Stok Habis"
                        value={outOfStockCount.toLocaleString('id-ID')}
                        unit="Produk"
                        description="Produk tidak tersedia"
                        accentColor="#ffd5d5"
                        iconBg="#fef2f2"
                        icon={<DynamicLucideIcon name="circle-x" size={16} className="text-[#d1293d]" />}
                    />
                </div>

                <div className="flex w-full items-stretch gap-3">
                    <div className="flex flex-1 items-center gap-2 rounded-xl border border-[#e9e9ea] bg-white p-3">
                        <DynamicLucideIcon name="search" size={18} className="text-[#8f99a7]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                setPage(1)
                            }}
                            placeholder="Cari produk atau SKU..."
                            className="w-full text-sm text-[#20242d] placeholder:text-[#8f99a7] focus:outline-none"
                        />
                    </div>

                    <FilterDropdown
                        allLabel="Semua Cabang"
                        options={BRANCH_OPTIONS}
                        value={branch}
                        onChange={(value) => {
                            setBranch(value)
                            setPage(1)
                        }}
                    />

                    <FilterDropdown
                        allLabel="Semua Kategori"
                        options={CATEGORY_OPTIONS}
                        value={category}
                        onChange={(value) => {
                            setCategory(value)
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

                    <button
                        type="button"
                        onClick={handleExport}
                        disabled={filteredInventory.length === 0}
                        className="flex shrink-0 items-center justify-center gap-1 rounded-lg border border-[#4e5bd6] bg-[#fdfeff] px-4 py-2 text-sm font-semibold whitespace-nowrap text-[#4e5bd6] hover:bg-[#f7f8fc] disabled:opacity-50"
                    >
                        <DynamicLucideIcon name="download" size={18} />
                        Export
                    </button>
                </div>

                <div className="w-full overflow-x-auto rounded-xl border border-[#ebedf1] bg-white">
                    <div className="flex min-w-[1000px] flex-col items-start">
                        <div className="flex h-[41px] w-full items-center gap-4 border-b border-[#ebedf1] bg-[#fafafb] px-4">
                            <p className="min-w-0 flex-1 text-xs leading-[1.4] font-medium text-[#797c81]">Produk</p>
                            <p className="w-24 shrink-0 text-xs leading-[1.4] font-medium text-[#797c81]">SKU</p>
                            <p className="w-[120px] shrink-0 text-xs leading-[1.4] font-medium text-[#797c81]">Cabang</p>
                            <p className="w-24 shrink-0 text-right text-xs leading-[1.4] font-medium text-[#797c81]">Stok</p>
                            <p className="w-22 shrink-0 text-right text-xs leading-[1.4] font-medium text-[#797c81]">Min. Stok</p>
                            <p className="w-[104px] shrink-0 text-xs leading-[1.4] font-medium text-[#797c81]">Status</p>
                            <p className="w-[132px] shrink-0 text-xs leading-[1.4] font-medium text-[#797c81]">
                                Terakhir Diperbarui
                            </p>
                            <p className="w-[100px] shrink-0 text-center text-xs leading-[1.4] font-medium text-[#797c81]">Aksi</p>
                        </div>

                        {pageItems.length === 0 && (
                            <p className="w-full py-10 text-center text-sm text-[#8f99a7]">Tidak ada inventory ditemukan</p>
                        )}

                        {pageItems.map((item, index) => (
                            <InventoryTableRow
                                key={item.id}
                                item={item}
                                isAlternate={index % 2 === 1}
                                onViewDetail={() => {}}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex w-full items-center justify-between pt-1">
                    <p className="text-[13px] leading-[normal] whitespace-nowrap text-[#6a7789]">
                        Menampilkan {rangeStart}–{rangeEnd} dari {filteredInventory.length} inventory
                    </p>

                    <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
                </div>
            </div>
        </DashboardLayout>
    )
}
