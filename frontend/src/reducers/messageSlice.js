// reducers/messagesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching a list of messages
export const fetchMessages = createAsyncThunk(
  "messages/fetchList",
  async (queryParams, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/messages/", {
        params: queryParams,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  messages: [],
  loading: false,
  error: null,
  message: null,
};

// Create messagesSlice
const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    resetNotificationState: (state) => {
      state.error = null;
      state.message = null;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Reducer for fetchInterestDetail
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.data;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload.error;
        state.messages=[]

      });
  },
});

export const { resetNotificationState,addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
