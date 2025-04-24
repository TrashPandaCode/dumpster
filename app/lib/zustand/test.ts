import { create } from 'zustand'

interface BearState {
    bears: number
    setBears: (bears: number) => void
}

export const useBearStore = create<BearState>((set) => ({
  bears: 0,
  setBears: (bears: number) => set({ bears }),
}))