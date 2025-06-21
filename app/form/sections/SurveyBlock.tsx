'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addSurvey, removeSurvey, updateSurvey } from '@/store/slices/surveySlice';
import { v4 as uuidv4 } from 'uuid';

export default function SurveySection() {
  const dispatch = useAppDispatch();
  const surveys = useAppSelector(state => state.survey.list);

  const [localErrors, setLocalErrors] = useState<Record<string, { surveyName?: string; surveyRef?: string }>>({});

  const validate = (surveyName: string, surveyRef: string) => {
    const errors: { surveyName?: string; surveyRef?: string } = {};
    if (!surveyName.trim()) errors.surveyName = 'Survey name is required';
    if (!surveyRef.trim()) errors.surveyRef = 'Survey section reference is required';
    else if (!/^[0-9]+$/.test(surveyRef.trim())) errors.surveyRef = 'Only numeric values are allowed';
    return errors;
  };

  const handleAdd = (id: string, surveyName: string, surveyRef: string) => {
    const errors = validate(surveyName, surveyRef);
    if (Object.keys(errors).length > 0) {
      setLocalErrors(prev => ({ ...prev, [id]: errors }));
      return;
    }
    setLocalErrors(prev => ({ ...prev, [id]: {} }));
    dispatch(addSurvey({ id: uuidv4(), surveyName: '', surveyRef: '' }));
  };

  const handleRemove = (id: string) => {
    dispatch(removeSurvey(id));
    setLocalErrors(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleChange = (id: string, field: 'surveyName' | 'surveyRef', value: string) => {
    const survey = surveys.find(s => s.id === id);
    if (survey) {
      const updated = { ...survey, [field]: value };
      dispatch(updateSurvey(updated));
      setLocalErrors(prev => ({ ...prev, [id]: { ...prev[id], [field]: '' } }));
    }
  };

  return (
    <>
      {surveys.map((s, idx) => (
        <div key={s.id} className="bg-white border border-gray-200 p-4 rounded-xl shadow-md mb-4">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-800">Survey Name</label>
              <input
                type="text"
                className={`w-full mt-1 p-2 border text-gray-900 ${localErrors[s.id]?.surveyName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                value={s.surveyName}
                onChange={e => handleChange(s.id, 'surveyName', e.target.value)}
              />
              {localErrors[s.id]?.surveyName && <p className="text-red-500 text-sm mt-1">{localErrors[s.id]?.surveyName}</p>}
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-800">Survey Section Reference</label>
              <input
                type="text"
                inputMode="numeric"
                className={`w-full mt-1 p-2 border text-gray-900 ${localErrors[s.id]?.surveyRef ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                value={s.surveyRef}
                onChange={e => handleChange(s.id, 'surveyRef', e.target.value)}
              />
              {localErrors[s.id]?.surveyRef && <p className="text-red-500 text-sm mt-1">{localErrors[s.id]?.surveyRef}</p>}
            </div>
            <div className="flex items-end h-full">
              {idx === surveys.length - 1 ? (
                <button
                  onClick={() => handleAdd(s.id, s.surveyName, s.surveyRef)}
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
