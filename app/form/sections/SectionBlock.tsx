'use client';

import { Plus, Trash2, Save } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addSection, removeSection, updateSection } from '@/store/slices/sectionSlice';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

type LocalSection = {
  id: string;
  section: string;
  sectionSeq: string;
  isNew: boolean;
};

export default function SectionBlock() {
  const dispatch = useAppDispatch();
  const savedSections = useAppSelector(state => state.section.list);
  const [localSections, setLocalSections] = useState<LocalSection[]>([]);
  const [localErrors, setLocalErrors] = useState<Record<string, { section?: string; sectionSeq?: string }>>({});

  const validate = (section: string, sectionSeq: string) => {
    const errors: { section?: string; sectionSeq?: string } = {};
    if (!section.trim()) errors.section = 'Section is required';
    if (!sectionSeq.trim()) errors.sectionSeq = 'Section sequence is required';
    else if (!/^[0-9]+$/.test(sectionSeq.trim())) errors.sectionSeq = 'Only numeric values allowed';
    return errors;
  };

  const handleFieldChange = (id: string, field: keyof Omit<LocalSection, 'id' | 'isNew'>, value: string) => {
    setLocalSections(prev =>
      prev.map(s => (s.id === id ? { ...s, [field]: value } : s))
    );
    setLocalErrors(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: '' },
    }));
  };

  const handleAddRow = () => {
    setLocalSections(prev => [...prev, { id: uuidv4(), section: '', sectionSeq: '', isNew: true }]);
  };

  const handleSave = (row: LocalSection) => {
    const errors = validate(row.section, row.sectionSeq);
    if (Object.keys(errors).length > 0) {
      setLocalErrors(prev => ({ ...prev, [row.id]: errors }));
      return;
    }
    dispatch(addSection({ id: row.id, section: row.section, sectionSeq: row.sectionSeq }));
    setLocalSections(prev => prev.map(s => s.id === row.id ? { ...s, isNew: false } : s));
    setLocalErrors(prev => ({ ...prev, [row.id]: {} }));
  };

  const handleRemove = (id: string) => {
    const isSaved = savedSections.find(s => s.id === id);
    if (isSaved) dispatch(removeSection(id));
    setLocalSections(prev => prev.filter(s => s.id !== id));
    setLocalErrors(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      {localSections.map((s) => (
        <div key={s.id} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="grid md:grid-cols-[1fr_1fr_auto] gap-4 items-start">
            {/* Section Name */}
            <div>
              <label className="block text-sm font-medium text-gray-800">Section</label>
              <input
                type="text"
                className={`w-full mt-1 p-2 border rounded-md text-gray-900 ${localErrors[s.id]?.section ? 'border-red-500' : 'border-gray-300'
                  }`}
                value={s.section}
                onChange={(e) => handleFieldChange(s.id, 'section', e.target.value)}
              />
              <p className="text-red-500 text-sm mt-1 min-h-[20px]">{localErrors[s.id]?.section || ''}</p>
            </div>

            {/* Section Sequence */}
            <div>
              <label className="block text-sm font-medium text-gray-800">Section Sequence</label>
              <input
                type="text"
                inputMode="numeric"
                className={`w-full mt-1 p-2 border rounded-md text-gray-900 ${localErrors[s.id]?.sectionSeq ? 'border-red-500' : 'border-gray-300'
                  }`}
                value={s.sectionSeq}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                  handleFieldChange(s.id, 'sectionSeq', onlyNumbers);
                }}
              />
              <p className="text-red-500 text-sm mt-1 min-h-[20px]">{localErrors[s.id]?.sectionSeq || ''}</p>
            </div>

            {/* Icon Buttons */}
            <div className="flex gap-4 pt-7 md:pt-[30px] items-center justify-start md:justify-end">
              {s.isNew && (
                <button
                  onClick={() => handleSave(s)}
                  title="Save Section"
                  className="text-green-600 hover:text-green-700"
                >
                  <Save size={20} />
                </button>
              )}
              <button
                onClick={() => handleRemove(s.id)}
                title="Delete Section"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add Section Icon Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleAddRow}
          title="Add New Section"
          className="w-10 h-10 rounded-full border border-blue-500 text-blue-500 hover:bg-blue-50 flex items-center justify-center transition"
        >
          <Plus size={20} />
        </button>

      </div>
    </div>
  );
}
