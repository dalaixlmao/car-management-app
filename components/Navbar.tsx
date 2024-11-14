"use client";

import Image from "next/image";
import SearchInput from "./SearchInput";
import Button from "./Button";
import Menu from "@/public/icons/menu";
import Cross from "@/public/icons/cross";
import { useState } from "react";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-screen border-b border-white/20">
      <div className="w-full flex flex-row justify-between items-center px-5 py-4">
        {/* Logo */}
        <div>
          <Image src={"./logo.svg"} width={50} height={50} alt="Logo" />
        </div>

        {/* Mobile Menu Toggle */}
        <div
          onClick={() => setOpen(!open)}
          className="md:hidden block w-6 cursor-pointer z-10"
        >
          {!open ? <Menu /> : <Cross />}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex w-3/5 items-center justify-between">
          {/* Search Section */}
          <div className="flex flex-row items-center">
            <SearchInput />
            <Button type="search-button" className="ml-3" handler={() => {}} />
          </div>

          {/* Login/Signup Section */}
          <div className="flex flex-row items-center">
            <Button
              type="no-bg"
              className="text-sm font-semibold"
              handler={() => {}}
            >
              Login
            </Button>
            <Button
              type="hyper"
              className="text-black font-semibold text-sm ml-3"
              handler={() => {}}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`${
          open ? "flex" : "hidden"
        } md:hidden absolute top-0 h-screen right-0 bg-white/10 backdrop-blur pt-48 flex-col items-center gap-4 px-5 py-4`}
      >
        {/* Search Section */}
        <div className="flex flex-row">
          <SearchInput />
          <div className="ml-2">
            <Button type="search-button" className="w-full" handler={() => {}}>
              Search
            </Button>
          </div>
        </div>

        {/* Login/Signup Section */}
        <div className="flex flex-col items-center gap-2 w-full">
          <Button
            type="no-bg"
            className="text-sm font-semibold w-full text-center"
            handler={() => {}}
          >
            Login
          </Button>
          <Button
            type="hyper"
            className="text-black font-semibold text-sm text-center"
            handler={() => {}}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}
