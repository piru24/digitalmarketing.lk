import { useEffect, useState } from 'react';
import axios from '../api/axios';
import GroceryForm from './GroceryForm';
import GroceryList from './GroceryList';
import { useNavigate } from 'react-router-dom';
import bannerBg from '../assets/background-image-featuring-a-paper-bag-filled-with-healthy-vegan-and-vegetarian-food-including-free-photo.jpg';
import { LogOut, BarChart2 } from 'lucide-react'; 

const GroceryDashboard = () => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchItems = async () => {
    try {
      const res = await axios.get('/groceries', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) navigate('/login');
    }
  };

  useEffect(() => {
    if (!token) return navigate('/login');
    fetchItems();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const total = items.length;
  const completedCount = items.filter(i => i.completed).length;
  const pendingCount = total - completedCount;

  return (
    <div className="min-h-screen bg-[#f7fced]">
      {/* 🌿 Hero Section */}
      <div
        className="relative text-white py-16 px-4 md:px-10 text-center"
        style={{
          backgroundImage: `url(${bannerBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-lime-800 opacity-70"></div>

        {/* 🔝 Top Navigation */}
        <div className="relative z-20 flex justify-end gap-4 p-4 absolute top-0 right-0">
          <button
            onClick={() => navigate('/report')}
            className="bg-white text-lime-800 p-2 rounded-full hover:bg-lime-100"
            title="Go to Report"
          >
            <BarChart2 size={20} />
          </button>
          <button
            onClick={handleLogout}
            className="bg-white text-lime-800 p-2 rounded-full hover:bg-red-100"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-4 mt-6">
          <h1 className="text-4xl font-bold">🛒 Grocery & Household Planner</h1>
          <p className="text-lg opacity-90">
            Track your daily groceries, stay organized, and never forget an item.
          </p>
          <div className="flex flex-wrap justify-center gap-4 font-medium">
            <div className="bg-white/90 px-4 py-2 rounded-lg text-lime-900 shadow-md">
              Total Tasks: {total}
            </div>
            <div className="bg-white/90 px-4 py-2 rounded-lg text-lime-900 shadow-md">
              Completed: {completedCount}
            </div>
            <div className="bg-white/90 px-4 py-2 rounded-lg text-lime-900 shadow-md">
              Pending: {pendingCount}
            </div>
          </div>
        </div>
      </div>

      {/* Action Section */}
      <div className="bg-lime-700 text-white p-6 mt-8 mx-4 md:mx-10 rounded-xl mb-6 shadow-md relative overflow-hidden">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Grocery Task Assistant</h1>
        <p className="text-base md:text-lg mb-4">
          Plan smart. Shop wise. Stay organized at home!
        </p>

        {/* Moving Text */}
        <div className="overflow-hidden whitespace-nowrap mb-4">
          <div className="animate-marquee inline-block text-sm text-lime-100 font-semibold">
            Pro Tip: Use Done to track cost | Set deadlines to stay on track | Grocery planning saves time & money! 
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-lime-800 font-semibold px-4 py-2 rounded shadow hover:bg-lime-100 transition w-full sm:w-auto"
          >
            {showForm ? 'Close Form' : ' Create Task'}
          </button>

          <button
            onClick={() => navigate('/report')}
            className="bg-lime-900 text-white font-semibold px-4 py-2 rounded shadow hover:bg-lime-800 transition w-full sm:w-auto"
          >
            View Report
          </button>
        </div>
      </div>

      {/*  Task List + Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 md:px-10 pb-10">
        {/* Left: Task List */}
        <div className="lg:col-span-3">
          <GroceryList items={items} refresh={fetchItems} />
        </div>

        {/* Right: Conditional Form */}
        {showForm && (
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-lg shadow">
              <GroceryForm refresh={fetchItems} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroceryDashboard;
