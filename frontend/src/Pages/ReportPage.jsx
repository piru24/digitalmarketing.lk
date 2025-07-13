import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import bannerBg from '../assets/background-image-featuring-a-paper-bag-filled-with-healthy-vegan-and-vegetarian-food-including-free-photo.jpg';
import { LogOut, BarChart2, List } from 'lucide-react'; // 🎯 Use Lucide icons (already in shadcn setup)

const ReportPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const fetchReport = async (selectedMonth, selectedYear) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `/groceries/report/monthly?month=${selectedMonth}&year=${selectedYear}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReport(res.data);
    } catch (err) {
      console.error('Error fetching report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(month, year);
  }, [month, year]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f7fced]">
      {/* 🎯 Hero Banner with Navigation */}
      <div
        className="relative bg-lime-700 text-white py-16 px-4 md:px-10 text-center"
        style={{
          backgroundImage: `url(${bannerBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-lime-800 opacity-70"></div>

        {/* 🔝 Top Navigation */}
        <div className="relative z-20 flex justify-end gap-4 p-4 absolute top-0 right-0">
          <button
            onClick={() => navigate('/grocery')}
            className="bg-white text-lime-800 p-2 rounded-full hover:bg-lime-100"
            title="Grocery Dashboard"
          >
            <List size={20} />
          </button>
          <button
            onClick={() => navigate('/report')}
            className="bg-white text-lime-800 p-2 rounded-full hover:bg-lime-100"
            title="Report Page"
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

        <div className="relative z-10 max-w-3xl mx-auto mt-8">
          <h1 className="text-4xl font-bold mb-4"> Monthly Grocery Report</h1>
          <p className="text-lg opacity-90 mb-4">Check your grocery summary and track monthly expenses.</p>
        </div>
      </div>

     
      <div className="p-6 max-w-5xl mx-auto">
        
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="p-2 border rounded shadow"
          >
            {months.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="p-2 border rounded shadow"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : !report?.summary || Object.keys(report.summary).length === 0 ? (
          <p className="text-center text-gray-600">No completed items for this month.</p>
        ) : (
          <>
            {/*  Summary Box */}
            <div className="bg-lime-100 border-lime-400 border-l-4 p-4 rounded shadow-md mb-6">
              <p className="text-lg font-semibold text-lime-800">
                 {report.month} {year} | 💰 Total Spent: Rs. {report.totalExpense.toFixed(2)}
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow rounded-lg text-sm sm:text-base">
                <thead className="bg-lime-500 text-white">
                  <tr>
                    <th className="p-3 text-left">Item</th>
                    <th className="p-3 text-left">Total Quantity</th>
                    <th className="p-3 text-left">Total Cost (Rs)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(report.summary).map(([item, value], index) => (
                    <tr key={index} className="border-b hover:bg-lime-50">
                      <td className="p-3 font-medium">{item}</td>
                      <td className="p-3">{value.quantity}</td>
                      <td className="p-3">Rs. {value.expense.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportPage;
