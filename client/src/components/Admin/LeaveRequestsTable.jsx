import { useEffect, useState } from 'react';

const LeaveRequestsTable = () => {
  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/leaves', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load');

      setLeaves(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/leaves/${id}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const updated = await res.json();
      if (!res.ok) throw new Error(updated.message || 'Update failed');

      setLeaves((prev) =>
        prev.map((leave) => (leave._id === id ? updated : leave))
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">All Leave Requests</h2>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Employee</th>
              <th className="p-2 border">From</th>
              <th className="p-2 border">To</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Reason</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {[...leaves]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((leave) => (
                <tr key={leave._id}>
                  <td className="p-2 border">{leave.employee?.name}</td>
                  <td className="p-2 border">
                    {new Date(leave.fromDate).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">
                    {new Date(leave.toDate).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">{leave.type}</td>
                  <td className="p-2 border">{leave.reason}</td>
                  <td className="p-2 border">{leave.status}</td>
                  <td className="p-2 border">
                    <select
                      value={leave.status}
                      onChange={(e) =>
                        handleStatusChange(leave._id, e.target.value)
                      }
                      className="border p-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveRequestsTable;
