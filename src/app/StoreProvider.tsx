'use client';
import { makeStore, AppStore } from '@/store/store';
import { useRef } from 'react';
import { Provider } from 'react-redux';

export let store: AppStore;

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
    store = storeRef.current;
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
