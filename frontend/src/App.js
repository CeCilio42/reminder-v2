import React from 'react';
import PropTypes from 'prop-types';
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

const AuthenticationGuard = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

AuthenticationGuard.propTypes = {
  children: PropTypes.node.isRequired
};

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Topbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired
};

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
            <AuthenticationGuard>
              <AppLayout>
                <Home />
              </AppLayout>
            </AuthenticationGuard>
          } />
          <Route path="/create" element={
            <AuthenticationGuard>
              <AppLayout>
                <Create />
              </AppLayout>
            </AuthenticationGuard>
          } />
          <Route path="/company" element={
            <AuthenticationGuard>
              <AppLayout>
                <Company />
              </AppLayout>
            </AuthenticationGuard>
          } />
          <Route path="/calendar" element={
            <AuthenticationGuard>
              <AppLayout>
                <Calendar />
              </AppLayout>
            </AuthenticationGuard>
          } />
          <Route path="/saved" element={
            <AuthenticationGuard>
              <AppLayout>
                <Saved />
              </AppLayout>
            </AuthenticationGuard>
          } />
        </Routes>
        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
