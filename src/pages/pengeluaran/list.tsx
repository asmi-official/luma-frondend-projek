import Button from '@mui/material/Button'
import { useState } from 'react'
import AccentSummaryCard from '../../components/global/AccentSummaryCard'
import DashboardLayout from '../../components/global/DashboardLayout'
import FilterDropdown, { type FilterDropdownOption } from '../../components/global/FilterDropdown'
import Pagination from '../../components/global/Pagination'
import ExpenseTableRow from '../../components/pengeluaran/ExpenseTableRow'
import DynamicLucideIcon from '../../icon/DynamicLucideIcon'
import PlusIcon from '../../icon/PlusIcon'
import { formatRupiah } from '../../utils/currency'
import { DUMMY_EXPENSES } from './dummyData'

const PAGE_SIZE = 10
const DEFAULT_PERIOD_DAYS = '30'

const PERIOD_OPTIONS: FilterDropdownOption<string>[] = [
    { value: '7', label: '7 Hari' },
    { value: '30', label: '30 Hari' },
    { value: '90', label: '90 Hari' },
]

const toOptions = (values: string[]): FilterDropdownOption<string>[] =>
    [...new Set(values)].map((value) => ({ value, label: value }))

const CATEGORY_OPTIONS = toOptions(DUMMY_EXPENSES.map((expense) => expense.category))
const BRANCH_OPTIONS = toOptions(DUMMY_EXPENSES.map((expense) => expense.branch))
const METHOD_OPTIONS = toOptions(DUMMY_EXPENSES.map((expense) => expense.paymentMethod))

const formatRupiahNoSpace = (amount: number) => `Rp${formatRupiah(amount) || '0'}`

/** YYYY-MM-DD for the day `days` days before today, in the user's local time zone */
function isoDateDaysAgo(days: number) {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date.toLocaleDateString('en-CA')
}

export default function ExpenseList() {
    const [search, setSearch] = useState('')
    // null = no time limit
    const [period, setPeriod] = useState<string | null>(DEFAULT_PERIOD_DAYS)
    const [category, setCategory] = useState<string | null>(null)
    const [branch, setBranch] = useState<string | null>(null)
    const [paymentMethod, setPaymentMethod] = useState<string | null>(null)
    const [page, setPage] = useState(1)

    const expenses = DUMMY_EXPENSES

    // The summary cards always cover all expenses, whatever the filters say; cancelled ones don't count as spending
    const now = new Date()
    const currentMonth = now.toLocaleDateString('en-CA').slice(0, 7)
    const completed = expenses.filter((expense) => expense.status === 'Selesai')
    const lastThirtyDays = completed.filter((expense) => expense.date >= isoDateDaysAgo(30))
    const totalLastThirtyDays = lastThirtyDays.reduce((sum, expense) => sum + expense.amount, 0)
    const totalThisMonth = completed
        .filter((expense) => expense.date.startsWith(currentMonth))
        .reduce((sum, expense) => sum + expense.amount, 0)
    const largestExpense = lastThirtyDays.reduce<(typeof lastThirtyDays)[number] | null>(
        (largest, expense) => (largest === null || expense.amount > largest.amount ? expense : largest),
        null,
    )
    const completedCount = completed.length
    const cancelledCount = expenses.length - completedCount

    const keyword = search.trim().toLowerCase()
    const periodStart = period ? isoDateDaysAgo(Number(period)) : null
    const filteredExpenses = expenses.filter((expense) => {
        if (keyword && !expense.title.toLowerCase().includes(keyword) && !expense.vendor.toLowerCase().includes(keyword)) {
            return false
        }
        if (periodStart && expense.date < periodStart) return false
        if (category && expense.category !== category) return false
        if (branch && expense.branch !== branch) return false
        if (paymentMethod && expense.paymentMethod !== paymentMethod) return false
        return true
    })

    const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / PAGE_SIZE))
    const currentPage = Math.min(page, totalPages)
    const pageStartIndex = (currentPage - 1) * PAGE_SIZE
    const pageExpenses = filteredExpenses.slice(pageStartIndex, pageStartIndex + PAGE_SIZE)
    const rangeStart = pageExpenses.length === 0 ? 0 : pageStartIndex + 1
    const rangeEnd = rangeStart === 0 ? 0 : pageStartIndex + pageExpenses.length

    // Downloads what the table currently shows (all pages of the active filters) as a CSV file
    const handleExport = () => {
        const rows = [
            ['Tanggal', 'Pengeluaran', 'Penerima', 'Kategori', 'Cabang', 'Metode Pembayaran', 'Nominal', 'Status'],
            ...filteredExpenses.map((expense) => [
                expense.date,
                expense.title,
                expense.vendor,
                expense.category,
                expense.branch,
                expense.paymentMethod,
                String(expense.amount),
                expense.status,
            ]),
        ]
        const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')

        const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
        const link = document.createElement('a')
        link.href = url
        link.download = 'pengeluaran.csv'
        link.click()
        URL.revokeObjectURL(url)
    }

    const resetPage = <T,>(setter: (value: T) => void) => (value: T) => {
        setter(value)
        setPage(1)
    }

    return (
        <DashboardLayout pageTitle="Pengeluaran">
            <div className="flex w-full flex-col gap-5 px-7 pt-6 pb-4">
                <div className="flex w-full items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold leading-[1.2] text-[#20242d]">Pengeluaran</h1>
                        <p className="text-sm leading-[1.4] text-[#6a7789]">
                            Kelola dan pantau pengeluaran bisnis di setiap cabang.
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
                        Tambah Pengeluaran
                    </Button>
                </div>

                <div className="grid w-full grid-cols-2 gap-4 lg:flex">
                    <AccentSummaryCard
                        label="Total Pengeluaran"
                        value={formatRupiahNoSpace(totalLastThirtyDays)}
                        description="30 hari terakhir"
                        accentColor="#dcdef7"
                        iconBg="#dcdef7"
                        icon={<DynamicLucideIcon name="wallet-cards" size={16} className="text-[#4e5bd6]" />}
                    />
                    <AccentSummaryCard
                        label="Pengeluaran Bulan Ini"
                        value={formatRupiahNoSpace(totalThisMonth)}
                        description={now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                        accentColor="#ffeed4"
                        iconBg="#fff5e5"
                        icon={<DynamicLucideIcon name="calendar-days" size={16} className="text-[#cb7b00]" />}
                    />
                    <AccentSummaryCard
                        label="Pengeluaran Terbesar"
                        value={formatRupiahNoSpace(largestExpense?.amount ?? 0)}
                        description={largestExpense?.category ?? '-'}
                        accentColor="#d7c9ff"
                        iconBg="#f4f0ff"
                        icon={<DynamicLucideIcon name="tags" size={16} className="text-[#7a5de6]" />}
                    />
                    <AccentSummaryCard
                        label="Jumlah Pengeluaran"
                        value={expenses.length.toLocaleString('id-ID')}
                        description="Transaksi"
                        accentColor="#ccfffc"
                        iconBg="#e8f8f7"
                        icon={<DynamicLucideIcon name="receipt-text" size={16} className="text-[#1a9e94]" />}
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
                            placeholder="Cari pengeluaran..."
                            className="w-full text-sm text-[#20242d] placeholder:text-[#8f99a7] focus:outline-none"
                        />
                    </div>

                    <FilterDropdown
                        allLabel="Semua Waktu"
                        options={PERIOD_OPTIONS}
                        value={period}
                        onChange={resetPage(setPeriod)}
                    />
                    <FilterDropdown
                        allLabel="Semua Kategori"
                        options={CATEGORY_OPTIONS}
                        value={category}
                        onChange={resetPage(setCategory)}
                    />
                    <FilterDropdown
                        allLabel="Semua Cabang"
                        options={BRANCH_OPTIONS}
                        value={branch}
                        onChange={resetPage(setBranch)}
                    />
                    <FilterDropdown
                        allLabel="Semua Metode"
                        options={METHOD_OPTIONS}
                        value={paymentMethod}
                        onChange={resetPage(setPaymentMethod)}
                    />

                    <button
                        type="button"
                        onClick={handleExport}
                        disabled={filteredExpenses.length === 0}
                        className="flex shrink-0 items-center justify-center gap-1 rounded-lg border border-[#4e5bd6] bg-[#fdfeff] px-4 py-2 text-sm font-semibold whitespace-nowrap text-[#4e5bd6] hover:bg-[#f7f8fc] disabled:opacity-50"
                    >
                        <DynamicLucideIcon name="download" size={18} />
                        Export
                    </button>
                </div>

                <div className="flex w-full flex-wrap items-center gap-2">
                    <p className="text-[13px] leading-[normal] font-semibold whitespace-nowrap text-[#4e5bd6]">
                        {expenses.length} Pengeluaran
                    </p>
                    <span className="size-[5px] shrink-0 rounded-full bg-[#e9e9ea]" />
                    <p className="text-[13px] leading-[normal] font-semibold whitespace-nowrap text-[#19875a]">
                        {completedCount} Selesai
                    </p>
                    <span className="size-[5px] shrink-0 rounded-full bg-[#e9e9ea]" />
                    <p className="text-[13px] leading-[normal] font-semibold whitespace-nowrap text-[#8f99a7]">
                        {cancelledCount} Dibatalkan
                    </p>
                </div>

                <div className="w-full overflow-x-auto rounded-xl border border-[#ebedf1] bg-white">
                    <div className="flex min-w-[1000px] flex-col items-start">
                        <div className="flex h-[41px] w-full items-center gap-4 border-b border-[#ebedf1] bg-[#fafafb] px-4">
                            <p className="w-24 shrink-0 text-xs font-medium text-[#797c81]">Tanggal</p>
                            <p className="min-w-0 flex-1 text-xs font-medium text-[#797c81]">Pengeluaran</p>
                            <p className="w-32 shrink-0 text-xs font-medium text-[#797c81]">Kategori</p>
                            <p className="w-[148px] shrink-0 text-xs font-medium text-[#797c81]">Cabang</p>
                            <p className="w-32 shrink-0 text-xs font-medium text-[#797c81]">Metode Pembayaran</p>
                            <p className="w-28 shrink-0 text-right text-xs font-medium text-[#797c81]">Nominal</p>
                            <p className="w-28 shrink-0 text-xs font-medium text-[#797c81]">Status</p>
                            <p className="w-[60px] shrink-0 text-center text-xs font-medium text-[#797c81]">Aksi</p>
                        </div>

                        {pageExpenses.length === 0 && (
                            <p className="w-full py-10 text-center text-sm text-[#8f99a7]">Tidak ada pengeluaran ditemukan</p>
                        )}

                        {pageExpenses.map((expense, index) => (
                            <ExpenseTableRow
                                key={expense.id}
                                expense={expense}
                                isAlternate={index % 2 === 1}
                                onViewDetail={() => {}}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex w-full items-center justify-between pt-1">
                    <p className="text-[13px] leading-[normal] whitespace-nowrap text-[#6a7789]">
                        Menampilkan {rangeStart}–{rangeEnd} dari {filteredExpenses.length} pengeluaran
                    </p>

                    <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
                </div>
            </div>
        </DashboardLayout>
    )
}
