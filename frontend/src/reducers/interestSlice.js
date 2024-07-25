// reducers/interestSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching interest details
export const fetchInterestDetail = createAsyncThunk(
  "interest/fetchDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/interest/${id}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for updating interest details
export const updateInterest = createAsyncThunk(
  "interest/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/interest/${id}/`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for fetching a list of interests
export const fetchInterests = createAsyncThunk(
  "interest/fetchList",
  async (queryParams, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/interests/", {
        params: queryParams,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for checking if an interest exists
export const checkInterestExistence = createAsyncThunk(
  "interest/checkExistence",
  async (receiverId , { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/interest/check/", {
        params: receiverId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  interest: null,
  interests: [],
  loading: false,
  error: null,
  message: null,
  interestExists: null,
};

// Create interestSlice
const interestSlice = createSlice({
  name: "interest",
  initialState,
  reducers: {
    resetNotificationState: (state) => {
      state.error = null;
      state.message = null;
    },
    resetInterestExists: (state) => {  
      state.interestExists = null;
    },
    addInterest: (state, action) => {
      state.interest=action.payload;
    },
    setInterestExists: (state, action) => {
      state.interestExists = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Reducer for fetchInterestDetail
      .addCase(fetchInterestDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(fetchInterestDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.interest = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(fetchInterestDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
        state.interest=null
      })
      // Reducer for updateInterest
      .addCase(updateInterest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateInterest.fulfilled, (state, action) => {
        state.loading = false;
        state.interest = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(updateInterest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(fetchInterests.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(fetchInterests.fulfilled, (state, action) => {
        state.loading = false;
        state.interests = action.payload.data;
      })
      .addCase(fetchInterests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      // Reducer for checkInterestExistence
      .addCase(checkInterestExistence.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(checkInterestExistence.fulfilled, (state, action) => {
        state.loading = false;
        state.interestExists = action.payload?.exists;
        state.message = action.payload?.message;
        action.payload.exists? state.interest = action.payload?.data : null;
      })
      .addCase(checkInterestExistence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
  },
});

export const { resetNotificationState,addInterest,setInterestExists } = interestSlice.actions;

export default interestSlice.reducer;
