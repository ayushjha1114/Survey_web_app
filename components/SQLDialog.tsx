'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';

interface SQLDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sql: string;
}

export default function SQLDialog({ open, onOpenChange, sql }: SQLDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([sql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated.sql';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 z-50 w-[95%] max-w-3xl max-h-[90vh] overflow-auto bg-white rounded-xl p-6 shadow-xl transform -translate-x-1/2 -translate-y-1/2"
        >
          <Dialog.Title className="text-xl font-semibold mb-4 text-gray-800">
            SQL Insert Statements
          </Dialog.Title>

          <pre className="bg-gray-100 text-sm p-4 rounded max-h-[60vh] overflow-auto whitespace-pre-wrap border border-gray-300 text-gray-800">
            {sql}
          </pre>

          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {copied ? 'Copied!' : 'Copy SQL'}
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Download .sql
            </button>

            <Dialog.Close asChild>
              <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition">
                Close
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
