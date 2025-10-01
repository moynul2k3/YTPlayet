// src/providers/ReduxProvider.tsx
"use client";
import React, { useMemo } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { makeStore } from "../store/store";
import { getCookie } from "cookies-next";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  // read cookie client-side
  const u_id = getCookie("u_id") as string | undefined;

  // create a per-user store/persistor. memoize so we don't recreate on every render.
  const { store, persistor } = useMemo(() => makeStore(u_id), [u_id]);

  // optional: attach for debugging
  // (window as any).__APP_STORE = store;
  // (window as any).__APP_PERSISTOR = persistor;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
