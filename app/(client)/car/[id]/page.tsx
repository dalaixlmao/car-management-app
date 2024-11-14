import CarDescription from "@/components/CarDescription";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Home({ params }: PageProps) {
  const server = await getServerSession(authOptions);

  const { id } = params;
  if (server?.user)
    return (
      <div className="mt-[80px] flex flex-col items-center h-screen">
        <CarDescription
          id={Number(id)}
          userId = {Number(server.user.id)}
        />
      </div>
    );
}
