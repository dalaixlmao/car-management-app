import Feed from "@/components/Feed";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session?.user)
    return (
      <div className="mt-[80px] flex flex-col items-center">
        <Feed />
      </div>
    );
}
