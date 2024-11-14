"use client";

import { SessionProvider } from "next-auth/react";
import { EdgeStoreProvider } from "./lib/edgestore";
export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <EdgeStoreProvider>{children}</EdgeStoreProvider>
    </SessionProvider>
  );
};
