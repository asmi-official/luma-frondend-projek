import type { ExpenseItem, ExpenseStatus } from './types'

// Dummy data until the expense API is available.
// [date, title, vendor, category, branch, payment method, amount, status]
const ROWS: [string, string, string, string, string, string, number, ExpenseStatus][] = [
  ['2026-10-06', 'Pembelian Bahan Baku', 'PT Supplier ABC', 'Bahan Baku', 'Kopi Kita BSD', 'Cash', 850000, 'Selesai'],
  ['2026-10-05', 'Pembayaran Listrik', 'PLN', 'Utilitas', 'Kopi Kita BSD', 'Bank Transfer', 1250000, 'Selesai'],
  ['2026-10-05', 'Pembelian ATK', 'Toko Sinar Jaya', 'Operasional', 'Kopi Kita Gading', 'QRIS', 250000, 'Selesai'],
  ['2026-10-04', 'Restock Biji Kopi Arabika', 'CV Kopi Nusantara', 'Bahan Baku', 'Kopi Kita Alam Sutera', 'Bank Transfer', 4250000, 'Selesai'],
  ['2026-10-03', 'Iklan Instagram', 'Meta Ads', 'Marketing', 'Kopi Kita BSD', 'Debit', 600000, 'Selesai'],
  ['2026-10-03', 'Servis Mesin Espresso', 'Teknik Prima', 'Maintenance', 'Kopi Kita Gading', 'Cash', 1100000, 'Dibatalkan'],
  ['2026-10-02', 'Ongkos Kirim Supplier', 'GoSend', 'Transportasi', 'Kopi Kita Alam Sutera', 'E-wallet', 85000, 'Selesai'],
  ['2026-10-01', 'Sewa Outlet Oktober', 'PT Properti Jaya', 'Sewa', 'Kopi Kita BSD', 'Bank Transfer', 3500000, 'Selesai'],
  ['2026-10-01', 'Pajak Reklame', 'Dinas Pendapatan', 'Pajak', 'Kopi Kita Gading', 'Bank Transfer', 475000, 'Selesai'],
  ['2026-09-30', 'Pembelian Kemasan Cup', 'PT Plastik Sejahtera', 'Bahan Baku', 'Kopi Kita BSD', 'Cash', 720000, 'Selesai'],
  ['2026-09-29', 'Gaji Barista Mingguan', 'Internal', 'Operasional', 'Kopi Kita Alam Sutera', 'Bank Transfer', 2800000, 'Selesai'],
  ['2026-09-28', 'Pembelian Susu UHT', 'PT Dairy Fresh', 'Bahan Baku', 'Kopi Kita Gading', 'Cash', 960000, 'Selesai'],
  ['2026-09-27', 'Tagihan Air PDAM', 'PDAM', 'Utilitas', 'Kopi Kita BSD', 'Bank Transfer', 380000, 'Selesai'],
  ['2026-09-25', 'Iklan Google Ads', 'Google', 'Marketing', 'Kopi Kita Alam Sutera', 'Debit', 1500000, 'Selesai'],
  ['2026-09-24', 'Servis AC', 'Cool Service', 'Maintenance', 'Kopi Kita BSD', 'Cash', 450000, 'Selesai'],
  ['2026-09-22', 'Bensin Operasional', 'Pertamina', 'Transportasi', 'Kopi Kita Gading', 'QRIS', 120000, 'Selesai'],
  ['2026-09-20', 'Sewa Outlet September', 'PT Properti Jaya', 'Sewa', 'Kopi Kita BSD', 'Bank Transfer', 3500000, 'Selesai'],
  ['2026-09-19', 'Pembelian Sirup', 'CV Rasa Nusantara', 'Bahan Baku', 'Kopi Kita Alam Sutera', 'E-wallet', 640000, 'Dibatalkan'],
  ['2026-09-10', 'Pajak Bumi Bangunan', 'Dinas Pendapatan', 'Pajak', 'Kopi Kita BSD', 'Bank Transfer', 1800000, 'Selesai'],
  ['2026-08-30', 'Pembelian Peralatan Dapur', 'Toko Maju Jaya', 'Operasional', 'Kopi Kita Gading', 'Cash', 2100000, 'Selesai'],
]

export const DUMMY_EXPENSES: ExpenseItem[] = ROWS.map(
  ([date, title, vendor, category, branch, paymentMethod, amount, status], index) => ({
    id: `expense-${index + 1}`,
    date,
    title,
    vendor,
    category,
    branch,
    paymentMethod,
    amount,
    status,
  }),
)
