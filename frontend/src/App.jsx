import { Routes, Route } from 'react-router-dom';
import Register from './Pages/Register';
import VerifyOTP from './Pages/VerifyOTP';
import Login from './Pages/Login';
import GroceryDashboard from './Pages/GroceryDashboard';
import GroceryForm from './Pages/GroceryForm';
import GroceryList from './Pages/GroceryList';
import ReportPage from './Pages/ReportPage';

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
       <Route path="/login" element={<Login />} />
       <Route path="/grocery" element={<GroceryDashboard />} />
       <Route path="/grocery-form" element={<GroceryForm />} />
       <Route path="/grocery-list" element={<GroceryList />} />
       <Route path="/report" element={<ReportPage />} />
    </Routes>
  );
}

export default App;
