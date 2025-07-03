import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import axios from 'axios';
import { setLeaves } from '../features/leaves/leaveSlice';

import LeaveForm from '../components/Dashboard/ApplyLeaveForm';
import LeaveHistory from '../components/Dashboard/LeaveHistory';
import LeaveStats from '../components/Dashboard/LeaveStats';

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const leaves = useSelector((state) => state.leaves.leaves);

  const fetchLeaves = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/leaves/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setLeaves(response.data));
    } catch (error) {
      console.error('Error fetching leave history:', error);
    }
  };

  useEffect(() => {
    if (token) fetchLeaves();
  }, [token]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-emerald-500 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-[92vw] flex flex-col gap-10">
        <div className="flex flex-col items-center text-center gap-4">
          <h2 className="text-4xl font-extrabold text-white">Employee Dashboard</h2>
          <LeaveStats />
          <button
            onClick={handleLogout}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        <div className="w-full flex justify-center">
          <LeaveForm fetchLeaves={fetchLeaves} />
        </div>

        <div className="bg-white rounded-xl shadow-xl px-10 py-8 overflow-auto">
          <LeaveHistory leaves={leaves} fetchLeaves={fetchLeaves} />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
