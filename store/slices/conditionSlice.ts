import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ConditionItem {
  id: string;
  question: string;
  condition: string;
  conditionalSourceQuestion: string;
}

interface ConditionState {
  list: ConditionItem[];
}

const initialState: ConditionState = {
  list: [],
};

const conditionSlice = createSlice({
  name: 'condition',
  initialState,
  reducers: {
    addCondition: (state, action: PayloadAction<ConditionItem>) => {
      state.list.push(action.payload);
    },
    updateCondition: (
      state,
      action: PayloadAction<{ id: string; field: keyof ConditionItem; value: any }>
    ) => {
      const index = state.list.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.list[index][action.payload.field] = action.payload.value;
      }
    },
    removeCondition: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addCondition, updateCondition, removeCondition } = conditionSlice.actions;
export default conditionSlice.reducer;
