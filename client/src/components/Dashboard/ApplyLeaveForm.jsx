import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addLeave } from '../../features/leaves/leaveSlice';

const ApplyLeaveForm = ({ fetchLeaves }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    fromDate: '',
    toDate: '',
    type: '',
    reason: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('You must be logged in');
      return;
    }

    try {
      const res = await fetch('/api/leaves/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to apply');
      }

      dispatch(addLeave(data));
      fetchLeaves && fetchLeaves();
      setSuccess('Leave applied successfully!');
      setForm({
        fromDate: '',
        toDate: '',
        type: '',
        reason: '',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full sm:max-w-[50%] bg-white rounded-xl shadow-md p-8 flex flex-col gap-6"
      >
        <h2 className="text-2xl font-extrabold text-blue-700 text-center">Apply for Leave</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">From</label>
            <input
              type="date"
              name="fromDate"
              value={form.fromDate}
              onChange={handleChange}
              required
              className="w-full border h-10 border-gray-300 px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">To</label>
            <input
              type="date"
              name="toDate"
              value={form.toDate}
              onChange={handleChange}
              required
              className="w-full border h-10 border-gray-300 px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">Leave Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              className="w-full border h-10 border-gray-300 px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select type</option>
              <option value="Sick">Sick</option>
              <option value="Casual">Casual</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-lg font-medium text-gray-700 mb-1">Reason</label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border h-10 border-gray-300 px-4 py-2 rounded-md shadow-sm resize-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <div className="text-center mb-8">
          <button
            type="submit"
            className="bg-blue-600 h-12 w-100 hover:bg-blue-700 text-white font-bold  text-lg px-20 py-6 rounded-xl shadow-lg tracking-wide transition-transform duration-300 hover:scale-105"
          >
            Submit Leave Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplyLeaveForm;
