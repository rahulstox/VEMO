"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { createSlice } from "@reduxjs/toolkit";

// Create a placeholder slice to keep the store valid
const placeholderSlice = createSlice({
  name: "placeholder",
  initialState: {},
  reducers: {},
});

const rootReducer = combineReducers({
  // Add the placeholder reducer here
  placeholder: placeholderSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


