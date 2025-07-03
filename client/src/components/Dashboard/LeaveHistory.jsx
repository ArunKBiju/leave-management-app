import React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const LeaveHistory = ({ leaves, fetchLeaves }) => {
  const token = useSelector((state) => state.auth.token);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this leave?')) return;

    try {
      const res = await axios.delete(`http://localhost:5000/api/leaves/cancel/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        fetchLeaves();
      } else {
        alert('Failed to cancel leave.');
      }
    } catch (err) {
      console.error('Cancel failed', err);
      alert('Something went wrong while cancelling.');
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg text-base sm:text-[17px]">

      <h3 className="text-xl font-semibold mb-6">Your Leave History</h3>

      {leaves.length === 0 ? (
        <p>No leave history found.</p>
      ) : (
        <table className="w-full table-auto bg-white text-base text-gray-800 shadow-sm rounded-md">

          <thead className="bg-gray-100 text-gray-800 font-bold text-base h-14">
            <tr>
              <th className="px-4 py-4 text-center w-[140px]">Name</th>
              <th className="px-4 py-4 text-center w-[100px]">Type</th>
              <th className="px-4 py-4 text-center w-[120px]">From</th>
              <th className="px-4 py-4 text-center w-[120px]">To</th>
              <th className="px-4 py-4 text-center w-[220px]">Reason</th>
              <th className="px-4 py-4 text-center w-[120px]">Status</th>
              <th className="px-4 py-4 text-center w-[120px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id} className="border-b hover:bg-gray-50 text-gray-800">
                <td className="px-4 py-4 text-center">{leave.employee?.name || 'You'}</td>
                <td className="px-4 py-4 text-center">{leave.type}</td>
                <td className="px-4 py-4 text-center">{leave.fromDate?.slice(0, 10)}</td>
                <td className="px-4 py-4 text-center">{leave.toDate?.slice(0, 10)}</td>
                <td className="px-4 py-4 text-center">{leave.reason}</td>
                <td className="px-4 py-4 text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-full font-medium text-xs ${
                      leave.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : leave.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {leave.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  {leave.status === 'Pending' && (
                    <button
                      onClick={() => handleCancel(leave._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaveHistory;
