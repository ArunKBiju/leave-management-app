import LeaveRequest from '../models/LeaveRequest.js';
import sendEmail from '../utils/sendEmail.js';
import User from '../models/User.js';

export const viewAllLeaves = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'All') {
      filter.status = req.query.status;
    }

    const leaves = await LeaveRequest.find(filter)
  .sort({ createdAt: -1 })
  .populate('employee', 'name email');

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leaves' });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id).populate('employee', 'name email');
    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    leave.status = req.body.status;
    const updatedLeave = await leave.save();

    const userEmail = leave.employee.email;
    const userName = leave.employee.name;
    const status = leave.status;

    await sendEmail({
      to: userEmail,
      subject: `Leave Request ${status}`,
      text: `Hello ${userName},\n\nYour leave request has been ${status.toLowerCase()}.\n\nRegards,\nLeave Management System`,
    });

    console.log(`Email sent to ${userEmail} - Status: ${status}`);

    res.json({ message: 'Status updated and email sent!', updatedLeave });
  } catch (error) {
    console.error('Failed to update status or send email:', error.message);
    res.status(500).json({ message: 'Failed to update status or send email' });
  }
};
