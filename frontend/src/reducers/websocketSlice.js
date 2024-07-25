import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addMessage } from "./messageSlice";
import { addInterest } from "./interestSlice";

// Async thunk for initializing WebSocket connection
export const initializeWebSocket = createAsyncThunk(
  "websocket/initialize",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const socket = new WebSocket("ws://localhost:8000/ws/chat/");
      socket.onopen = () => {
        console.log("WebSocket connection opened");
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        dispatch(websocketErrorReceived(error.message));
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed");
        dispatch(websocketConnectionStatus("disconnected"));
      };

      socket.onmessage = (event) => {
        console.log("WebSocket message received:", event.data);
        const message = JSON.parse(event.data);
        console.log(message);
        // Dispatch action to handle incoming message
        if (message?.message) {
          dispatch(addMessage(message?.message));
        } else if (message?.error) {
          dispatch(websocketErrorReceived(message.error));
        }
        if (message?.interest) {
          dispatch(addInterest(message?.interest));
        }
      };
      dispatch(setWebsocketConnection(socket));
        dispatch(websocketConnectionStatus("connected"));

      return; // No data to return, just initialization
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for sending messages via WebSocket
export const sendMessage = createAsyncThunk(
  "websocket/sendMessage",
  async (message, { rejectWithValue, getState }) => {
    try {
      const { websocket } = getState().websocket;
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify(message));
        return message; // Return the message sent
      } else {
        throw new Error("WebSocket is not connected");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  websocket: null,
  error: null,
  connectionStatus: "disconnected",
};

// Create websocketSlice
const websocketSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {
    setWebsocketConnection(state, action) {
      state.websocket = action.payload;
      state.connectionStatus = "connected";
    },
    websocketMessageReceived: (state, action) => {
      state.message = action.payload;
    },
    websocketErrorReceived: (state, action) => {
      state.error = action.payload;
    },
    websocketConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeWebSocket.pending, (state) => {
        state.connectionStatus = "connecting";
      })
      .addCase(initializeWebSocket.rejected, (state, action) => {
        state.connectionStatus = "disconnected";
        state.error = action.payload;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  setWebsocketConnection,
  websocketMessageReceived,
  websocketErrorReceived,
  websocketConnectionStatus,
} = websocketSlice.actions;

export default websocketSlice.reducer;
