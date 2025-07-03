import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllLeaves, updateLeaveStatus } from '../../features/admin/adminSlice';
import { FaEdit } from 'react-icons/fa';

const LeaveStatusDropdown = ({ filter }) => {
  const dispatch = useDispatch();
  const { allLeaves } = useSelector((state) => state.admin);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const query = filter === 'All' ? '' : filter;
    dispatch(fetchAllLeaves(query));
  }, [dispatch, filter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const result = await dispatch(updateLeaveStatus({ id, status: newStatus }));
      if (updateLeaveStatus.fulfilled.match(result)) {
        setEditingId(null);
        dispatch(fetchAllLeaves(filter === 'All' ? '' : filter));
      } else {
        alert('Failed to update status.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-lg px-8 sm:px-12">
        <table className="w-full table-fixed bg-white text-sm shadow-md rounded-md">
          <thead className="bg-gray-100 text-gray-800 font-bold text-base">
            <tr className="h-14">
              <th className="px-4 py-4 text-center w-[130px]">Employee</th>
              <th className="px-4 py-4 text-center w-[200px]">Email</th>
              <th className="pl-6 pr-2 py-4 text-center w-[120px]">From</th>
              <th className="pl-6 pr-2 py-4 text-center w-[120px]">To</th>
              <th className="pl-6 pr-2 py-4 text-center w-[80px]">Type</th>
              <th className="pl-6 pr-2 py-4 text-center w-[140px]">Reason</th>
              <th className="px-2 py-4 text-center w-[180px]">Status</th>
              <th className="py-4 text-left w-[150px]">
                <div className="mr-4">Action</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {allLeaves?.map((leave) => {
              const isEditing = editingId === leave._id;
              return (
                <tr key={leave._id} className="border-b hover:bg-gray-50 text-gray-800">
                  <td className="px-4 py-4 text-center">{leave.employee?.name}</td>
                  <td className="px-4 py-4 text-center">{leave.employee?.email}</td>
                  <td className="pl-6 pr-2 py-4 text-center">
                    {new Date(leave.fromDate).toLocaleDateString()}
                  </td>
                  <td className="pl-6 pr-2 py-4 text-center">
                    {new Date(leave.toDate).toLocaleDateString()}
                  </td>
                  <td className="pl-6 pr-2 py-4 text-center">{leave.type}</td>
                  <td className="pl-6 pr-2 py-4 text-center">{leave.reason}</td>
                  <td className="px-2 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full font-medium text-xs ${getStatusStyle(
                        leave.status
                      )}`}
                    >
                      {leave.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="mr-4">
                      {leave.status === 'Pending' || isEditing ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusChange(leave._id, 'Approved')}
                            className="w-[80px] bg-green-600 text-white py-1 px-2 rounded text-xs hover:bg-green-700 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(leave._id, 'Rejected')}
                            className="w-[80px] bg-red-600 text-white py-1 px-2 rounded text-xs hover:bg-red-700 transition"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingId(leave._id)}
                          className="w-[80px] bg-blue-600 text-white py-1 px-2 rounded text-xs hover:bg-blue-700 flex items-center justify-center gap-1 transition"
                        >
                          <FaEdit className="text-sm" />
                          Edit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveStatusDropdown;
