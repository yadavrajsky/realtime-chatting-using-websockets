// Import your individual reducer files
import { combineReducers} from '@reduxjs/toolkit';
import userSlice from './userSlice';

// Combine your reducers into a root reducer
export  const rootReducer = combineReducers({
  user: userSlice,
});
export default rootReducer;
