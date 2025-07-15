'use client';

import { Plus, Trash2, Save } from 'lucide-react';
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

type LocalOption = {
  id: string;
  option: string;
  optionType: string;
  optionSeq: string;
  isNew: boolean;
};

export default function OptionBlock() {
  const dispatch = useAppDispatch();
  const savedOptions = useAppSelector(state => state.option.list);

  const [localOptions, setLocalOptions] = useState<LocalOption[]>([]);
  const [localErrors, setLocalErrors] = useState<Record<string, { option?: string; optionType?: string; optionSeq?: string }>>({});

  const validate = (option: string, optionType: string, optionSeq: string) => {
    const errors: { option?: string; optionType?: string; optionSeq?: string } = {};
    if (!option.trim()) errors.option = 'Option is required';
    if (!optionType.trim()) errors.optionType = 'Option type is required';
    if (!optionSeq.trim()) errors.optionSeq = 'Option sequence is required';
    else if (!/^[0-9]+$/.test(optionSeq.trim())) errors.optionSeq = 'Only numeric values allowed';
    return errors;
  };

  const handleFieldChange = (id: string, field: keyof Omit<LocalOption, 'id' | 'isNew'>, value: string) => {
    setLocalOptions(prev =>
      prev.map(o => (o.id === id ? { ...o, [field]: value } : o))
    );
    setLocalErrors(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: '' },
    }));
  };

  const handleAddRow = () => {
    setLocalOptions(prev => [
      ...prev,
      { id: uuidv4(), option: '', optionType: '', optionSeq: '', isNew: true },
    ]);
  };

  const handleSave = (row: LocalOption) => {
    const errors = validate(row.option, row.optionType, row.optionSeq);
    if (Object.keys(errors).length > 0) {
      setLocalErrors(prev => ({ ...prev, [row.id]: errors }));
      return;
    }

    dispatch(addOption({
      id: row.id,
      option: row.option,
      optionType: row.optionType,
      optionSeq: row.optionSeq,
    }));
    setLocalOptions(prev => prev.map(o => o.id === row.id ? { ...o, isNew: false } : o));
    setLocalErrors(prev => ({ ...prev, [row.id]: {} }));
  };

  const handleRemove = (id: string) => {
    const isSaved = savedOptions.find(o => o.id === id);
    if (isSaved) dispatch(removeOption(id));
    setLocalOptions(prev => prev.filter(o => o.id !== id));
    setLocalErrors(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      {localOptions.map((o) => (
        <div key={o.id} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="grid md:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-start">
            {/* Option */}
            <div>
              <label className="block text-sm font-medium text-gray-800">Option</label>
              <input
                type="text"
                className={`w-full mt-1 p-2 border rounded-md text-gray-900 ${localErrors[o.id]?.option ? 'border-red-500' : 'border-gray-300'
                  }`}
                value={o.option}
                onChange={(e) => handleFieldChange(o.id, 'option', e.target.value)}
              />
              <p className="text-red-500 text-sm mt-1 min-h-[20px]">{localErrors[o.id]?.option || ''}</p>
            </div>

            {/* Option Type */}
            <div>
              <label className="block text-sm font-medium text-gray-800">Option Type</label>
              <select
                className={`w-full mt-1 p-2 border rounded-md text-gray-900 ${localErrors[o.id]?.optionType ? 'border-red-500' : 'border-gray-300'
                  }`}
                value={o.optionType}
                onChange={(e) => handleFieldChange(o.id, 'optionType', e.target.value)}
              >
                <option value="">Select Type</option>
                {OPTION_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <p className="text-red-500 text-sm mt-1 min-h-[20px]">{localErrors[o.id]?.optionType || ''}</p>
            </div>

            {/* Option Sequence */}
            <div>
              <label className="block text-sm font-medium text-gray-800">Option Sequence</label>
              <input
                type="text"
                inputMode="numeric"
                className={`w-full mt-1 p-2 border rounded-md text-gray-900 ${localErrors[o.id]?.optionSeq ? 'border-red-500' : 'border-gray-300'
                  }`}
                value={o.optionSeq}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                  handleFieldChange(o.id, 'optionSeq', onlyNumbers);
                }}
              />
              <p className="text-red-500 text-sm mt-1 min-h-[20px]">{localErrors[o.id]?.optionSeq || ''}</p>
            </div>

            {/* Icon Buttons */}
            <div className="flex gap-4 pt-7 md:pt-[30px] items-center justify-start md:justify-end">
              {o.isNew && (
                <button
                  onClick={() => handleSave(o)}
                  title="Save Option"
                  className="text-green-600 hover:text-green-700"
                >
                  <Save size={20} />
                </button>
              )}
              <button
                onClick={() => handleRemove(o.id)}
                title="Delete Option"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add Option Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleAddRow}
          title="Add New Option"
          className="w-10 h-10 rounded-full border border-blue-500 text-blue-500 hover:bg-blue-50 flex items-center justify-center transition"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}
