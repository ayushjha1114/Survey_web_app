'use client';

import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';
import SQLDialog from '@/components/SQLDialog';


export default function UploadPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [sqlDialogOpen, setSqlDialogOpen] = useState(false);
  const [sqlResult, setSqlResult] = useState('');


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setCsvFile(e.target.files[0]);
      toast.success(`Selected file: ${e.target.files[0].name}`);
    }
  };

  const handleSubmit = async () => {
    if (!csvFile) {
      toast.error('Please upload a CSV file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await fetch('http://localhost:3001/translation', {
        method: 'POST',
        body: formData,
      });

      const data = await response.text(); // adjust if your API returns JSON with sql
      setSqlResult(data);
      setSqlDialogOpen(true);
      toast.success('CSV processed successfully!');
      console.log(data);
    } catch (error) {
      toast.error('Upload failed. Please try again.');
      console.error(error);
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto mt-10 px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload Survey CSV</h1>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Upload your completed CSV file</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-300 rounded-lg text-sm text-blue-700 hover:bg-blue-100 transition">
                <UploadCloud size={16} />
                <span>Select CSV File</span>
                <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
              </label>
              {csvFile && (
                <span className="text-sm text-gray-600 truncate max-w-xs">
                  {csvFile.name}
                </span>
              )}
            </div>
          </div>

          <div>
            <a
              href="/survey_format_sheet.csv"
              download
              className="text-sm text-blue-600 hover:underline"
            >
              📄 Download sample CSV format
            </a>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!csvFile}
            className={`w-full sm:w-auto px-6 py-2 text-sm font-medium rounded transition
                        ${csvFile
                          ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                      `}
          >
            Generate SQL
          </button>
        </div>
      </div>
      <SQLDialog open={sqlDialogOpen} onOpenChange={setSqlDialogOpen} sql={sqlResult} />
    </>
  );
}
