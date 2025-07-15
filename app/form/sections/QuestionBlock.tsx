'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addQuestion, removeQuestion, updateQuestion } from '@/store/slices/questionSlice';
import { Plus, Trash2, Save } from 'lucide-react';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';

const questionTypeOptions = [
  'SingleSelectDropDown',
  'MultiSelect',
  'None',
  'Toggle',
  'InputNumber',
  'DateType',
  'MultiImage',
  'IncrementDecrementList',
  'RadioButton',
  'MultiSelectDropDown',
].map(type => ({ value: type, label: type }));

const customSelectStyles = {
  control: (base: any) => ({
    ...base,
    minHeight: '30px',
    fontSize: '0.875rem',
    zIndex: 50,
  }),
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 9999,
    color: '#4A5568',
  }),
};

type LocalQuestion = {
  id: string;
  question: string;
  questionType: string;
  questionOptionRef: string[];
  questionSectionRef: string[];
  isNew: boolean;
};

export default function QuestionBlock() {
  const dispatch = useAppDispatch();
  const savedQuestions = useAppSelector((state) => state.question.list);
  const options = useAppSelector((state) => state.option.list);
  const sections = useAppSelector((state) => state.section.list);

  const [localQuestions, setLocalQuestions] = useState<LocalQuestion[]>([]);

  const optionRefOptions = options
    .filter(opt => opt.optionSeq)
    .map(opt => ({ value: opt.id, label: `${opt.option} (${opt.optionSeq})` }));

  const sectionRefOptions = sections
    .filter(sec => sec.sectionSeq)
    .map(sec => ({ value: sec.id, label: `${sec.section} (${sec.sectionSeq})` }));

  const handleFieldChange = (
    id: string,
    field: keyof Omit<LocalQuestion, 'id' | 'isNew'>,
    value: any
  ) => {
    setLocalQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleAddRow = () => {
    setLocalQuestions(prev => [
      ...prev,
      {
        id: uuidv4(),
        question: '',
        questionType: '',
        questionOptionRef: [],
        questionSectionRef: [],
        isNew: true,
      },
    ]);
  };

  const handleSave = (q: LocalQuestion) => {
    if (!q.question.trim() || !q.questionType.trim()) return;
    dispatch(
      addQuestion({
        id: q.id,
        question: q.question,
        questionType: q.questionType,
        questionOptionRef: q.questionOptionRef,
        questionSectionRef: q.questionSectionRef,
      })
    );
    setLocalQuestions(prev =>
      prev.map(item => (item.id === q.id ? { ...item, isNew: false } : item))
    );
  };

  const handleRemove = (id: string) => {
    const isSaved = savedQuestions.find(q => q.id === id);
    if (isSaved) dispatch(removeQuestion(id));
    setLocalQuestions(prev => prev.filter(q => q.id !== id));
  };

  return (
    <div className="space-y-4">
      {localQuestions.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 items-start text-gray-800">
            {/* Question */}
            <div>
              <label className="block text-xs font-medium mb-1">Question</label>
              <input
                type="text"
                value={item.question}
                onChange={(e) => handleFieldChange(item.id, 'question', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="Enter question"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-medium mb-1">Type</label>
              <Select
                options={questionTypeOptions}
                value={questionTypeOptions.find(opt => opt.value === item.questionType) || null}
                onChange={(selected) =>
                  handleFieldChange(item.id, 'questionType', selected?.value || '')
                }
                styles={customSelectStyles}
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
              />
            </div>

            {/* Option Ref */}
            <div>
              <label className="block text-xs font-medium mb-1">Option Ref</label>
              <Select
                isMulti
                options={optionRefOptions}
                value={optionRefOptions.filter(opt => item.questionOptionRef.includes(opt.value))}
                onChange={(selected) =>
                  handleFieldChange(item.id, 'questionOptionRef', selected.map(s => s.value))
                }
                styles={customSelectStyles}
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
              />
            </div>

            {/* Section Ref */}
            <div>
              <label className="block text-xs font-medium mb-1">Section Ref</label>
              <Select
                isMulti
                options={sectionRefOptions}
                value={sectionRefOptions.filter(opt => item.questionSectionRef.includes(opt.value))}
                onChange={(selected) =>
                  handleFieldChange(item.id, 'questionSectionRef', selected.map(s => s.value))
                }
                styles={customSelectStyles}
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
              />
            </div>

            {/* Action Icons */}
            <div className="flex items-center justify-end gap-3 pt-6 md:pt-7">
              {item.isNew && (
                <button
                  type="button"
                  onClick={() => handleSave(item)}
                  title="Save Question"
                  className="text-green-600 hover:text-green-700"
                >
                  <Save size={20} />
                </button>
              )}
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                title="Delete Question"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add Question Icon */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleAddRow}
          title="Add New Question"
          className="w-10 h-10 rounded-full border border-blue-500 text-blue-500 hover:bg-blue-50 flex items-center justify-center transition"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}
