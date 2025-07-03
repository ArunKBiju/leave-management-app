import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import leavesReducer from '../features/leaves/leaveSlice';
import adminReducer from '../features/admin/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leaves: leavesReducer,
    admin: adminReducer,
  },
});
