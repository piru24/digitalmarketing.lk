import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import bannerBg from '../assets/background-image-featuring-a-paper-bag-filled-with-healthy-vegan-and-vegetarian-food-including-free-photo.jpg';



const VerifyOTP = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [msg, setMsg] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      setMsg('Email verified successfully');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Invalid or expired OTP');
    }
  };

   return (
    <div className="min-h-screen bg-lime-100">
      
     
      <div
        className="relative text-white py-14 px-4 md:px-10 text-center"
        style={{
          backgroundImage: `url(${bannerBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-lime-800 opacity-70"></div>
        <div className="relative z-10 max-w-xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Verify Your Email</h1>
          <p className="text-white/90">We’ve sent an OTP to your email. Please enter it below to complete your registration.</p>
        </div>
      </div>

      {/* 📨 OTP Form */}
      <div className="flex justify-center items-center p-6">
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
          {msg && <p className={`text-center mb-4 font-semibold ${msg.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
          <form onSubmit={handleVerify}>
            <label className="block text-lime-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-lime-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="block text-lime-700 font-semibold mb-1">OTP</label>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full mb-6 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-lime-400"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-lime-600 text-white py-2 rounded hover:bg-lime-700 transition"
            >
              Verify OTP
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Already verified?{' '}
            <span
              onClick={() => navigate('/login')}
              className="text-lime-700 font-semibold cursor-pointer underline"
            >
              Go to Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;