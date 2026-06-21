export default function Footer() {
  return (
    <footer className="py-8 px-4 border-t border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-white/20">
          © 2026 <span className="gradient-text font-semibold">Roshan Patil</span>. Built with Next.js + Sanity.
        </div>
        <div className="flex items-center gap-1 text-xs text-white/15">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Available for hire
        </div>
      </div>
    </footer>
  );
}
