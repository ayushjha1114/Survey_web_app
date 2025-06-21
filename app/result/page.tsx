'use client';

import { useEffect, useState } from 'react';

export default function ResultPage() {
  const [sql, setSql] = useState('');

  useEffect(() => {
    const result = localStorage.getItem('sqlResult') || '';
    setSql(result);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    alert('SQL copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Generated SQL</h1>
      <div className="bg-white p-4 rounded-xl shadow">
        <pre className="whitespace-pre-wrap break-words text-sm max-h-[400px] overflow-auto">{sql}</pre>
        <button
          onClick={handleCopy}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Copy to Clipboard
        </button>
      </div>
    </div>
  );
}