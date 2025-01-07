import { create } from "zustand";

export const useServiceRegistry = create<Record<string, any>>(() => ({}));

export function registerService(name: string, service: any) {
  useServiceRegistry.setState({ [name]: service });
}

export function getService<T>(name: string): T {
  return useServiceRegistry.getState()[name];
}
