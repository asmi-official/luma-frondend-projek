import { create } from 'zustand'
import { DUMMY_PROMOS } from '../pages/data-master/event-promo/dummyData'
import type { Promo } from '../pages/data-master/event-promo/types'

// Dummy store backing the Promo & Event pages until the API is available.
type PromoState = {
  promos: Promo[]
  addPromo: (promo: Omit<Promo, 'id'>) => void
  updatePromo: (id: string, promo: Omit<Promo, 'id'>) => void
  removePromo: (id: string) => void
}

export const usePromoStore = create<PromoState>((set) => ({
  promos: DUMMY_PROMOS,
  addPromo: (promo) =>
    set((state) => ({ promos: [{ ...promo, id: crypto.randomUUID() }, ...state.promos] })),
  updatePromo: (id, promo) =>
    set((state) => ({
      promos: state.promos.map((current) => (current.id === id ? { ...promo, id } : current)),
    })),
  removePromo: (id) => set((state) => ({ promos: state.promos.filter((promo) => promo.id !== id) })),
}))
