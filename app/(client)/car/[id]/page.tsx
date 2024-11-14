interface PageProps {
  params: {
    id: string;
  };
}
export default function Home({ params }: PageProps) {
    
  return <div className="mt-[80px]">{params.id}</div>;
}
