'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addTag } from '@/store/slices/tagSlice';
import { Save, CheckCircle } from 'lucide-react';

type LocalTag = {
  id: string;
  questionName: string;
  tag_name: string;
  tag_parentId: string;
  tag_parentName: string;
  isNew: boolean;
  isDirty: boolean;
};

export default function TagBlock() {
  const dispatch = useAppDispatch();
  const questions = useAppSelector((state) => state.question.list);

  const [localTags, setLocalTags] = useState<LocalTag[]>([]);
  const [localErrors, setLocalErrors] = useState<
    Record<string, { tag_name?: string; tag_parentId?: string; tag_parentName?: string }>
  >({});

  useEffect(() => {
    if (questions.length > 0) {
      const generatedTags = questions.map((q) => ({
        id: q.id,
        questionName: q.id,
        tag_name: '',
        tag_parentId: '',
        tag_parentName: '',
        isNew: true,
        isDirty: false,
      }));
      setLocalTags(generatedTags);
    }
  }, [questions]);

  const validate = (tag: LocalTag) => {
    const errors: { tag_name?: string; tag_parentId?: string; tag_parentName?: string } = {};
    if (!tag.tag_name.trim()) errors.tag_name = 'Tag name is required';
    if (!tag.tag_parentId.trim()) errors.tag_parentId = 'Parent ID is required';
    else if (!/^[0-9]+$/.test(tag.tag_parentId.trim())) errors.tag_parentId = 'Only numeric values allowed';
    if (!tag.tag_parentName.trim()) errors.tag_parentName = 'Parent name is required';
    return errors;
  };

  const handleFieldChange = (
    id: string,
    field: keyof Omit<LocalTag, 'id' | 'isNew' | 'isDirty' | 'questionName'>,
    value: string
  ) => {
    setLocalTags((prev) =>
      prev.map((tag) =>
        tag.id === id ? { ...tag, [field]: value, isDirty: true } : tag
      )
    );
    setLocalErrors((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: '' },
    }));
  };

  const handleSave = (tag: LocalTag) => {
    const errors = validate(tag);
    if (Object.keys(errors).length > 0) {
      setLocalErrors((prev) => ({ ...prev, [tag.id]: errors }));
      return;
    }

    dispatch(
      addTag({
        id: tag.id,
        questionName: tag.questionName,
        tag_name: tag.tag_name,
        tag_parentId: tag.tag_parentId,
        tag_parentName: tag.tag_parentName,
      })
    );

    setLocalTags((prev) =>
      prev.map((t) => (t.id === tag.id ? { ...t, isNew: false, isDirty: false } : t))
    );
    setLocalErrors((prev) => ({ ...prev, [tag.id]: {} }));
  };

  if (questions.length === 0) return null;

  return (
    <div className="space-y-4">
      {localTags.map((tag) => {
        const question = questions.find((q) => q.id === tag.questionName);

        return (
          <div key={tag.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr] gap-4 items-start text-gray-800">
              {/* Question (readonly) */}
              <div>
                <label className="block text-xs font-medium mb-1">Question</label>
                <input
                  type="text"
                  value={question?.question || ''}
                  disabled
                  className="w-full border border-gray-300 bg-gray-100 rounded px-2 py-1 text-sm"
                />
              </div>

              {/* Tag Name */}
              <div>
                <label className="block text-xs font-medium mb-1">Tag Name</label>
                <input
                  type="text"
                  value={tag.tag_name}
                  onChange={(e) => handleFieldChange(tag.id, 'tag_name', e.target.value)}
                  className={`w-full border rounded px-2 py-1 text-sm ${
                    localErrors[tag.id]?.tag_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter tag name"
                />
                <p className="text-red-500 text-xs mt-1 min-h-[18px]">{localErrors[tag.id]?.tag_name || ''}</p>
              </div>

              {/* Parent ID */}
              <div>
                <label className="block text-xs font-medium mb-1">Tag Parent ID</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={tag.tag_parentId}
                  onChange={(e) =>
                    handleFieldChange(tag.id, 'tag_parentId', e.target.value.replace(/[^0-9]/g, ''))
                  }
                  className={`w-full border rounded px-2 py-1 text-sm ${
                    localErrors[tag.id]?.tag_parentId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter parent ID"
                />
                <p className="text-red-500 text-xs mt-1 min-h-[18px]">{localErrors[tag.id]?.tag_parentId || ''}</p>
              </div>

              {/* Parent Name */}
              <div>
                <label className="block text-xs font-medium mb-1">Tag Parent Name</label>
                <input
                  type="text"
                  value={tag.tag_parentName}
                  onChange={(e) => handleFieldChange(tag.id, 'tag_parentName', e.target.value)}
                  className={`w-full border rounded px-2 py-1 text-sm ${
                    localErrors[tag.id]?.tag_parentName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter parent name"
                />
                <p className="text-red-500 text-xs mt-1 min-h-[18px]">{localErrors[tag.id]?.tag_parentName || ''}</p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Global Save Button */}
      <div className="flex justify-end mt-4">
        {localTags.some(tag => tag.isDirty) ? (
          <button
            onClick={() => {
              localTags.filter(tag => tag.isDirty).forEach(handleSave);
            }}
            title="Save Tags"
            className="w-10 h-10 rounded-full border border-green-600 text-green-600 hover:bg-green-100 flex items-center justify-center transition"
          >
            <Save size={20} />
          </button>
        ) : (
          <button
            disabled
            title="All tags are saved"
            className="w-10 h-10 rounded-full border border-gray-300 text-gray-300 cursor-not-allowed flex items-center justify-center"
          >
            <CheckCircle size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
