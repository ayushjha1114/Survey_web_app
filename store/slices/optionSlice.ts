// /store/optionSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OptionItem {
  id: string;
  option: string;
  optionType: string;
  optionSeq: string;
}

interface OptionState {
  list: OptionItem[];
}

const initialState: OptionState = {
  list: [],
};

const optionSlice = createSlice({
  name: 'option',
  initialState,
  reducers: {
    addOption: (state, action: PayloadAction<OptionItem>) => {
      state.list.push(action.payload);
    },
    removeOption: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(opt => opt.id !== action.payload);
    },
    updateOption: (state, action: PayloadAction<OptionItem>) => {
      const index = state.list.findIndex(o => o.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;
    },
  },
});

export const { addOption, removeOption, updateOption } = optionSlice.actions;
export default optionSlice.reducer;
