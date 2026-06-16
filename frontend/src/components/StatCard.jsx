export default function StatCard({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-orange-100 bg-white p-5 shadow-sm transition hover:shadow-lg">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold text-orange-500">
        {value}
      </p>
    </div>
  );
}