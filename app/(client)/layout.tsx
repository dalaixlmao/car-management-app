import NavBar from "@/components/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

  return (
    <div className="w-screen">
      <div className="absolute top-0">
        <NavBar userId={Number(userId)} />
      </div>
      {children}
    </div>
  );
}
