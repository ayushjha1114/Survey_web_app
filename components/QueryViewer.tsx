'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function QueryViewer({ queries }: { queries: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(queries);
      setCopied(true);
      toast.success('Copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <div className="mt-8 bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-2">Insert Queries</h3>
      <textarea
        value={queries}
        readOnly
        className="w-full h-64 p-2 border rounded resize-none font-mono text-sm"
      />
      <button
        onClick={copyToClipboard}
        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-xl"
      >
        📋 Copy to Clipboard
      </button>
    </div>
  );
}