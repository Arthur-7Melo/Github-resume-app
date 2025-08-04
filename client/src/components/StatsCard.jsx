export default function StatsCard({ label, value }) {
  return (
    <div
      className="
      bg-white dark:bg-gray-800 
      shadow rounded p-4 flex flex-col items-center
      transition-colors duration-200
      hover:shadow-lg hover:scale-10
      "
    >
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="mt-2 text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</span>
    </div>
  );
}