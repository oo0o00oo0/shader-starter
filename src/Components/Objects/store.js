import create from "zustand"

export const useStore = create((set) => ({
  skyID: 0,
  setSkyID: (v) => set({ skyID: v }),
}))
