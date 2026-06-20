import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk example
export const fetchExampleData = createAsyncThunk(
  'example/fetchData',
  async (params, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/example');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    // Synchronous actions
    setData: (state, action) => {
      state.data = action.payload;
    },
    clearData: (state) => {
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExampleData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExampleData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchExampleData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setData, clearData } = exampleSlice.actions;

// Selectors
export const selectExampleData = (state) => state.example.data;
export const selectExampleLoading = (state) => state.example.loading;
export const selectExampleError = (state) => state.example.error;

export default exampleSlice.reducer;
