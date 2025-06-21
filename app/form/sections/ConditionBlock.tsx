'use client';

import React, { useEffect } from 'react';
import Select from 'react-select';
import { Plus, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateCondition, addCondition, removeCondition } from '@/store/slices/conditionSlice';
import type { ConditionItem } from '@/store/slices/conditionSlice';

const conditionOptions = [
  { value: 'TRUE', label: 'TRUE' },
  { value: 'FALSE', label: 'FALSE' },
];

export default function ConditionBlock() {
  const dispatch = useAppDispatch();
  const questions = useAppSelector((state) => state.question.list);
  const conditions = useAppSelector((state) => state.condition.list);

  const questionOptions = [
    { value: 'NULL', label: 'NULL' },
    ...questions.map((q) => ({ value: q.id, label: q.question || 'Untitled Question' })),
  ];

  useEffect(() => {
    if (conditions.length === 0 && questions.length > 0) {
      dispatch(
        addCondition({
          id: crypto.randomUUID(),
          question: questions[0]?.question || '',
          condition: '',
          conditionalSourceQuestion: '',
        })
      );
    }
  }, [questions, conditions.length, dispatch]);

  const handleAdd = () => {
    dispatch(
      addCondition({
        id: crypto.randomUUID(),
        question: questions[0]?.question || '',
        condition: '',
        conditionalSourceQuestion: '',
      })
    );
  };

  const handleRemove = (id: string) => {
    dispatch(removeCondition(id));
  };

  const handleChange = (id: string, field: keyof ConditionItem, value: any) => {
    dispatch(updateCondition({ id, field, value }));
  };

  return (
    <div className="space-y-6">
      {conditions.map((item, index) => (
        <div
          key={item.id}
          className="flex flex-col md:flex-row gap-4 bg-white p-4 border rounded shadow-sm"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1 text-gray-800">Question</label>
            <input
              type="text"
              value={item.question}
              disabled
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-700"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium mb-1 text-gray-800">Condition</label>
            <Select
              options={conditionOptions}
              value={conditionOptions.find((opt) => opt.value === item.condition) || null}
              onChange={(selected) =>
                handleChange(item.id, 'condition', selected?.value || '')
              }
              placeholder="Select condition"
              className="text-sm"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1 text-gray-800">Conditional Source Question</label>
            <Select
              options={questionOptions}
              value={questionOptions.find((opt) => opt.value === item.conditionalSourceQuestion) || null}
              onChange={(selected) =>
                handleChange(item.id, 'conditionalSourceQuestion', selected?.value || '')
              }
              placeholder="Select source question or NULL"
              className="text-sm"
            />
          </div>
          <div className="flex items-end justify-end">
            {index === conditions.length - 1 ? (
              <button
                type="button"
                onClick={handleAdd}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded flex items-center gap-1"
              >
                <Plus size={14} /> Add
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-2 rounded flex items-center gap-1"
              >
                <Trash2 size={14} /> Remove
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
