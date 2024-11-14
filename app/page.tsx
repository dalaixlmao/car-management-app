import NavBar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="mt-[80px]">
      <div className="absolute top-0">
        <NavBar />
      </div>
      Hello
    </div>
  );
}
