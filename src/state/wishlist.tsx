/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState } from 'react';

type WishlistApi = {
  ids: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
};

const WishlistContext = createContext<WishlistApi | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  const api = useMemo<WishlistApi>(
    () => ({
      ids,
      add: (id) => setIds((prev) => (prev.includes(id) ? prev : [...prev, id])),
      remove: (id) => setIds((prev) => prev.filter((x) => x !== id)),
      toggle: (id) =>
        setIds((prev) =>
          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        ),
      has: (id) => ids.includes(id),
    }),
    [ids],
  );

  return (
    <WishlistContext.Provider value={api}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistApi {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
