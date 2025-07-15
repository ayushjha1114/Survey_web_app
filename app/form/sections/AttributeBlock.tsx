'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addAttribute } from '@/store/slices/attributeSlice';
import { Save, CheckCircle } from 'lucide-react';

interface LocalAttribute {
  id: string;
  questionId: string;
  question: string;
  attribute_name: string;
  attribute_primary_id: string;
  attribute_group_id: string;
  isSaved: boolean;
}

export default function AttributeBlock() {
  const dispatch = useAppDispatch();
  const questions = useAppSelector((state) => state.question.list);

  const [localAttributes, setLocalAttributes] = useState<LocalAttribute[]>([]);

  useEffect(() => {
    if (questions.length > 0) {
      const rows: LocalAttribute[] = questions.map((q) => ({
        id: q.id,
        questionId: q.id,
        question: q.question,
        attribute_name: '',
        attribute_primary_id: '',
        attribute_group_id: '',
        isSaved: false,
      }));
      setLocalAttributes(rows);
    }
  }, [questions]);

  const handleFieldChange = (
    id: string,
    field: keyof Omit<LocalAttribute, 'id' | 'questionId' | 'question' | 'isSaved'>,
    value: string
  ) => {
    setLocalAttributes((prev) =>
      prev.map((attr) =>
        attr.id === id ? { ...attr, [field]: value, isSaved: false } : attr
      )
    );
  };

  const allValid = localAttributes.every(
    (attr) =>
      attr.attribute_name.trim() &&
      attr.attribute_primary_id.trim() &&
      attr.attribute_group_id.trim()
  );

  const handleSave = () => {
    if (!allValid) return;
    localAttributes.forEach((attr) => {
      dispatch(
        addAttribute({
          id: attr.id,
          questionId: attr.questionId,
          attribute_name: attr.attribute_name,
          attribute_primary_id: attr.attribute_primary_id,
          attribute_group_id: attr.attribute_group_id,
        })
      );
    });
    setLocalAttributes((prev) => prev.map((a) => ({ ...a, isSaved: true })));
  };

  if (questions.length === 0) return null;

  return (
    <div className="space-y-4">
      {localAttributes.map((attr) => (
        <div
          key={attr.id}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr] gap-4 items-start text-gray-800">
            <div>
              <label className="block text-xs font-medium mb-1">Question</label>
              <input
                type="text"
                value={attr.question}
                disabled
                className="w-full border border-gray-300 bg-gray-100 rounded px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Attribute Name</label>
              <input
                type="text"
                value={attr.attribute_name}
                onChange={(e) => handleFieldChange(attr.id, 'attribute_name', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="Enter attribute name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Primary ID</label>
              <input
                type="text"
                value={attr.attribute_primary_id}
                onChange={(e) =>
                  handleFieldChange(attr.id, 'attribute_primary_id', e.target.value.replace(/[^0-9]/g, ''))
                }
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="Enter primary ID"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Group ID</label>
              <input
                type="text"
                value={attr.attribute_group_id}
                onChange={(e) => handleFieldChange(attr.id, 'attribute_group_id', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="Enter group ID"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          disabled={!allValid}
          title="Save Attributes"
          className={`w-10 h-10 rounded-full flex items-center justify-center border transition ${
            allValid
              ? 'border-green-600 text-green-600 hover:bg-green-100'
              : 'border-gray-300 text-gray-300 cursor-not-allowed'
          }`}
        >
          {localAttributes.every(attr => attr.isSaved) ? <CheckCircle size={20} /> : <Save size={20} />}
        </button>
      </div>
    </div>
  );
}
