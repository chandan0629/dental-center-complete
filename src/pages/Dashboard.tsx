import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Activity,
  AlertCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { patients, incidents } = useApp();

  const dashboardData = useMemo(() => {
    const now = new Date();
    const nextWeek = addDays(now, 7);

    // Upcoming appointments (next 10)
    const upcomingAppointments = incidents
      .filter(incident => {
        const appointmentDate = new Date(incident.appointmentDate);
        return isAfter(appointmentDate, now);
      })
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
      .slice(0, 10);

    // Today's appointments
    const todayAppointments = incidents.filter(incident => {
      const appointmentDate = new Date(incident.appointmentDate);
      const today = new Date();
      return appointmentDate.toDateString() === today.toDateString();
    });

    // This week's appointments
    const weeklyAppointments = incidents.filter(incident => {
      const appointmentDate = new Date(incident.appointmentDate);
      return isAfter(appointmentDate, now) && isBefore(appointmentDate, nextWeek);
    });

    // Status statistics
    const completedTreatments = incidents.filter(incident => incident.status === 'Completed').length;
    const pendingTreatments = incidents.filter(incident => incident.status === 'Scheduled').length;
    const inProgressTreatments = incidents.filter(incident => incident.status === 'In Progress').length;

    // Revenue calculation
    const totalRevenue = incidents
      .filter(incident => incident.cost && incident.status === 'Completed')
      .reduce((sum, incident) => sum + (incident.cost || 0), 0);

    const monthlyRevenue = incidents
      .filter(incident => {
        if (!incident.cost || incident.status !== 'Completed') return false;
        const appointmentDate = new Date(incident.appointmentDate);
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        return appointmentDate.getMonth() === currentMonth && appointmentDate.getFullYear() === currentYear;
      })
      .reduce((sum, incident) => sum + (incident.cost || 0), 0);

    // Top patients (by number of appointments)
    const patientAppointmentCount = patients.map(patient => {
      const appointmentCount = incidents.filter(incident => incident.patientId === patient.id).length;
      return { ...patient, appointmentCount };
    })
    .sort((a, b) => b.appointmentCount - a.appointmentCount)
    .slice(0, 5);

    return {
      upcomingAppointments,
      todayAppointments,
      weeklyAppointments,
      completedTreatments,
      pendingTreatments,
      inProgressTreatments,
      totalRevenue,
      monthlyRevenue,
      patientAppointmentCount
    };
  }, [patients, incidents]);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={patients.length}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Today's Appointments"
          value={dashboardData.todayAppointments.length}
          icon={Calendar}
          color="bg-green-500"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${dashboardData.monthlyRevenue}`}
          icon={DollarSign}
          color="bg-yellow-500"
        />
        <StatCard
          title="Completed Treatments"
          value={dashboardData.completedTreatments}
          icon={CheckCircle}
          color="bg-purple-500"
        />
      </div>

      {/* Treatment Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Pending Treatments"
          value={dashboardData.pendingTreatments}
          icon={Clock}
          color="bg-orange-500"
        />
        <StatCard
          title="In Progress"
          value={dashboardData.inProgressTreatments}
          icon={Activity}
          color="bg-indigo-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${dashboardData.totalRevenue}`}
          icon={TrendingUp}
          color="bg-emerald-500"
          subtitle="All time"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="mr-2" size={20} />
              Next 10 Appointments
            </h3>
          </div>
          <div className="p-6">
            {dashboardData.upcomingAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
            ) : (
              <div className="space-y-4">
                {dashboardData.upcomingAppointments.map((incident) => {
                  const patient = patients.find(p => p.id === incident.patientId);
                  return (
                    <div key={incident.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{patient?.name}</p>
                        <p className="text-sm text-gray-600">{incident.title}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(incident.appointmentDate), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        incident.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                        incident.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        incident.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {incident.status}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Top Patients */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="mr-2" size={20} />
              Top Patients
            </h3>
          </div>
          <div className="p-6">
            {dashboardData.patientAppointmentCount.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No patients found</p>
            ) : (
              <div className="space-y-4">
                {dashboardData.patientAppointmentCount.map((patient, index) => (
                  <div key={patient.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{patient.name}</p>
                        <p className="text-sm text-gray-600">{patient.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {patient.appointmentCount} appointments
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* This Week's Schedule */}
      {dashboardData.weeklyAppointments.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertCircle className="mr-2" size={20} />
              This Week's Schedule
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.weeklyAppointments.map((incident) => {
                const patient = patients.find(p => p.id === incident.patientId);
                return (
                  <div key={incident.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{patient?.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        incident.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                        incident.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {incident.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{incident.title}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(incident.appointmentDate), 'EEE, MMM d - h:mm a')}
                    </p>
                    {incident.cost && (
                      <p className="text-sm font-medium text-green-600 mt-2">
                        ${incident.cost}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
