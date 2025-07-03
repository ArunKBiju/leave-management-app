import LeaveRequest from '../models/LeaveRequest.js';

export const applyLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.create({
      ...req.body,
      employee: req.user._id,
    });
    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ message: 'Failed to apply for leave' });
  }
};

export const viewLeaveHistory = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ employee: req.user._id }).populate('employee', 'name email');
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch leave history' });
  }
};

export const cancelLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    if (leave.employee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this leave' });
    }

    await leave.deleteOne();
    res.json({ message: 'Leave cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel leave' });
  }
};
