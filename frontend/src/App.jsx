import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import BrowsePage from './pages/BrowsePage';
import UploadPage from './pages/UploadPage';
import ResourceDetailPage from './pages/ResourceDetailPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return null;
  return currentUser ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return null;
  return !currentUser ? children : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="browse" element={<BrowsePage />} />
      <Route path="resources/:id" element={<ResourceDetailPage />} />

      <Route path="login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />

      <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="upload"    element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
      <Route path="profile"   element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="admin"     element={<AdminRoute><AdminPage /></AdminRoute>} />

      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 500,
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#f8fafc' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#f8fafc' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
