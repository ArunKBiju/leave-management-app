import React from 'react';
import { useSelector } from 'react-redux';

const LeaveStats = () => {
  const approvedLeaves = useSelector((state) =>
    state.leaves.leaves.filter((leave) => leave.status === 'Approved')
  );

  const today = new Date();
  const currentMonth = today.getMonth();
  const daysInMonth = new Date(today.getFullYear(), currentMonth + 1, 0).getDate();

  const monthlyLeaves = approvedLeaves.reduce((acc, leave) => {
    const from = new Date(leave.fromDate);
    const to = new Date(leave.toDate);

    if (from.getMonth() === currentMonth || to.getMonth() === currentMonth) {
      const start = from.getMonth() === currentMonth ? from : new Date(today.getFullYear(), currentMonth, 1);
      const end = to.getMonth() === currentMonth ? to : new Date(today.getFullYear(), currentMonth + 1, 0);
      const days = (end - start) / (1000 * 60 * 60 * 24) + 1;
      return acc + days;
    }
    return acc;
  }, 0);

  const thisYear = today.getFullYear();
  const yearlyLeaves = approvedLeaves.reduce((acc, leave) => {
    const from = new Date(leave.fromDate);
    const to = new Date(leave.toDate);
    if (from.getFullYear() === thisYear || to.getFullYear() === thisYear) {
      const start = from.getFullYear() === thisYear ? from : new Date(thisYear, 0, 1);
      const end = to.getFullYear() === thisYear ? to : new Date(thisYear, 11, 31);
      const days = (end - start) / (1000 * 60 * 60 * 24) + 1;
      return acc + days;
    }
    return acc;
  }, 0);

  return (
    <div className="grid sm:grid-cols-2 gap-6 w-full mb-8">
      <div className="bg-black rounded-xl p-4 text-center neon-border animate-pulse">
        <h4 className="text-teal-400 text-lg font-semibold mb-1">Monthly Leaves</h4>
        <p className="text-white text-3xl font-bold">{Math.round(monthlyLeaves)}</p>
        <p className="text-gray-400 text-sm mt-1">
          {Math.round((monthlyLeaves / daysInMonth) * 100)}% this month
        </p>
      </div>
      <div className="bg-black rounded-xl p-4 text-center neon-border animate-pulse delay-100">
        <h4 className="text-violet-400 text-lg font-semibold mb-1">Yearly Leaves</h4>
        <p className="text-white text-3xl font-bold">{Math.round(yearlyLeaves)}</p>
        <p className="text-gray-400 text-sm mt-1">
          {Math.round((yearlyLeaves / 365) * 100)}% this year
        </p>
      </div>
    </div>
  );
};

export default LeaveStats;
