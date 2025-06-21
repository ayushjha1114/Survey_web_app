// store/slices/tagSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TagItem {
  id: string;
  questionName: string;
  tag_name: string;
  tag_parentId: string;
  tag_parentName: string;
}

interface TagState {
  list: TagItem[];
}

const initialState: TagState = {
  list: []
};

const tagSlice = createSlice({
  name: 'tag',
  initialState,
  reducers: {
    setTags(state, action: PayloadAction<TagItem[]>) {
      state.list = action.payload;
    },
    addTag(state, action: PayloadAction<TagItem>) {
      state.list.push(action.payload);
    },
    removeTag(state, action: PayloadAction<string>) {
      state.list = state.list.filter(tag => tag.id !== action.payload);
    },
    updateTag(state, action: PayloadAction<{ id: string; field: string; value: any }>) {
      const tag = state.list.find(tag => tag.id === action.payload.id);
      if (tag) {
        (tag as any)[action.payload.field] = action.payload.value;
      }
    }
  }
});

export const { addTag, removeTag, updateTag, setTags } = tagSlice.actions;
export default tagSlice.reducer;
