'use client';

import { useEffect, useState } from 'react';

export type ToastVariant = 'default' | 'destructive';

export type ToastOptions = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastItem = ToastOptions & {
  id: string;
};

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
const listeners = new Set<Listener>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();

const notify = () => {
  for (const listener of listeners) {
    listener([...toasts]);
  }
};

export const dismissToast = (id: string) => {
  const timer = timers.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }

  toasts = toasts.filter((toastItem) => toastItem.id !== id);
  notify();
};

export const toast = (options: ToastOptions) => {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const toastItem: ToastItem = {
    id,
    title: options.title,
    description: options.description,
    variant: options.variant ?? 'default',
    duration: options.duration ?? 4000,
  };

  toasts = [toastItem, ...toasts].slice(0, 5);
  notify();

  timers.set(
    id,
    setTimeout(() => {
      dismissToast(id);
    }, toastItem.duration)
  );

  return id;
};

export const useToast = () => {
  const [currentToasts, setCurrentToasts] = useState<ToastItem[]>(toasts);

  useEffect(() => {
    listeners.add(setCurrentToasts);
    return () => {
      listeners.delete(setCurrentToasts);
    };
  }, []);

  return {
    toasts: currentToasts,
    toast,
    dismissToast,
  };
};
