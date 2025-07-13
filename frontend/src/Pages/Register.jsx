import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/background-image-featuring-a-paper-bag-filled-with-healthy-vegan-and-vegetarian-food-including-free-photo.jpg'; // ✅ Update path if needed

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { email, password });
      setMsg('✅ OTP sent to email');
      setTimeout(() => navigate('/verify-otp'), 1500);
    } catch (err) {
      setMsg(err.response?.data?.msg || '❌ Registration failed');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Transparent overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur" />

      <div className="relative z-10 bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-lime-700 mb-4">Create Account</h2>
        <p className="text-center text-sm text-gray-600 mb-4">
          Start your Grocery Planner journey
        </p>

        {msg && (
          <div className="text-center text-sm text-red-600 mb-4">{msg}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Create Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-lime-600 hover:bg-lime-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Register & Send OTP
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-700">
          Already have an account?{' '}
          <a href="/login" className="text-lime-700 font-medium hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
