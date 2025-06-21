'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addOption, removeOption, updateOption } from '@/store/slices/optionSlice';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const OPTION_TYPES = [
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
];

export default function OptionBlock() {
  const dispatch = useAppDispatch();
  const options = useAppSelector(state => state.option.list);
  const [localErrors, setLocalErrors] = useState<Record<string, { option?: string; optionType?: string; optionSeq?: string }>>({});

  const validate = (option: string, optionType: string, optionSeq: string) => {
    const errors: { option?: string; optionType?: string; optionSeq?: string } = {};
    if (!option.trim()) errors.option = 'Option is required';
    if (!optionType.trim()) errors.optionType = 'Option type is required';
    if (!optionSeq.trim()) errors.optionSeq = 'Option sequence is required';
    else if (!/^[0-9]+$/.test(optionSeq.trim())) errors.optionSeq = 'Only numeric values allowed';
    return errors;
  };

  const handleAdd = (id: string, option: string, optionType: string, optionSeq: string) => {
    const errors = validate(option, optionType, optionSeq);
    if (Object.keys(errors).length > 0) {
      setLocalErrors(prev => ({ ...prev, [id]: errors }));
      return;
    }
    setLocalErrors(prev => ({ ...prev, [id]: {} }));
    dispatch(addOption({ id: uuidv4(), option: '', optionType: '', optionSeq: '' }));
  };

  const handleRemove = (id: string) => {
    dispatch(removeOption(id));
    setLocalErrors(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleChange = (id: string, field: 'option' | 'optionType' | 'optionSeq', value: string) => {
    const item = options.find(o => o.id === id);
    if (item) {
      dispatch(updateOption({ ...item, [field]: value }));
      setLocalErrors(prev => ({ ...prev, [id]: { ...prev[id], [field]: '' } }));
    }
  };

  return (
    <>
      {options.map((o, idx) => (
        <div key={o.id} className="bg-white border border-gray-200 p-4 rounded-xl shadow-md mb-4">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-800">Option</label>
              <input
                type="text"
                className={`w-full mt-1 p-2 border text-gray-900 ${localErrors[o.id]?.option ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                value={o.option}
                onChange={(e) => handleChange(o.id, 'option', e.target.value)}
              />
              {localErrors[o.id]?.option && <p className="text-red-500 text-sm mt-1">{localErrors[o.id].option}</p>}
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-800">Option Type</label>
              <select
                className={`w-full mt-1 p-2 border text-gray-900 ${localErrors[o.id]?.optionType ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                value={o.optionType}
                onChange={(e) => handleChange(o.id, 'optionType', e.target.value)}
              >
                <option value="">Select Type</option>
                {OPTION_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {localErrors[o.id]?.optionType && <p className="text-red-500 text-sm mt-1">{localErrors[o.id].optionType}</p>}
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-800">Option Sequence</label>
              <input
                type="text"
                inputMode="numeric"
                className={`w-full mt-1 p-2 border text-gray-900 ${localErrors[o.id]?.optionSeq ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                value={o.optionSeq}
                onChange={(e) => handleChange(o.id, 'optionSeq', e.target.value)}
              />
              {localErrors[o.id]?.optionSeq && <p className="text-red-500 text-sm mt-1">{localErrors[o.id].optionSeq}</p>}
            </div>

            <div className="flex items-end h-full">
              {idx === options.length - 1 ? (
                <button
                  onClick={() => handleAdd(o.id, o.option, o.optionType, o.optionSeq)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <Plus size={18} /> Add
                </button>
              ) : (
                <button
                  onClick={() => handleRemove(o.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  <Trash2 size={18} /> Remove
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
