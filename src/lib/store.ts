import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Component {
  name: string;
  code: string;
  date: string;
}

interface StoreState {
  history: string[];
  saved: Component[];
  addHistory: (code: string) => void;
  saveComponent: (comp: Component) => void;
  deleteComponent: (name: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      history: [],
      saved: [],
      addHistory: (code) => set((state) => ({ history: [code, ...state.history] })),
      saveComponent: (comp) =>
        set((state) => ({ saved: [comp, ...state.saved] })),
      deleteComponent: (name) =>
        set((state) => ({ saved: state.saved.filter((c) => c.name !== name) })),
    }),
    {
      name: "v0-clone-store",
    }
  )
);
