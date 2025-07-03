import { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      return setError('All fields are required.');
    }
    if (!validateEmail(formData.email)) {
      return setError('Invalid email format.');
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess('Registered successfully! Please login.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7a5fff] to-[#50c878] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white px-10 py-12 rounded-2xl shadow-xl w-full max-w-xl flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-center text-cyan-700 mt-6">
          Employee Register
        </h2>

        {error && <div className="text-red-600 text-center">{error}</div>}
        {success && <div className="text-green-600 text-center">{success}</div>}

        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col gap-2 w-4/5">
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              className="w-full px-5 py-3 border rounded-md focus:outline-none focus:ring focus:border-cyan-500"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-2 w-4/5">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-5 py-3 border rounded-md focus:outline-none focus:ring focus:border-cyan-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-2 w-4/5">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-5 py-3 border rounded-md focus:outline-none focus:ring focus:border-cyan-500"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <input type="hidden" name="role" value="employee" />

          <button
            type="submit"
            className="w-4/5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-5 py-3 rounded-md transition duration-300"
          >
            Register
          </button>
        </div>

        <p className="text-sm text-center mt-4 mb-8">
          Already a user?{' '}
          <Link to="/login" className="text-cyan-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
