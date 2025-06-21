'use client';
import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight } from "lucide-react";
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import SurveyBlock from './sections/SurveyBlock';
import SectionBlock from './sections/SectionBlock';
import OptionBlock from './sections/OptionBlock';
import QuestionBlock from './sections/QuestionBlock';
import { addSurvey } from '@/store/slices/surveySlice';
import { addSection } from '@/store/slices/sectionSlice';
import { addOption } from '@/store/slices/optionSlice';
import { addQuestion } from '@/store/slices/questionSlice';
import ConditionBlock from './sections/ConditionBlock';
import TagBlock from './sections/tagBlock';
import AttributeBlock from './sections/AttributeBlock';
import ReferenceBlock from './sections/ReferenceBlock';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

const CollapsibleSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-xl border border-gray-200 shadow-md overflow-hidden">
      <button
        className="w-full flex justify-between items-center px-5 py-3 bg-gradient-to-r from-blue-50 via-white to-blue-50 text-lg font-semibold text-gray-800 hover:bg-blue-100 transition-all"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="flex items-center gap-2">
          {open ? <ChevronDown size={20} /> : <ChevronRight size={20} />} {title}
        </span>
        <span className="text-sm text-gray-500">{open ? "Click to collapse" : "Click to expand"}</span>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out ${open ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
      >
        <div className="p-6 bg-white animate-fade-in-up">{children}</div>
      </div>
    </div>
  );
};

export default function FormPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const surveys = useAppSelector(state => state.survey.list);
  const sections = useAppSelector(state => state.section.list);
  const options = useAppSelector(state => state.option.list);
  const questions = useAppSelector(state => state.question.list);
  const conditions = useAppSelector(state => state.condition.list);
  const tags = useAppSelector(state => state.tag.list);
  const attributes = useAppSelector(state => state.attribute.list);
  const references = useAppSelector(state => state.reference);

  useEffect(() => {
    dispatch(addSurvey({ id: crypto.randomUUID(), surveyName: '', surveyRef: '' }));
    dispatch(addSection({ id: crypto.randomUUID(), section: '', sectionSeq: '' }));
    dispatch(addOption({ id: crypto.randomUUID(), option: '', optionType: '', optionSeq: '' }));
    dispatch(addQuestion({ id: crypto.randomUUID(), question: '', questionType: '', questionOptionRef: [], questionSectionRef: [] }));
  }, [dispatch]);

  const isFormValid = () => {
    return [surveys, sections, options, questions, conditions, tags, attributes].every(block => block.length > 0 && block.every(entry => Object.values(entry).every(value => value !== '' && value !== undefined)));
  };

  const handleSubmit = async () => {
    const payload = {
      surveys,
      sections,
      options,
      questions,
      conditions,
      tags,
      attributes,
      references,
    };

    try {
      const response = await api.post('/api/survey', payload);
      console.log('Success:', response.data);
      toast.success('Survey submitted successfully!');
    } catch (error) {
      console.error('Error submitting data:', error);
      toast.error('Submission failed. Please try again.');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Survey Form</h2>

      <CollapsibleSection title="Surveys">
        <SurveyBlock />
      </CollapsibleSection>

      <CollapsibleSection title="Sections">
        <SectionBlock />
      </CollapsibleSection>

      <CollapsibleSection title="Options">
        <OptionBlock />
      </CollapsibleSection>

      <CollapsibleSection title="Questions">
        <QuestionBlock />
      </CollapsibleSection>

      <CollapsibleSection title="Conditions">
        <ConditionBlock />
      </CollapsibleSection>

      <CollapsibleSection title="Tags">
        <TagBlock />
      </CollapsibleSection>

      <CollapsibleSection title="Attributes">
        <AttributeBlock />
      </CollapsibleSection>

      <CollapsibleSection title="References">
        <ReferenceBlock />
      </CollapsibleSection>

      <div className="pt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!isFormValid()}
          className={`px-6 py-2 rounded text-white font-medium ${isFormValid() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
