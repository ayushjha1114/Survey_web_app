'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addQuestion, removeQuestion, updateQuestion } from '@/store/slices/questionSlice';
import { Plus, Trash2 } from 'lucide-react';
import Select from 'react-select';

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

// Shared styles for react-select
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
  }),
};

export default function QuestionBlock() {
  const dispatch = useAppDispatch();
  const questions = useAppSelector((state) => state.question.list);
  const options = useAppSelector((state) => state.option.list);
  const sections = useAppSelector((state) => state.section.list);

  const optionRefOptions = options
    .filter(opt => opt.optionSeq)
    .map(opt => ({ value: opt.id, label: `${opt.option} (${opt.optionSeq})` }));

  const sectionRefOptions = sections
    .filter(sec => sec.sectionSeq)
    .map(sec => ({ value: sec.id, label: `${sec.section} (${sec.sectionSeq})` }));

  const handleAdd = () => {
    dispatch(
      addQuestion({
        id: crypto.randomUUID(),
        question: '',
        questionType: '',
        questionOptionRef: [],
        questionSectionRef: []
      })
    );
  };

  const handleRemove = (id: string) => {
    dispatch(removeQuestion(id));
  };

  const handleChange = (id: string, field: string, value: any) => {
    // dispatch(updateQuestion({ id, field, value }));
  };

  return (
    <div className="space-y-4">
      {questions.map((item, index) => (
        <div
          key={item.id}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end text-gray-800">
            {/* Question Input */}
            <div>
              <label className="block text-xs font-medium mb-1">Question</label>
              <input
                type="text"
                value={item.question}
                onChange={(e) => handleChange(item.id, 'question', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="Enter question"
              />
            </div>

            {/* Question Type Dropdown */}
            <div>
              <label className="block text-xs font-medium mb-1">Type</label>
              <Select
                options={questionTypeOptions}
                value={questionTypeOptions.find(opt => opt.value === item.questionType) || null}
                onChange={(selected) => handleChange(item.id, 'questionType', selected?.value || '')}
                styles={customSelectStyles}
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
              />
            </div>

            {/* Option Reference Multi-Select */}
            <div>
              <label className="block text-xs font-medium mb-1">Option Ref</label>
              <Select
                isMulti
                options={optionRefOptions}
                value={optionRefOptions.filter(opt => item.questionOptionRef?.includes(opt.value))}
                onChange={(selected) =>
                  handleChange(item.id, 'questionOptionRef', selected?.map(s => s.value) || [])
                }
                styles={customSelectStyles}
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
              />
            </div>

            {/* Section Reference Multi-Select */}
            <div>
              <label className="block text-xs font-medium mb-1">Section Ref</label>
              <Select
                isMulti
                options={sectionRefOptions}
                value={sectionRefOptions.filter(opt => item.questionSectionRef?.includes(opt.value))}
                onChange={(selected) =>
                  handleChange(item.id, 'questionSectionRef', selected?.map(s => s.value) || [])
                }
                styles={customSelectStyles}
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
              />
            </div>

            {/* Add / Remove Button */}
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
                  onClick={() => handleRemove(item.id)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded flex items-center gap-1"
                >
                  <Trash2 size={14} /> Remove
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
