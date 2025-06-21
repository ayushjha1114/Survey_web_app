// /store/surveySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SurveyItem {
  id: string;
  surveyName: string;
  surveyRef: string;
}

interface SurveyState {
  list: SurveyItem[];
}

const initialState: SurveyState = {
  list: [],
};

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    addSurvey: (state, action: PayloadAction<SurveyItem>) => {
      state.list.push(action.payload);
    },
    removeSurvey: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(s => s.id !== action.payload);
    },
    updateSurvey: (state, action: PayloadAction<SurveyItem>) => {
      const index = state.list.findIndex(s => s.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;
    },
  },
});

export const { addSurvey, removeSurvey, updateSurvey } = surveySlice.actions;
export default surveySlice.reducer;
