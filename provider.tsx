"use client";

import { SessionProvider } from "next-auth/react";
import { EdgeStoreProvider } from "./lib/edgestore";
import { SearchProvider } from "./components/SearchContext";
export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <SearchProvider>
        <EdgeStoreProvider>{children}</EdgeStoreProvider>
      </SearchProvider>
    </SessionProvider>
  );
};
