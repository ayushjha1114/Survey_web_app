'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addSection, removeSection, updateSection } from '@/store/slices/sectionSlice';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function SectionBlock() {
  const dispatch = useAppDispatch();
  const sections = useAppSelector(state => state.section.list);
  const [localErrors, setLocalErrors] = useState<Record<string, { section?: string; sectionSeq?: string }>>({});

  const validate = (section: string, sectionSeq: string) => {
    const errors: { section?: string; sectionSeq?: string } = {};
    if (!section.trim()) errors.section = 'Section is required';
    if (!sectionSeq.trim()) errors.sectionSeq = 'Section sequence is required';
    else if (!/^[0-9]+$/.test(sectionSeq.trim())) errors.sectionSeq = 'Only numeric values allowed';
    return errors;
  };

  const handleAdd = (id: string, section: string, sectionSeq: string) => {
    const errors = validate(section, sectionSeq);
    if (Object.keys(errors).length > 0) {
      setLocalErrors(prev => ({ ...prev, [id]: errors }));
      return;
    }
    setLocalErrors(prev => ({ ...prev, [id]: {} }));
    dispatch(addSection({ id: uuidv4(), section: '', sectionSeq: '' }));
  };

  const handleRemove = (id: string) => {
    dispatch(removeSection(id));
    setLocalErrors(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleChange = (id: string, field: 'section' | 'sectionSeq', value: string) => {
    const item = sections.find(s => s.id === id);
    if (item) {
      dispatch(updateSection({ ...item, [field]: value }));
      setLocalErrors(prev => ({ ...prev, [id]: { ...prev[id], [field]: '' } }));
    }
  };

  return (
    <>
      {sections.map((s, idx) => (
        <div key={s.id} className="bg-white border border-gray-200 p-4 rounded-xl shadow-md mb-4">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-800">Section</label>
              <input
                type="text"
                className={`w-full mt-1 p-2 border text-gray-900 ${localErrors[s.id]?.section ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                value={s.section}
                onChange={(e) => handleChange(s.id, 'section', e.target.value)}
              />
              {localErrors[s.id]?.section && <p className="text-red-500 text-sm mt-1">{localErrors[s.id].section}</p>}
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-800">Section Sequence</label>
              <input
                type="text"
                inputMode="numeric"
                className={`w-full mt-1 p-2 border text-gray-900 ${localErrors[s.id]?.sectionSeq ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                value={s.sectionSeq}
                onChange={(e) => handleChange(s.id, 'sectionSeq', e.target.value)}
              />
              {localErrors[s.id]?.sectionSeq && <p className="text-red-500 text-sm mt-1">{localErrors[s.id].sectionSeq}</p>}
            </div>
            <div className="flex items-end h-full">
              {idx === sections.length - 1 ? (
                <button
                  onClick={() => handleAdd(s.id, s.section, s.sectionSeq)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <Plus size={18} /> Add
                </button>
              ) : (
                <button
                  onClick={() => handleRemove(s.id)}
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
