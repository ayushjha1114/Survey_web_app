'use client';

import { useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addSurvey, removeSurvey, updateSurvey } from '@/store/slices/surveySlice';
import { v4 as uuidv4 } from 'uuid';

type LocalSurvey = {
  id: string;
  name: string;
  section_ref: number[];
  isNew: boolean;
};

export default function SurveyBlock() {
  const dispatch = useAppDispatch();
  const surveysFromStore = useAppSelector(state => state.survey.list);

  const [localSurveys, setLocalSurveys] = useState<LocalSurvey[]>([]);
  const [localErrors, setLocalErrors] = useState<Record<string, { surveyName?: string; surveyRef?: string }>>({});
  const [multiInputs, setMultiInputs] = useState<Record<string, string>>({});

  const validate = (surveyName: string = '', surveyRef: number[] = []) => {
    const errors: { surveyName?: string; surveyRef?: string } = {};
    if (!surveyName.trim()) errors.surveyName = 'Survey name is required';
    if (!surveyRef || surveyRef.length === 0) errors.surveyRef = 'At least one section is required';
    return errors;
  };

  const handleFieldChange = (id: string, field: keyof Omit<LocalSurvey, 'id' | 'isNew'>, value: any) => {
    setLocalSurveys(prev =>
      prev.map(s => (s.id === id ? { ...s, [field]: value } : s))
    );
    setLocalErrors(prev => ({
      ...prev,
      [id]: { ...prev[id], [field === 'name' ? 'surveyName' : 'surveyRef']: '' },
    }));
  };

  const handleAddRow = () => {
    setLocalSurveys(prev => [...prev, { id: uuidv4(), name: '', section_ref: [], isNew: true }]);
  };

  const handleSave = (row: LocalSurvey) => {
    const errors = validate(row.name, row.section_ref);
    if (Object.keys(errors).length > 0) {
      setLocalErrors(prev => ({ ...prev, [row.id]: errors }));
      return;
    }

    dispatch(addSurvey({ id: row.id, name: row.name, section_ref: row.section_ref }));
    setLocalSurveys(prev => prev.map(s => s.id === row.id ? { ...s, isNew: false } : s));
    setLocalErrors(prev => ({ ...prev, [row.id]: {} }));
  };

  const handleRemove = (id: string) => {
    const isSaved = surveysFromStore.find(s => s.id === id);
    if (isSaved) dispatch(removeSurvey(id));
    setLocalSurveys(prev => prev.filter(s => s.id !== id));
    setLocalErrors(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleMultiInput = (id: string, value: string) => {
    setMultiInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleMultiKeyDown = (id: string, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const inputVal = multiInputs[id]?.trim();
      if (!inputVal) return;

      const num = parseInt(inputVal, 10);
      if (isNaN(num)) {
        setLocalErrors(prev => ({
          ...prev,
          [id]: { ...prev[id], surveyRef: 'Only numbers are allowed' },
        }));
        return;
      }

      const survey = localSurveys.find(s => s.id === id);
      if (!survey) return;

      const sectionRef = survey.section_ref ?? [];
      if (!sectionRef.includes(num)) {
        const updated = {
          ...survey,
          section_ref: [...sectionRef, num],
        };
        setLocalSurveys(prev => prev.map(s => s.id === id ? updated : s));
      }

      setMultiInputs(prev => ({ ...prev, [id]: '' }));
      setLocalErrors(prev => ({
        ...prev,
        [id]: { ...prev[id], surveyRef: '' },
      }));
    }
  };

  const removeRefItem = (id: string, refValue: number) => {
    setLocalSurveys(prev =>
      prev.map(s =>
        s.id === id
          ? { ...s, section_ref: (s.section_ref ?? []).filter(n => n !== refValue) }
          : s
      )
    );
  };

  return (
    <div className="space-y-4">
      {localSurveys.map((s) => (
        <div key={s.id} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="grid md:grid-cols-[1fr_1fr_auto] gap-4 items-start">
            {/* Survey Name */}
            <div>
              <label className="block text-sm font-medium text-gray-800">Survey Name</label>
              <input
                type="text"
                className={`w-full mt-1 p-2 border rounded-md text-gray-900 ${localErrors[s.id]?.surveyName ? 'border-red-500' : 'border-gray-300'
                  }`}
                value={s.name}
                onChange={(e) => handleFieldChange(s.id, 'name', e.target.value)}
              />
              <p className="text-red-500 text-sm mt-1 min-h-[20px]">{localErrors[s.id]?.surveyName || ''}</p>
            </div>

            {/* Survey Section Reference */}
            <div>
              <label className="block text-sm font-medium text-gray-800">Survey Section Reference</label>
              <div className="flex flex-wrap items-center gap-2 mt-1 border p-2 rounded-md min-h-[40px] border-gray-300">
                {(s.section_ref ?? []).map(ref => (
                  <div
                    key={ref}
                    className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded flex items-center gap-1 text-sm"
                  >
                    {ref}
                    <button type="button" onClick={() => removeRefItem(s.id, ref)}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <input
                  value={multiInputs[s.id] || ''}
                  onChange={e => handleMultiInput(s.id, e.target.value)}
                  onKeyDown={e => handleMultiKeyDown(s.id, e)}
                  className="flex-grow min-w-[100px] focus:outline-none text-sm px-1 placeholder:text-gray-400"
                  placeholder="Type number and press Enter"
                />
              </div>
              <p className="text-red-500 text-sm mt-1 min-h-[20px]">{localErrors[s.id]?.surveyRef || ''}</p>
            </div>

            {/* Icon Buttons */}
            <div className="flex gap-4 pt-7 md:pt-[30px] items-center justify-start md:justify-end">
              {s.isNew && (
                <button
                  onClick={() => handleSave(s)}
                  title="Save Survey"
                  className="text-green-600 hover:text-green-700"
                >
                  <Save size={20} />
                </button>
              )}
              <button
                onClick={() => handleRemove(s.id)}
                title="Delete Survey"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add Survey Icon Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleAddRow}
          title="Add New Survey"
          className="w-10 h-10 rounded-full border border-blue-500 text-blue-500 hover:bg-blue-50 flex items-center justify-center transition"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}
