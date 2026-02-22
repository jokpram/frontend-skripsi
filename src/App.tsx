import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import LandingPage from './pages/LandingPage';
import FeaturesPage from './pages/FeaturesPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import TraceabilityPage from './pages/products/Traceability';
import ChatBox from './components/chat/ChatBox';
import type { RootState } from './store';

// Dashboards
import AdminDashboard from './pages/dashboard/AdminDashboard';
import PetambakDashboard from './pages/dashboard/PetambakDashboard';
import LogistikDashboard from './pages/dashboard/LogistikDashboard';
import KonsumenDashboard from './pages/dashboard/KonsumenDashboard';

const AccessDenied = () => <div className="pt-24 container mx-auto px-4"><h1 className="text-2xl font-bold text-red-600">Access Denied</h1><p>You do not have permission to view this page.</p></div>;

const DashboardRouter = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated || !user) return <Navigate to="/login" />;

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
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
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
          </main>
          <Footer />
          <ChatBox />
        </div>
      </Router>
    </>
  );
}

export default App;
