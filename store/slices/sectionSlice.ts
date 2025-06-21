// /store/sectionSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SectionItem {
  id: string;
  section: string;
  sectionSeq: string;
}

interface SectionState {
  list: SectionItem[];
}

const initialState: SectionState = {
  list: [],
};

const sectionSlice = createSlice({
  name: 'section',
  initialState,
  reducers: {
    addSection: (state, action: PayloadAction<SectionItem>) => {
      state.list.push(action.payload);
    },
    removeSection: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(sec => sec.id !== action.payload);
    },
    updateSection: (state, action: PayloadAction<SectionItem>) => {
      const index = state.list.findIndex(s => s.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;
    },
  },
});

export const { addSection, removeSection, updateSection } = sectionSlice.actions;
export default sectionSlice.reducer;
