import { useState } from "react";

export default function Form({ onSubmit }) {
  const [url, setUrl] = useState('');

  const handle = e => {
    e.preventdefault();

    const match = url.match(/github\.com\/([^/]+\/[^/]+)/);
    if (!match) return alert("Url inválida!")
    onSubmit(match(1));
  };

  return (
    <form onSubmit={handle} className="flex gap-2">
      <input
        className="border px-3 py-2 flex-1"
        type="text"
        placeholder="Cole a URL do Github"
        value={url}
        onChange={e => setUrl(e.target.value)}
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Gerar</button>
    </form>
  );
}