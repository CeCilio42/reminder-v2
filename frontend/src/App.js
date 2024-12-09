import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Topbar from './components/Topbar/Topbar';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './pages/Home';
import Create from './pages/Create';
import Company from './pages/Company';
import Saved from './pages/Saved';
import Calendar from './pages/Calendar';
import LandingPage from './pages/LandingPage';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AuthenticatedLayout = ({ children }) => (
  <div className="flex h-screen bg-gray-100">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Topbar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        {children}
      </main>
    </div>
  </div>
);

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Home />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Create />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/company" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Company />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/calendar" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Calendar />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/saved" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Saved />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
        </Routes>
        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
