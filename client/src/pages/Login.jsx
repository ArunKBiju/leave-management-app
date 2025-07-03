import './Login.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [adminData, setAdminData] = useState({ email: '', password: '' });
  const [employeeData, setEmployeeData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const validateEmail = (email) => email.includes('@');

  const handleLogin = async (userType) => {
    setError('');
    const userData = userType === 'admin' ? adminData : employeeData;

    if (!userData.email || !userData.password) {
      return setError('All fields are required.');
    }
    if (!validateEmail(userData.email)) {
      return setError('Enter a valid email address.');
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const text = await res.text();
      const data = JSON.parse(text);
      if (!res.ok || !data?.user) throw new Error(data?.message || 'Login failed.');

      dispatch(setCredentials({ user: data.user, token: data.token }));

      if (userType === 'admin' && (data.user.role === 'admin' || data.user.role === 'manager')) {
        navigate('/admin/dashboard');
      } else if (userType === 'employee' && data.user.role === 'employee') {
        navigate('/employee/dashboard');
      } else {
        setError('Access denied. Role mismatch.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container skew-layer">
      <div className="skew-layer" />

      <div className="login-left">
        <h1 className="title-gradient">Manager Login</h1>
        <input
          type="email"
          placeholder="Email"
          className="input-field"
          value={adminData.email}
          onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="input-field"
          value={adminData.password}
          onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
          required
        />
        {error && <p className="error-text">{error}</p>}
        <div className="wrapper">
          <button className="cta" onClick={() => handleLogin('admin')}>
            <span>LOGIN</span>
            <span />
          </button>
        </div>
      </div>

      <div className="login-right">
        <h1 className="title-white">Employee Login</h1>
        <input
          type="email"
          placeholder="Email"
          className="input-field"
          value={employeeData.email}
          onChange={(e) => setEmployeeData({ ...employeeData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="input-field"
          value={employeeData.password}
          onChange={(e) => setEmployeeData({ ...employeeData, password: e.target.value })}
          required
        />
        {error && <p className="error-text">{error}</p>}
        <div className="wrapper">
          <button className="cta" onClick={() => handleLogin('employee')}>
            <span>LOGIN</span>
            <span />
          </button>
        </div>
        <p style={{ marginTop: '1rem' }}>
          New here?{' '}
          <Link to="/register" style={{ textDecoration: 'underline', color: 'white' }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
