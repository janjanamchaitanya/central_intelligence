import { configureStore } from '@reduxjs/toolkit';

// Import your reducers here
// import exampleReducer from '../features/example/exampleSlice';

export const store = configureStore({
  reducer: {
    // Add your reducers here
    // example: exampleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['your/action/type'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
