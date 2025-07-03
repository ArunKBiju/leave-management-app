import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  leaves: [],
};

const leaveSlice = createSlice({
  name: 'leaves',
  initialState,
  reducers: {
    setLeaves: (state, action) => {
      state.leaves = action.payload;
    },
    addLeave: (state, action) => {
      state.leaves.push(action.payload);
    },
  },
});

export const { setLeaves, addLeave } = leaveSlice.actions;
export default leaveSlice.reducer;
