import CompanyPage from './pages/CompanyPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute  from './components/ProtectedRoute';
import LandingPage     from './pages/LandingPage';
import AuthPage        from './pages/AuthPage';
import InputPage       from './pages/InputPage';
import DashboardPage   from './pages/DashboardPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"          element={<LandingPage />} />
          <Route path="/auth"      element={<AuthPage />} />
          <Route path="/input"     element={<ProtectedRoute><InputPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/company" element={<ProtectedRoute><CompanyPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
