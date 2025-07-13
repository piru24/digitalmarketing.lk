import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/background-image-featuring-a-paper-bag-filled-with-healthy-vegan-and-vegetarian-food-including-free-photo.jpg'; // ✅ Adjust path if different


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      setMsg('Login successful');

      setTimeout(() => navigate('/grocery'), 1000);
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay with slight opacity */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur"></div>

      <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-lime-700">Welcome Back!</h2>
          <p className="text-gray-600 text-sm">Login to your Grocery Planner</p>
        </div>

        {msg && (
          <div className="text-center text-sm text-red-600 mb-4">{msg}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500"
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-lime-600 hover:bg-lime-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Login
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-700">
          Don’t have an account?{' '}
          <a href="/register" className="text-lime-700 font-medium hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
