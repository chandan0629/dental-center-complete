import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientDashboard from './pages/PatientDashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import CalendarView from './pages/CalendarView';
import MyAppointments from './pages/MyAppointments';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Admin Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute roles={['Admin']}>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/patients" element={
                <ProtectedRoute roles={['Admin']}>
                  <Layout>
                    <Patients />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/appointments" element={
                <ProtectedRoute roles={['Admin']}>
                  <Layout>
                    <Appointments />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/calendar" element={
                <ProtectedRoute roles={['Admin']}>
                  <Layout>
                    <CalendarView />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Patient Routes */}
              <Route path="/patient-dashboard" element={
                <ProtectedRoute roles={['Patient']}>
                  <Layout>
                    <PatientDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/my-appointments" element={
                <ProtectedRoute roles={['Patient']}>
                  <Layout>
                    <MyAppointments />
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
