'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addAttribute, removeAttribute, updateAttribute } from '@/store/slices/attributeSlice';
import { Trash2, Plus } from 'lucide-react';

export default function AttributeBlock() {
  const dispatch = useAppDispatch();
  const attributes = useAppSelector((state) => state.attribute.list);
  const questions = useAppSelector((state) => state.question.list);

  const handleAdd = () => {
    dispatch(addAttribute({
      id: crypto.randomUUID(),
      questionId: '',
      attribute_name: '',
      attribute_primary_id: '',
      attribute_group_id: ''
    }));
  };

  const handleRemove = (id: string) => {
    dispatch(removeAttribute(id));
  };

  const handleChange = (id: string, field: string, value: any) => {
    dispatch(updateAttribute({ id, field, value }));
  };

  return (
    <div className="space-y-4">
      {questions.map((question, index) => {
        const attributeItem = attributes.find(attr => attr.questionId === question.id) || {
          id: crypto.randomUUID(),
          questionId: question.id,
          attribute_name: '',
          attribute_primary_id: '',
          attribute_group_id: ''
        };

        return (
          <div key={attributeItem.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end text-gray-800">
              <div>
                <label className="block text-xs font-medium mb-1">Question</label>
                <input
                  type="text"
                  value={question.question}
                  disabled
                  className="w-full border border-gray-300 bg-gray-100 rounded px-2 py-1 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Attribute Name</label>
                <input
                  type="text"
                  value={attributeItem.attribute_name}
                  onChange={(e) => handleChange(attributeItem.id, 'attribute_name', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  placeholder="Enter attribute name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Primary ID</label>
                <input
                  type="number"
                  value={attributeItem.attribute_primary_id}
                  onChange={(e) => handleChange(attributeItem.id, 'attribute_primary_id', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  placeholder="Enter primary ID"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Group ID</label>
                <input
                  type="text"
                  value={attributeItem.attribute_group_id}
                  onChange={(e) => handleChange(attributeItem.id, 'attribute_group_id', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  placeholder="Enter group ID"
                />
              </div>
              <div className="flex justify-end mt-5 md:mt-0">
                {index === questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleAdd}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded flex items-center gap-1"
                  >
                    <Plus size={14} /> Add
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRemove(attributeItem.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}