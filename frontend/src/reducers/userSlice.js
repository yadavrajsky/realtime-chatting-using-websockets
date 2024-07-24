// reducers/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Create async thunk for user login
export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/login/", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create async thunk for user signup
export const signupUser = createAsyncThunk(
  "user/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/register/", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create async thunk for user logout
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      // const dispatch = useDispatch();
      const response = await axios.post("/api/logout/"); // Replace with the actual endpoint for logout
      toast.success(response.data.message); // Display success message
      localStorage.removeItem("persist:root");
      return response.data;
    } catch (error) {
      // Display an error message if the request fails
      toast.error(error.response.error);
      return rejectWithValue(error.response.error);
    }
  }
);

// Create async thunk for searching users
export const searchUsers = createAsyncThunk(
  "user/searchUsers",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/users/?search=${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create async thunk for searching infor about logged in user
export const searchLoggedInUser = createAsyncThunk(
  "user/searchLoggedInUser",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/user/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create async thunk for fetching user by ID
export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/user/${id}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          error: "An error occurred while fetching user details",
        }
      );
    }
  }
);

// Initial state
const initialState = {
  user: null,
  users: [],
  isAuthenticated: false,
  loading: false,
  error: null,
  message: null,
  fetchedUser: null,
};

// Create userSlice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetNotificationState: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Reducer for loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.message = action.payload.message;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      // Reducer for signupUser
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      // Reducer for logoutUser
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.users = [];
        state.isAuthenticated = false;
        state.message = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      // Reducer for searchUsers
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      // Reducer for searchLoggedInUser
      .addCase(searchLoggedInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(searchLoggedInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(searchLoggedInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      // Reducer for fetchUserById
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.fetchedUser = action.payload.data;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
  },
});
export const { resetNotificationState } = userSlice.actions;

export default userSlice.reducer;
