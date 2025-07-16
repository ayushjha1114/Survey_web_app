'use client';

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Save, CheckCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addCondition } from '@/store/slices/conditionSlice';

const conditionOptions = [
  { value: 'TRUE', label: 'TRUE' },
  { value: 'FALSE', label: 'FALSE' },
];

type LocalCondition = {
  questionId: string;
  question: string;
  condition: string;
  conditionalSourceQuestion: string;
  isDirty: boolean;
};

export default function ConditionBlock() {
  const dispatch = useAppDispatch();
  const questions = useAppSelector((state) => state.question.list);

  const questionOptions = [
    { value: 'NULL', label: 'NULL' },
    ...questions.map((q) => ({ value: q.id, label: q.question || 'No Question' })),
  ];

  const [localRows, setLocalRows] = useState<LocalCondition[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (questions.length > 0) {
      setLocalRows(
        questions.map((q) => ({
          questionId: q.id,
          question: q.question || '',
          condition: '',
          conditionalSourceQuestion: '',
          isDirty: false,
        }))
      );
      setSaved(false);
    }
  }, [questions]);

  const handleChange = (
    id: string,
    field: 'condition' | 'conditionalSourceQuestion',
    value: string
  ) => {
    setLocalRows((prev) =>
      prev.map((row) =>
        row.questionId === id
          ? { ...row, [field]: value, isDirty: true }
          : row
      )
    );
    setSaved(false);
  };

  const allRowsValid = localRows.every(
    (row) => row.condition && row.conditionalSourceQuestion
  );

  const anyRowDirty = localRows.some((row) => row.isDirty);

  const handleSave = () => {
    if (!allRowsValid || !anyRowDirty) return;
    // dispatch(addCondition(localRows));
        localRows.forEach(row => {
      dispatch(addCondition({
        id: row.questionId,
        question: row.question,
        condition: row.condition,
        conditionalSourceQuestion: row.conditionalSourceQuestion,
      }));
    });
    setLocalRows(prev =>
      prev.map(row => ({ ...row, isDirty: false }))
    );
    setSaved(true);
  };

  if (questions.length === 0) return null;

  return (
    <div className="space-y-4">
      {localRows.map((item) => (
        <div
          key={item.questionId}
          className="bg-white border border-gray-200 p-4 rounded-xl shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-4 items-start text-gray-800">
            {/* Question (disabled) */}
            <div>
              <label className="block text-xs font-medium mb-1">Question</label>
              <input
                type="text"
                value={item.question}
                disabled
                className="w-full border border-gray-200 bg-gray-100 rounded px-2 py-1 text-sm"
              />
            </div>

            {/* Condition */}
            <div>
              <label className="block text-xs font-medium mb-1">Condition</label>
              <Select
                options={conditionOptions}
                value={
                  conditionOptions.find((opt) => opt.value === item.condition) || null
                }
                onChange={(selected) =>
                  handleChange(item.questionId, 'condition', selected?.value || '')
                }
                placeholder="Select condition"
                className="text-sm"
              />
            </div>

            {/* Conditional Source Question */}
            <div>
              <label className="block text-xs font-medium mb-1">
                Conditional Source Question
              </label>
              <Select
                options={questionOptions}
                value={
                  questionOptions.find(
                    (opt) => opt.value === item.conditionalSourceQuestion
                  ) || null
                }
                onChange={(selected) =>
                  handleChange(
                    item.questionId,
                    'conditionalSourceQuestion',
                    selected?.value || ''
                  )
                }
                placeholder="Select question or NULL"
                className="text-sm"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Save Button */}
      <div className="flex justify-end mt-4">
        {saved ? (
          <button
            disabled
            title="All changes saved"
            className="w-10 h-10 rounded-full border border-gray-300 text-gray-300 flex items-center justify-center cursor-not-allowed"
          >
            <CheckCircle size={20} />
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={!allRowsValid || !anyRowDirty}
            title="Save Conditions"
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition ${
              allRowsValid && anyRowDirty
                ? 'border-green-600 text-green-600 hover:bg-green-100'
                : 'border-gray-300 text-gray-300 cursor-not-allowed'
            }`}
          >
            <Save size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
