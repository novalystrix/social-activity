interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

export default function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div className={`rounded-xl border p-5 ${
      accent
        ? 'border-cyan-500/30 bg-cyan-500/5'
        : 'border-zinc-800 bg-zinc-900'
    }`}>
      <p className="text-sm text-zinc-400 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${accent ? 'text-cyan-400' : 'text-white'}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
    </div>
  );
}
