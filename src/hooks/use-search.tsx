import { create } from 'zustand'

type SearchStore = {
  isOpen: boolean
  toggle: () => void
  onOpen: () => void
  onClose: () => void
}

export const useSearch = create<SearchStore>((set, get) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  toggle: () => set({ isOpen: !get().isOpen }),
}))
