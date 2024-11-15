"use client";

import Image from "next/image";
import SearchInput from "./SearchInput";
import Button from "./Button";
import Menu from "@/public/icons/menu";
import Cross from "@/public/icons/cross";
import { useState, useEffect } from "react";
import { getUserDetailsById } from "@/services/userServices";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSearchContext } from "./SearchContext";

export default function NavBar({ userId }: { userId: number }) {
  const [open, setOpen] = useState(false);
  const [displayLogout, setDisplayLogOut] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string }>();
  const { searchText, setSearchText } = useSearchContext(); // access context
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const userData = await getUserDetailsById(userId);
      if (userData) setUser(userData);
    };
    getUser();
  }, [userId]);

  const handleLogout = async () => {
    try {
      setOpen(false);
      setDisplayLogOut(false);
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="w-screen border-b border-white/20">
      <div className="w-full flex flex-row justify-between items-center px-5 py-4">
        {/* Logo */}
        <div>
          <Image src="/logo.svg" width={50} height={50} alt="Logo" />
        </div>

        {/* Mobile Menu Toggle */}
        <div
          onClick={() => setOpen(!open)}
          className="md:hidden block w-6 cursor-pointer z-10"
        >
          {open ? <Cross /> : <Menu />}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex w-3/5 items-center justify-between">
          {/* Search Section */}
          <div className="flex flex-row items-center">
            <SearchInput setSearchText={setSearchText} searchText={searchText} />
            <div className="ml-2">
              <Button type="search-button" handler={() => {}} />
            </div>
          </div>

          {/* Login/Signup Section */}
          <div className="flex flex-row items-center">
            <div
              onClick={() => setDisplayLogOut(!displayLogout)}
              className="cursor-pointer h-8 w-8 flex flex-col items-center justify-center text-white/30 border border-white/30 bg-white/10 rounded-full"
            >
              {user?.name[0]}
            </div>

            {displayLogout && (
              <div className="w-60 px-3 py-2 right-10 top-10 backdrop-blur rounded-md border border-white/30 absolute bg-white/10">
                <div className="text-white/50 w-full text-center border-b border-white/10 py-3 font-semibold text-xl">
                  {user?.name}
                </div>
                <div
                  onClick={handleLogout}
                  className="text-white/50 px-2 mt-2 rounded-md transition-all cursor-pointer hover:bg-white/10 hover:text-white w-full py-1"
                >
                  Log Out
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`${
          open ? "flex" : "hidden"
        } md:hidden absolute top-0 h-screen right-0 bg-white/10 backdrop-blur flex-col-reverse items-center justify-end pt-12 gap-4 px-5 py-4`}
      >
        {/* Search Section */}
        <div className="flex flex-row">
          <SearchInput setSearchText={setSearchText} searchText={searchText} />
          <div className="ml-2">
            <Button type="search-button" handler={() => {}} />
          </div>
        </div>

        {/* Login/Signup Section */}
        <div className="flex col items-center gap-4 w-full">
          <div className="w-60 px-3 py-2 right-10 top-10 text-white/30">
            <div className="text-4xl border-b border-white/10 flex flex-row justify-between w-full py-2 px-2">
              {user?.name}
              <div
                onClick={handleLogout}
                className="text-white/50 text-base font-regular px-2 mt-2 rounded-md transition-all cursor-pointer hover:bg-white/10 hover:text-white py-1"
              >
                Log Out
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
