export default function Tag({ content }: { content: string }) {
  return (
    <div className="px-3 rounded-full text-xs text-white/40 py-1 bg-white/10 border border-white/30">
      {content}
    </div>
  );
}
