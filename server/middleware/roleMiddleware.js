const isManager = (req, res, next) => {
  if (req.user && req.user.role.toLowerCase() === 'manager') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Managers only' });
  }
};

const isEmployee = (req, res, next) => {
  if (req.user && req.user.role.toLowerCase() === 'employee') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Employees only' });
  }
};

const isAdminOrManager = (req, res, next) => {
  const role = req.user?.role?.toLowerCase();
  if (role === 'admin' || role === 'manager') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin or Manager only' });
  }
};

export { isManager, isEmployee, isAdminOrManager };
