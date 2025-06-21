'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateReference } from '@/store/slices/referenceSlice';
import { Info } from 'lucide-react';

const tooltipStyle =
  'relative group cursor-pointer inline-block ml-1 text-gray-400 hover:text-gray-600';

const formField = (label: string, name: string, type = 'number', tooltip = '', value: string, onChange: (val: string) => void) => (
  <div className="flex flex-col text-sm">
    <label className="text-xs font-medium text-gray-700 mb-1 flex items-center">
      {label}
      <span className={tooltipStyle}>
        <Info size={14} />
        <span className="absolute bottom-full mb-1 hidden group-hover:block text-xs bg-black text-white rounded px-2 py-1 z-10">
          {tooltip || 'Add info here later'}
        </span>
      </span>
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400"
      placeholder={`Enter ${label}`}
    />
  </div>
);

export default function ReferenceBlock() {
  const dispatch = useAppDispatch();
  const reference = useAppSelector((state) => state.reference);

  const handleChange = (field: string, value: any) => {
    // dispatch(updateReference({ field, value }));
  };

  const [multiInput, setMultiInput] = useState('');

  const handleMultiInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMultiInput(e.target.value);
  };

  const handleMultiKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === 'Tab' || e.key === ',') && multiInput.trim() !== '') {
      e.preventDefault();
      if (!isNaN(Number(multiInput.trim()))) {
        const updated = [...reference.survey_reference_id, multiInput.trim()];
        handleChange('survey_reference_id', updated);
      }
      setMultiInput('');
    }
  };

  const handleRemoveValue = (val: string) => {
    const updated = reference.survey_reference_id.filter(v => v !== val);
    handleChange('survey_reference_id', updated);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {formField('Survey Primary ID', 'survey_primary_id', 'number', '', reference.survey_primary_id, (val) => handleChange('survey_primary_id', val))}
        {formField('Section Primary ID', 'section_primary_id', 'number', '', reference.section_primary_id, (val) => handleChange('section_primary_id', val))}
        {formField('Option Primary ID', 'option_primary_id', 'number', '', reference.option_primary_id, (val) => handleChange('option_primary_id', val))}
        {formField('Question Primary ID', 'question_primary_id', 'number', '', reference.question_primary_id, (val) => handleChange('question_primary_id', val))}
        <div className="flex flex-col text-sm col-span-1">
          <label className="text-xs font-medium text-gray-700 mb-1 flex items-center">
            Survey Reference ID (Multi)
            <span className={tooltipStyle}>
              <Info size={14} />
              <span className="absolute bottom-full mb-1 hidden group-hover:block text-xs bg-black text-white rounded px-2 py-1 z-10">
                Enter multiple numbers, press Enter or comma
              </span>
            </span>
          </label>
          <div className="border border-gray-300 rounded px-2 py-1 text-sm flex flex-wrap gap-1 min-h-[36px] bg-white">
            {reference.survey_reference_id.map((val, idx) => (
              <div
                key={idx}
                className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded flex items-center gap-1 text-xs"
              >
                {val}
                <button onClick={() => handleRemoveValue(val)} className="ml-1 text-red-500">&times;</button>
              </div>
            ))}
            <input
              value={multiInput}
              onChange={handleMultiInput}
              onKeyDown={handleMultiKeyDown}
              className="flex-grow min-w-[100px] focus:outline-none text-sm px-1 placeholder:text-gray-400"
              placeholder="Type number and press Enter"
            />
          </div>
        </div>
        {formField('Survey Ref Primary ID', 'survey_reference_primary_id', 'number', '', reference.survey_reference_primary_id, (val) => handleChange('survey_reference_primary_id', val))}
        {formField('Survey Section Primary ID', 'survey_section_primary_id', 'number', '', reference.survey_section_primary_id, (val) => handleChange('survey_section_primary_id', val))}
        {formField('Section Question Primary ID', 'section_question_primary_id', 'number', '', reference.section_question_primary_id, (val) => handleChange('section_question_primary_id', val))}
        {formField('Question Option Primary ID', 'question_option_primary_id', 'number', '', reference.question_option_primary_id, (val) => handleChange('question_option_primary_id', val))}
        {formField('Conditional Mapping ID', 'conditional_question_mapping_primary_id', 'number', '', reference.conditional_question_mapping_primary_id, (val) => handleChange('conditional_question_mapping_primary_id', val))}
        {formField('Condition Primary ID', 'condition_primary_id', 'number', '', reference.condition_primary_id, (val) => handleChange('condition_primary_id', val))}
        {formField('Tag Primary ID', 'tag_primary_id', 'number', '', reference.tag_primary_id, (val) => handleChange('tag_primary_id', val))}
      </div>
    </div>
  );
}
