// utils/transformPayload.ts

export function transformPayload(payload: any) {
  const {
    surveys,
    sections,
    options,
    questions,
    conditions,
    tags,
    attributes,
    db_name,
    ...referenceFields
  } = payload;

  const validSurveys = surveys
    .filter((s: any) => s.name.trim() !== '')
    .map((s: any) => ({
      name: s.name,
      section_ref: s.section_ref,
    }));

  const validSections = sections
    .filter((s: any) => s.section.trim() !== '')
    .map((s: any) => ({
      name: s.section,
      section_seq: parseInt(s.sectionSeq),
    }));

  const validOptions = options
    .filter((o: any) => o.option.trim() !== '')
    .map((o: any) => ({
      name: o.option,
      type: o.optionType,
      option_seq: parseInt(o.optionSeq),
    }));

  const questionsWithTags = questions.map((q: any) => {
    const tag = tags.find((t: any) => t.id === q.id);
    const tagObj = tag
      ? {
          name: tag.tag_name,
          parentId: tag.tag_parentId
            ? {
                name: tag.tag_parentName,
                parentId: parseInt(tag.tag_parentId),
              }
            : null,
        }
      : null;

    return {
      name: q.question,
      type: q.questionType,
      section_ref: parseInt(q.questionSectionRef[0]),
      // option_ref: q.questionOptionRef.map((o: string | number) => parseInt(String(o))
       option_ref: q.questionOptionRef.map((o: string | number) => parseInt(String(o))),
      tag: tagObj,
    };
  });

  const questionConditions = conditions.flat().map((c: any) => ({
    name: c.question,
    sourceQuestionName: c.conditionalSourceQuestion,
  }));

  const formattedAttributes = attributes.map((a: any) => ({
    id: parseInt(a.attribute_primary_id),
    name: a.attribute_name,
    type: 'Static',
    tag: a.attribute_name,
    attributeGroupId: parseInt(a.attribute_group_id),
  }));

  return {
    db_name,
    survey: validSurveys,
    section: validSections,
    options: validOptions,
    questions: questionsWithTags,
    question_conditions: questionConditions,
    attributes: formattedAttributes,

    survey_primary_id: [parseInt(referenceFields.survey_primary_id)],
    section_primary_id: [parseInt(referenceFields.section_primary_id)],
    option_primary_id: [parseInt(referenceFields.option_primary_id)],
    question_primary_id: [parseInt(referenceFields.question_primary_id)],
    survey_reference_id: referenceFields.survey_reference_id.map((id: string) => parseInt(id)),
    survey_reference_primary_id: [parseInt(referenceFields.survey_reference_primary_id)],
    survey_section_primary_id: [parseInt(referenceFields.survey_section_primary_id)],
    section_question_primary_id: [parseInt(referenceFields.section_question_primary_id)],
    question_option_primary_id: [parseInt(referenceFields.question_option_primary_id)],
    conditional_question_mapping_primary_id: [parseInt(referenceFields.conditional_question_mapping_primary_id)],
    condition_primary_id: [parseInt(referenceFields.condition_primary_id)],
    tag_primary_id: [parseInt(referenceFields.tag_primary_id)],
  };
}
