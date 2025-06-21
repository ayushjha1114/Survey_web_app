// /store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import optionReducer from './slices/optionSlice';
import sectionReducer from './slices/sectionSlice';
import questionReducer from './slices/questionSlice';
import surveyReducer from './slices/surveySlice';
import conditionReducer from './slices/conditionSlice';
import tagReducer from './slices/tagSlice';
import attributeReducer from './slices/attributeSlice';
import referenceReducer from './slices/referenceSlice';

export const store = configureStore({
  reducer: {
    option: optionReducer,
    section: sectionReducer,
    question: questionReducer,
    survey: surveyReducer,
    condition: conditionReducer,
    tag: tagReducer,
    attribute: attributeReducer,
    reference: referenceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;