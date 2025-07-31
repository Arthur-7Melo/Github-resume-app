export default function InsightsText({ text }) {
  return (
    <div className="bg-white shadow rounded p-4 whitespace-pre-wrap">
      <h2 className="text-lg font-semibold mb-2">Insights</h2>
      <p className="text-gray-700">{text}</p>
    </div>
  );
}