import {create} from 'zustand';

interface BottomNavigationBarState {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const useBottomNavigationBarState = create<BottomNavigationBarState>(
  (set, get) => ({
    visible: true,
    setVisible: visible => set({visible}),
  }),
);
