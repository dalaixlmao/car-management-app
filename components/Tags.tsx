export default function Tag({
  content,
  size,
}: {
  content: string;
  size: string;
}) {
  const sz = "text-" + size;
  return (
    <div
      className={`px-3 rounded-full ${sz} text-white/40 py-1 pb-2 bg-white/10 border border-white/30`}
    >
      {content}
    </div>
  );
}
