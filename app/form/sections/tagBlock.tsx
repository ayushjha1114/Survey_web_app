'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addTag, removeTag, updateTag } from '@/store/slices/tagSlice';
import { Trash2, Plus } from 'lucide-react';

export default function TagBlock() {
  const dispatch = useAppDispatch();
  const tags = useAppSelector((state) => state.tag.list);
  const questions = useAppSelector((state) => state.question.list);

  const handleAdd = () => {
    dispatch(addTag({
      id: crypto.randomUUID(),
      questionName: '',
      tag_name: '',
      tag_parentId: '',
      tag_parentName: '',
    }));
  };

  const handleRemove = (id: string) => {
    dispatch(removeTag(id));
  };

  const handleChange = (id: string, field: string, value: any) => {
    dispatch(updateTag({ id, field, value }));
  };

  return (
    <div className="space-y-4">
      {questions.map((question, index) => {
        const tagItem = tags.find(tag => tag.questionName === question.id) || {
          id: crypto.randomUUID(),
          questionId: question.id,
          tag_name: '',
          tag_parentId: '',
          tag_parentName: '',
        };

        return (
          <div key={tagItem.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
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
                <label className="block text-xs font-medium mb-1">Tag Name</label>
                <input
                  type="text"
                  value={tagItem.tag_name}
                  onChange={(e) => handleChange(tagItem.id, 'tag_name', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  placeholder="Enter tag name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Tag Parent ID</label>
                <input
                  type="number"
                  value={tagItem.tag_parentId}
                  onChange={(e) => handleChange(tagItem.id, 'tag_parentId', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  placeholder="Enter parent ID"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Tag Parent Name</label>
                <input
                  type="text"
                  value={tagItem.tag_parentName}
                  onChange={(e) => handleChange(tagItem.id, 'tag_parentName', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  placeholder="Enter parent name"
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
                    onClick={() => handleRemove(tagItem.id)}
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
