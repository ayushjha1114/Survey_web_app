'use client';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {postTranslation} from '@/utils/api';

export default function FileUploader({ onResult }: { onResult: (q: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return toast.error('Please select a file.');

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const res = await postTranslation(formData);
      console.warn("🚀 ~ handleUpload ~ res:", res)
      onResult(res.data); // assuming the API returns raw insert queries as text
    } catch (err) {
      console.warn("🚀 ~ handleUpload ~ err:", err)
      toast.error('Error generating queries.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input type="file" accept='.csv' ref={fileRef} className="block" />
      <button onClick={handleUpload} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-xl">
        {loading ? 'Processing...' : 'Upload & Generate Queries'}
      </button>
    </div>
  );
}
