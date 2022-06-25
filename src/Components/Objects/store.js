import create from "zustand"

export const useStore = create((set) => ({
  skyID: 0,
  setSkyID: (v) => set({ skyID: v }),

  mouseDown: false,
  setMouseDown: (v) => set({ mouseDown: v }),
  showDrop: false,
  setShowDrop: (v) => set({ showDrop: v }),
}))
