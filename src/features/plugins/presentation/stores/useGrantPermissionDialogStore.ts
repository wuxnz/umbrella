import {create} from 'zustand';
import {requestManagePermission} from 'manage-external-storage';

interface GrantPermissionDialogStoreState {
  title: string;
  setTitle: (title: string) => void;
  reason: string;
  setReason: (reason: string) => void;
  onConfirm: () => void;
  setOnConfirm: (onConfirm: () => void) => void;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const useGrantPermissionDialogStore =
  create<GrantPermissionDialogStoreState>((set, get) => ({
    title: '',
    setTitle: title => set({title}),
    reason: '',
    setReason: reason => set({reason}),
    onConfirm: async () => {},
    setOnConfirm: onConfirm => set({onConfirm}),
    visible: false,
    setVisible: visible => set({visible}),
  }));
