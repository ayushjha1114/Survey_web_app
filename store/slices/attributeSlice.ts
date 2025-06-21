// store/slices/attributeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AttributeItem {
  id: string;
  questionId: string;
  attribute_name: string;
  attribute_primary_id: string;
  attribute_group_id: string;
}

interface AttributeState {
  list: AttributeItem[];
}

const initialState: AttributeState = {
  list: []
};

const attributeSlice = createSlice({
  name: 'attribute',
  initialState,
  reducers: {
    setAttributes(state, action: PayloadAction<AttributeItem[]>) {
      state.list = action.payload;
    },
    addAttribute(state, action: PayloadAction<AttributeItem>) {
      state.list.push(action.payload);
    },
    removeAttribute(state, action: PayloadAction<string>) {
      state.list = state.list.filter(attr => attr.id !== action.payload);
    },
    updateAttribute(state, action: PayloadAction<{ id: string; field: string; value: any }>) {
      const attr = state.list.find(attr => attr.id === action.payload.id);
      if (attr) {
        (attr as any)[action.payload.field] = action.payload.value;
      }
    }
  }
});

export const { addAttribute, removeAttribute, updateAttribute, setAttributes } = attributeSlice.actions;
export default attributeSlice.reducer;
