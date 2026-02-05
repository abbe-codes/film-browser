/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react';
import type { InitialData } from './initialData.types';

const InitialDataContext = createContext<InitialData | null>(null);

export function InitialDataProvider({
  value,
  children,
}: {
  value: InitialData;
  children: React.ReactNode;
}) {
  return (
    <InitialDataContext.Provider value={value}>
      {children}
    </InitialDataContext.Provider>
  );
}

export function useInitialData(): InitialData {
  return useContext(InitialDataContext) ?? {};
}
