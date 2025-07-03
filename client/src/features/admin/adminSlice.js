import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAllLeaves = createAsyncThunk(
  'admin/fetchAllLeaves',
  async (status = 'All', thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState(); 
      const token = auth.token || auth.user?.token; 

      const res = await axios.get(`http://localhost:5000/api/admin/leaves?status=${status}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch leaves'
      );
    }
  }
);

export const updateLeaveStatus = createAsyncThunk(
  'admin/updateLeaveStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState();
      const token = auth.token || auth.user?.token;

      const res = await axios.put(
        `http://localhost:5000/api/leaves/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.message) {
        alert(res.data.message); 
      }

      return res.data.updatedLeave;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update leave status'
      );
    }
  }
);

// 🔹 Create the slice
const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    allLeaves: [],  // All leave requests (for manager/admin)
    loading: false, // Show spinner while fetching/updating
    error: null,    // Store error message
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // 🔹 Handle fetchAllLeaves
      .addCase(fetchAllLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.allLeaves = action.payload; // Set fetched leaves
      })
      .addCase(fetchAllLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      })

      // 🔹 Handle updateLeaveStatus
      .addCase(updateLeaveStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.allLeaves.findIndex(
          (leave) => leave._id === action.payload._id
        );

        if (index !== -1) {
          state.allLeaves[index] = action.payload; // Replace with updated leave
        }
      })
      .addCase(updateLeaveStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// 🔹 Export reducer
export default adminSlice.reducer;
