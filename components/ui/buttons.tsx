"use client";

import React from "react";

function SearchButton({ onClick }: { onClick: () => void }) {
  return (
      <button onClick={onClick} className="text-white/60 transition-all text-sm placeholder:text-sm px-4 py-1 bg-white/10 bg-gradient-to-b from-white/10 to-white/0 border border-white/30 rounded-md">Go</button>
  );
}

function NoBgButton({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className={className + " "}>
      {children}
    </button>
  );
}

function HyperButton({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={className + " py-2 px-4 hover:bg-indigo-400 transition-all bg-indigo-500 rounded-full"}
    >
      {children}
    </button>
  );
}

export { SearchButton, NoBgButton, HyperButton };
