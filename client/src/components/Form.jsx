import { useState } from "react";

export default function Form({ onSubmit }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handle = e => {
    e.preventDefault();
    setError('');

    const match = url.match(/github\.com\/([^/]+\/[^/]+)/);
    if (!match) {
      setError('URL inválida. Use https://github.com/owner/repo');
      return;
    }
    onSubmit(match[1]);
  };

  return (
    <form onSubmit={handle} className="flex flex-col gap-1">
      <div className="flex gap-2">
        <input
          className="border px-3 py-2 flex-1 dark:bg-white"
          type="text"
          placeholder="Cole a URL do Github"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <button
          className="
        bg-blue-600 text-white px-4 py-2 rounded
        hover:bg-blue-700 hover:shadow-lg
        cursor-pointer transition duration-200
      "
        >
          Gerar
        </button>
      </div>
      {error && (
        <p className="text-red-600 text-sm w-full">
          {error}
        </p>
      )}
    </form>
  );
}