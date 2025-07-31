export default function StatsCard({ label, value }) {
  return (
    <div className="bg-white shadow rounded p-4 flex flex-col items-center">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="mt-2 text-2xl font-bold">{value}</span>
    </div>
  );
}