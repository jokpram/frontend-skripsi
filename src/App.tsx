import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import LandingPage from './pages/LandingPage';
import FeaturesPage from './pages/FeaturesPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import TraceabilityPage from './pages/products/Traceability';

// Dashboards
import AdminDashboard from './pages/dashboard/AdminDashboard';
import PetambakDashboard from './pages/dashboard/PetambakDashboard';
import LogistikDashboard from './pages/dashboard/LogistikDashboard';
import KonsumenDashboard from './pages/dashboard/KonsumenDashboard';
const AccessDenied = () => <div className="container" style={{ paddingTop: '6rem' }}><h1>Access Denied</h1></div>;

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case 'admin': return <AdminDashboard />;
    case 'petambak': return <PetambakDashboard />;
    case 'logistik': return <LogistikDashboard />;
    case 'konsumen': return <KonsumenDashboard />;
    default: return <AccessDenied />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/traceability" element={<TraceabilityPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<DashboardRouter />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
