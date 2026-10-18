import type { InventoryItem } from './types'

// Dummy data until the inventory API is available.
const PRODUCTS = {
  americano: { productName: 'Americano', category: 'Kopi', sku: 'COF-001' },
  cappuccino: { productName: 'Cappuccino', category: 'Kopi', sku: 'COF-002' },
  caramelLatte: { productName: 'Caramel Latte', category: 'Kopi', sku: 'COF-003' },
  cafeLatte: { productName: 'Cafe Latte', category: 'Kopi', sku: 'COF-004' },
  kopiSusuGulaAren: { productName: 'Kopi Susu Gula Aren', category: 'Kopi', sku: 'COF-005' },
  matchaLatte: { productName: 'Matcha Latte', category: 'Non-Kopi', sku: 'NON-001' },
  esTehLemon: { productName: 'Es Teh Lemon', category: 'Non-Kopi', sku: 'NON-002' },
  croissantButter: { productName: 'Croissant Butter', category: 'Pastry', sku: 'PST-001' },
  chocoMuffin: { productName: 'Choco Muffin', category: 'Pastry', sku: 'PST-002' },
} as const

type ProductKey = keyof typeof PRODUCTS

// [product, branch, stock, minimum stock, minutes since the last update]
const ROWS: [ProductKey, string, number, number, number][] = [
  ['americano', 'BSD', 42, 20, 2],
  ['cappuccino', 'BSD', 8, 20, 15],
  ['caramelLatte', 'Kelapa Gading', 0, 10, 60],
  ['americano', 'Kelapa Gading', 18, 10, 180],
  ['cafeLatte', 'BSD', 35, 15, 300],
  ['matchaLatte', 'Kelapa Gading', 6, 12, 390],
  ['croissantButter', 'BSD', 24, 10, 1700],
  ['esTehLemon', 'BSD', 0, 15, 1800],
  ['chocoMuffin', 'Kelapa Gading', 11, 10, 1950],
  ['kopiSusuGulaAren', 'BSD', 20, 20, 25920],
  ['cappuccino', 'Kelapa Gading', 26, 20, 40],
  ['caramelLatte', 'BSD', 14, 10, 95],
  ['cafeLatte', 'Kelapa Gading', 9, 15, 210],
  ['kopiSusuGulaAren', 'Kelapa Gading', 31, 20, 2500],
  ['matchaLatte', 'BSD', 22, 12, 3100],
  ['esTehLemon', 'Kelapa Gading', 17, 15, 4200],
  ['croissantButter', 'Kelapa Gading', 5, 10, 130],
  ['chocoMuffin', 'BSD', 0, 10, 8800],
  ['americano', 'Kemang', 55, 25, 12],
  ['cappuccino', 'Kemang', 19, 20, 75],
  ['cafeLatte', 'Kemang', 28, 15, 600],
  ['matchaLatte', 'Kemang', 0, 12, 2900],
  ['croissantButter', 'Kemang', 16, 10, 5400],
  ['kopiSusuGulaAren', 'Kemang', 40, 20, 15000],
]

const NOW = Date.now()

export const DUMMY_INVENTORY: InventoryItem[] = ROWS.map(([product, branch, stock, minStock, minutesAgo], index) => ({
  id: `inventory-${index + 1}`,
  ...PRODUCTS[product],
  branch,
  stock,
  minStock,
  unit: 'pcs',
  updatedAt: new Date(NOW - minutesAgo * 60_000).toISOString(),
}))
