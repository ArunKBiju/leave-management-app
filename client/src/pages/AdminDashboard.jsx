import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { fetchAllLeaves } from '../features/admin/adminSlice';
import LeaveStatusDropdown from '../components/Admin/LeaveStatusDropdown';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (user?.token && user.role === 'admin') {
      dispatch(fetchAllLeaves(filter));
    }
  }, [dispatch, filter, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-emerald-500 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-[92vw] flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h2 className="text-4xl font-extrabold text-white">Admin Dashboard</h2>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <label className="text-white font-medium text-lg">Filter by Status:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="h-[80vh] bg-white rounded-xl shadow-xl px-14 py-6 overflow-auto">
          <LeaveStatusDropdown filter={filter} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
