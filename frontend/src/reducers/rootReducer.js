// Import your individual reducer files
import { combineReducers} from '@reduxjs/toolkit';
import userSlice from './userSlice';
import interestReducer from './interestSlice';
import messageReducer from './messageSlice';
import websocketReducer from './websocketSlice';
// Combine your reducers into a root reducer
export  const rootReducer = combineReducers({
  user: userSlice,
  interest: interestReducer,
  message: messageReducer,
  websocket: websocketReducer,
});
export default rootReducer;
