import React, { createContext, useContext, useEffect, useState } from 'react';
import { Patient, Incident, AppContextType } from '../types';
import { 
  getPatients, 
  savePatients, 
  getIncidents, 
  saveIncidents, 
  generateId,
  initializeStorage
} from '../utils/storage';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    initializeStorage();
    setPatients(getPatients());
    setIncidents(getIncidents());
  }, []);

  const addPatient = (patientData: Omit<Patient, 'id'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: generateId()
    };
    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    savePatients(updatedPatients);
  };

  const updatePatient = (id: string, patientData: Partial<Patient>) => {
    const updatedPatients = patients.map(patient =>
      patient.id === id ? { ...patient, ...patientData } : patient
    );
    setPatients(updatedPatients);
    savePatients(updatedPatients);
  };

  const deletePatient = (id: string) => {
    const updatedPatients = patients.filter(patient => patient.id !== id);
    const updatedIncidents = incidents.filter(incident => incident.patientId !== id);
    setPatients(updatedPatients);
    setIncidents(updatedIncidents);
    savePatients(updatedPatients);
    saveIncidents(updatedIncidents);
  };

  const addIncident = (incidentData: Omit<Incident, 'id'>) => {
    const newIncident: Incident = {
      ...incidentData,
      id: generateId()
    };
    const updatedIncidents = [...incidents, newIncident];
    setIncidents(updatedIncidents);
    saveIncidents(updatedIncidents);
  };

  const updateIncident = (id: string, incidentData: Partial<Incident>) => {
    const updatedIncidents = incidents.map(incident =>
      incident.id === id ? { ...incident, ...incidentData } : incident
    );
    setIncidents(updatedIncidents);
    saveIncidents(updatedIncidents);
  };

  const deleteIncident = (id: string) => {
    const updatedIncidents = incidents.filter(incident => incident.id !== id);
    setIncidents(updatedIncidents);
    saveIncidents(updatedIncidents);
  };

  const value: AppContextType = {
    patients,
    incidents,
    addPatient,
    updatePatient,
    deletePatient,
    addIncident,
    updateIncident,
    deleteIncident
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
