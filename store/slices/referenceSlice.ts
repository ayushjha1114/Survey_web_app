// store/slices/referenceSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ReferenceState {
  survey_primary_id: string;
  section_primary_id: string;
  option_primary_id: string;
  question_primary_id: string;
  survey_reference_id: string[];
  survey_reference_primary_id: string;
  survey_section_primary_id: string;
  section_question_primary_id: string;
  question_option_primary_id: string;
  conditional_question_mapping_primary_id: string;
  condition_primary_id: string;
  tag_primary_id: string;
}

const initialState: ReferenceState = {
  survey_primary_id: '',
  section_primary_id: '',
  option_primary_id: '',
  question_primary_id: '',
  survey_reference_id: [],
  survey_reference_primary_id: '',
  survey_section_primary_id: '',
  section_question_primary_id: '',
  question_option_primary_id: '',
  conditional_question_mapping_primary_id: '',
  condition_primary_id: '',
  tag_primary_id: '',
};

const referenceSlice = createSlice({
  name: 'reference',
  initialState,
  reducers: {
    updateReference(state, action: PayloadAction<{ field: keyof ReferenceState; value: any }>) {
      state[action.payload.field] = action.payload.value;
    },
    addReference(_state, action: PayloadAction<ReferenceState>) {
      return action.payload;
    }
  }
});

export const { addReference, updateReference } = referenceSlice.actions;
export default referenceSlice.reducer;
