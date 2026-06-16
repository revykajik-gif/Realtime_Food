import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import Login from "./pages/Login.jsx";
import RestaurantDashboard from "./pages/RestaurantDashboard.jsx";
import RiderDashboard from "./pages/RiderDashboard.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Register from "./pages/Register";
const dashboardByRole = {
  CUSTOMER: <CustomerDashboard />,
  RESTAURANT_OWNER: <RestaurantDashboard />,
  RIDER: <RiderDashboard />,
  ADMIN: <AdminDashboard />,
};

const ProtectedDashboard = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{dashboardByRole[user.role]}</Layout>;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      
    </Routes>
  );
}
