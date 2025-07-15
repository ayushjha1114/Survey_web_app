'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addReference } from '@/store/slices/referenceSlice';
import { Info, Save, CheckCircle } from 'lucide-react';

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
      className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400"
      placeholder={`Enter ${label}`}
    />
  </div>
);

export default function ReferenceBlock() {
  const dispatch = useAppDispatch();
  const reference = useAppSelector((state) => state.reference);

  const [localReference, setLocalReference] = useState(reference);
  const [multiInput, setMultiInput] = useState('');
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    setLocalReference(reference);
  }, [reference]);

  const handleChange = (field: string, value: any) => {
    setLocalReference(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleMultiInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMultiInput(e.target.value);
  };

  const handleMultiKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === 'Tab' || e.key === ',') && multiInput.trim() !== '') {
      e.preventDefault();
      if (!isNaN(Number(multiInput.trim()))) {
        const updated = [...localReference.survey_reference_id, multiInput.trim()];
        handleChange('survey_reference_id', updated);
      }
      setMultiInput('');
    }
  };

  const handleRemoveValue = (val: string) => {
    const updated = localReference.survey_reference_id.filter(v => v !== val);
    handleChange('survey_reference_id', updated);
  };

  const handleSave = () => {
    dispatch(addReference(localReference));
    setSaved(true);
  };

  const allValid = [
    localReference.survey_primary_id,
    localReference.section_primary_id,
    localReference.option_primary_id,
    localReference.question_primary_id,
    localReference.survey_reference_primary_id,
    localReference.survey_section_primary_id,
    localReference.section_question_primary_id,
    localReference.question_option_primary_id,
    localReference.conditional_question_mapping_primary_id,
    localReference.condition_primary_id,
    localReference.tag_primary_id,
  ].every(val => val.trim() !== '');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {formField('Survey Primary ID', 'survey_primary_id', 'number', '', localReference.survey_primary_id, (val) => handleChange('survey_primary_id', val))}
        {formField('Section Primary ID', 'section_primary_id', 'number', '', localReference.section_primary_id, (val) => handleChange('section_primary_id', val))}
        {formField('Option Primary ID', 'option_primary_id', 'number', '', localReference.option_primary_id, (val) => handleChange('option_primary_id', val))}
        {formField('Question Primary ID', 'question_primary_id', 'number', '', localReference.question_primary_id, (val) => handleChange('question_primary_id', val))}
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
            {localReference.survey_reference_id.map((val, idx) => (
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
              className="flex-grow min-w-[100px]  text-gray-800 focus:outline-none text-sm px-1 placeholder:text-gray-400"
              placeholder="Type number and press Enter"
            />
          </div>
        </div>
        {formField('Survey Ref Primary ID', 'survey_reference_primary_id', 'number', '', localReference.survey_reference_primary_id, (val) => handleChange('survey_reference_primary_id', val))}
        {formField('Survey Section Primary ID', 'survey_section_primary_id', 'number', '', localReference.survey_section_primary_id, (val) => handleChange('survey_section_primary_id', val))}
        {formField('Section Question Primary ID', 'section_question_primary_id', 'number', '', localReference.section_question_primary_id, (val) => handleChange('section_question_primary_id', val))}
        {formField('Question Option Primary ID', 'question_option_primary_id', 'number', '', localReference.question_option_primary_id, (val) => handleChange('question_option_primary_id', val))}
        {formField('Conditional Mapping ID', 'conditional_question_mapping_primary_id', 'number', '', localReference.conditional_question_mapping_primary_id, (val) => handleChange('conditional_question_mapping_primary_id', val))}
        {formField('Condition Primary ID', 'condition_primary_id', 'number', '', localReference.condition_primary_id, (val) => handleChange('condition_primary_id', val))}
        {formField('Tag Primary ID', 'tag_primary_id', 'number', '', localReference.tag_primary_id, (val) => handleChange('tag_primary_id', val))}
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          disabled={!allValid || saved}
          title="Save Reference"
          className={`w-10 h-10 rounded-full flex items-center justify-center border transition ${
            saved && allValid
              ? 'border-green-600 text-green-600 bg-green-100'
              : !allValid
              ? 'border-gray-300 text-gray-300 cursor-not-allowed'
              : 'border-blue-500 text-blue-500 hover:bg-blue-50'
          }`}
        >
          {saved && allValid ? <CheckCircle size={20} /> : <Save size={20} />}
        </button>
      </div>
    </div>
  );
}
