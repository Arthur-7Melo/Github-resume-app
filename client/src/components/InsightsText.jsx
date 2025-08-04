export default function InsightsText({ text }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded p-4 whitespace-pre-wrap">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Insights</h2>
      <p className="text-gray-700 dark:text-gray-300">{text}</p>
    </div>
  );
}