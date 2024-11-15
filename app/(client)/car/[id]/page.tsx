import CarDescription from "@/components/CarDescription";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation"; 


export default async function CarPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions); 

  if (!session?.user) {
   
    redirect("/signin");
  }

  const { id } = await params;
  if (!id || isNaN(Number(id))) {
    return (
      <div className="mt-[80px] flex flex-col items-center h-screen">
        <p>Invalid car ID</p>
      </div>
    );
  }

  return (
    <div className="mt-[80px] flex flex-col items-center h-screen">
      <CarDescription
        id={Number(id)}
        userId={Number(session.user.id)}
      />
    </div>
  );
}
