'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Send, Loader2, CheckCircle } from "lucide-react";
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
import { postSurvey } from '@/utils/api';
import SQLDialog from '../../components/SQLDialog';
import { transformPayload } from '@/utils/transformPayload';

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
        <div className="p-3 bg-white animate-fade-in-up">{children}</div>
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

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [sqlDialogOpen, setSqlDialogOpen] = useState(false);
  const [sqlResult, setSqlResult] = useState('');

  useEffect(() => {
    dispatch(addSurvey({ id: crypto.randomUUID(), name: '', section_ref: [] }));
    dispatch(addSection({ id: crypto.randomUUID(), section: '', sectionSeq: '' }));
    dispatch(addOption({ id: crypto.randomUUID(), option: '', optionType: '', optionSeq: '' }));
    dispatch(addQuestion({ id: crypto.randomUUID(), question: '', questionType: '', questionOptionRef: [], questionSectionRef: [] }));
  }, [dispatch]);

  const isFormValid = () => {
    const arrayBlocks = [surveys, sections, options, questions, conditions, tags, attributes];
    console.warn("🚀 ~ isFormValid ~ arrayBlocks:", arrayBlocks, references)
    const allArraysHaveData = arrayBlocks.every(block => Array.isArray(block) && block.length > 0);

    const isNonEmptyObject = (obj: Record<string, any>) =>
      obj && Object.values(obj).every(
        val =>
          val !== '' &&
          val !== undefined &&
          !(Array.isArray(val) && val.length === 0)
      );

    const referenceValid = isNonEmptyObject(references);

    console.warn("🚀 ~ isFormValid ~ allArraysHaveData && referenceValid:", allArraysHaveData, referenceValid)
    return allArraysHaveData && referenceValid;
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
      ...references,
      "db_name": "dic_survey_engine_db",
    };

    try {
      setSubmitting(true);
      setSubmitted(false);
      const apiPayload = transformPayload(payload);
      console.warn("🚀 ~ handleSubmit ~ apiPayload:", JSON.stringify(apiPayload))
      const response = await postSurvey(JSON.stringify(apiPayload));
      // const response = await fetch('http://localhost:3001/survey-sql', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     "db_name": "dic_survey_engine_db",
      //     "ticket_number": "SARATHI-4742-WB-S5-S6",
      //     "survey": [
      //       "Avail PMJJY for Didi",
      //       "Avail Lakshmir Bhandar Scheme for Didi"
      //     ],
      //     "section": [
      //       {
      //         "name": "No Section",
      //         "section_seq": 1
      //       },
      //       {
      //         "name": "No Section",
      //         "section_seq": 2
      //       }
      //     ],
      //     "options": [
      //       {
      //         "name": "Already Enrolled",
      //         "type": "SingleSelectDropDown",
      //         "option_seq": 1
      //       },
      //       {
      //         "name": "Not Eligible",
      //         "type": "SingleSelectDropDown",
      //         "option_seq": 2
      //       },
      //       {
      //         "name": "Rejected",
      //         "type": "SingleSelectDropDown",
      //         "option_seq": 3
      //       },
      //       {
      //         "name": "Received",
      //         "type": "SingleSelectDropDown",
      //         "option_seq": 4
      //       }
      //     ],
      //     "questions": [
      //       {
      //         "name": "What is the status of Didi's PMJJY?",
      //         "type": "SingleSelectDropDown",
      //         "section_ref": 1,
      //         "option_ref": [
      //           1,
      //           2,
      //           3,
      //           4
      //         ],
      //         "tag": {
      //           "name": "PMJJY Entitlement",
      //           "parentId": {
      //             "name": "Personal Info",
      //             "parentId": 1
      //           }
      //         }
      //       },
      //       {
      //         "name": "What is the status of Didi's Lakshmir Bhandar Scheme?",
      //         "type": "SingleSelectDropDown",
      //         "section_ref": 2,
      //         "option_ref": [
      //           1,
      //           2,
      //           3,
      //           4
      //         ],
      //         "tag": {
      //           "name": "Lakshmi Bhandar Scheme",
      //           "parentId": null
      //         }
      //       }
      //     ],
      //     "survey_reference_id": [
      //       34
      //     ],
      //     "question_conditions": [
      //       {
      //         "name": "What is the status of Didi's PMJJY?",
      //         "type": "Date of completion"
      //       },
      //       {
      //         "name": "What is the status of Didi's Lakshmir Bhandar Scheme?",
      //         "type": "Date of completion"
      //       }
      //     ],
      //     "survey_primary_id": [
      //       176
      //     ],
      //     "section_primary_id": [
      //       246
      //     ],
      //     "option_primary_id": [
      //       1004
      //     ],
      //     "question_primary_id": [
      //       862, 863
      //     ],
      //     "survey_reference_primary_id": [
      //       419, 420
      //     ],
      //     "survey_section_primary_id": [
      //       491, 492
      //     ],
      //     "conditional_question_mapping_primary_id": [
      //       0
      //     ],
      //     "condition_primary_id": [
      //       0
      //     ],
      //     "question_option_primary_id": [
      //       1902, 1903, 1904, 1905
      //     ],
      //     "section_question_primary_id": [
      //       829, 830
      //     ],
      //     "tag_primary_id": 354,
      //     "attributes": [
      //       {
      //         "id": 123,
      //         "name": "PMJJY",
      //         "type": "Static",
      //         "tag": "PMJJY Entitlement",
      //         "attributeGroupId": 1
      //       },
      //       {
      //         "id": 228,
      //         "name": "Lakshmi Bhandar Scheme",
      //         "type": "Static",
      //         "tag": "Lakshmi Bhandar Scheme",
      //         "attributeGroupId": 1
      //       }
      //     ]
      //   }),
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
      console.log('Success:', response);
      if (response.status !== 200) {
        throw new Error(`Failed with status ${response.status}`);
      }
      // const data = await response.text();
      setSqlResult(response.data);
      setSqlDialogOpen(true);
      console.log('Response data:', response.data);
      toast.success('Survey submitted successfully!');
      setSubmitted(true); // ✅ success icon
    } catch (error) {
      console.error('Error submitting data:', error);
      toast.error('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <>
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
            // disabled={!isFormValid() || submitting}
            title="Submit Survey"
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition ${submitting
              ? 'border-blue-400 text-blue-400 bg-blue-50 cursor-not-allowed'
              : isFormValid()
                ? 'border-blue-600 text-blue-600 hover:bg-blue-100'
                : 'border-gray-300 text-gray-300 cursor-not-allowed'
              }`}
          >
            {submitting ? (
              <Loader2 size={20} className="animate-spin" />
            ) : submitted ? (
              <CheckCircle size={20} />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
      <SQLDialog open={sqlDialogOpen} onOpenChange={setSqlDialogOpen} sql={sqlResult} />
    </>
  );
}
