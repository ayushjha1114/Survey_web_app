// /store/questionSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface QuestionItem {
  id: string;
  question: string;
  questionType: string;
  questionOptionRef: string[];
  questionSectionRef: string[];
}

interface QuestionState {
  list: QuestionItem[];
}

const initialState: QuestionState = {
  list: [],
};

const questionSlice = createSlice({
  name: 'question',
  initialState,
  reducers: {
    addQuestion: (state, action: PayloadAction<QuestionItem>) => {
      state.list.push(action.payload);
    },
    removeQuestion: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(q => q.id !== action.payload);
    },
    updateQuestion: (state, action: PayloadAction<QuestionItem>) => {
      const index = state.list.findIndex(q => q.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;
    },
  },
});

export const { addQuestion, removeQuestion, updateQuestion } = questionSlice.actions;
export default questionSlice.reducer;
