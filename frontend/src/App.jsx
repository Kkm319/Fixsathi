import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingView from './pages/LandingView';
import DashboardView from './pages/DashboardView';
import AppliancesView from './pages/AppliancesView';
import ApplianceDetailView from './pages/ApplianceDetailView';
import RepairHistoryView from './pages/RepairHistoryView';
import DocumentsView from './pages/DocumentsView';
import VoiceAssistantView from './pages/VoiceAssistantView';
import TechnicianView from './pages/TechnicianView';
import SettingsView from './pages/SettingsView';

// Modals
import AddApplianceModal from './components/AddApplianceModal';
import DocumentUploadModal from './components/DocumentUploadModal';
import AddRepairModal from './components/AddRepairModal';
import RepairReportModal from './components/RepairReportModal';

import { 
  fetchMetrics, 
  fetchAppliances, 
  fetchRepairs, 
  fetchDocuments 
} from './api';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isTechnicianMode, setIsTechnicianMode] = useState(false);
  const [selectedApplianceId, setSelectedApplianceId] = useState(null);

  // Data states
  const [metrics, setMetrics] = useState(null);
  const [appliances, setAppliances] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddApplianceOpen, setIsAddApplianceOpen] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState(null);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [targetApplianceForDoc, setTargetApplianceForDoc] = useState(null);
  const [isAddRepairOpen, setIsAddRepairOpen] = useState(false);
  const [targetApplianceForRepair, setTargetApplianceForRepair] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportApplianceId, setReportApplianceId] = useState(null);

  const loadAllData = async () => {
    try {
      const [m, a, r, d] = await Promise.all([
        fetchMetrics(),
        fetchAppliances(),
        fetchRepairs(),
        fetchDocuments()
      ]);
      setMetrics(m);
      setAppliances(a);
      setRepairs(r);
      setDocuments(d);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSelectAppliance = (id) => {
    setSelectedApplianceId(id);
    setCurrentView('detail');
  };

  const handleOpenUploadDoc = (appliance) => {
    setTargetApplianceForDoc(appliance || appliances[0]);
    setIsUploadDocOpen(true);
  };

  const handleOpenAddRepair = (appliance) => {
    setTargetApplianceForRepair(appliance || appliances[0]);
    setIsAddRepairOpen(true);
  };

  const handleOpenReportModal = (appId) => {
    setReportApplianceId(appId);
    setIsReportModalOpen(true);
  };

  const handleEditAppliance = (app) => {
    setEditingAppliance(app);
    setIsAddApplianceOpen(true);
  };

  const handleVoiceSuccess = () => {
    loadAllData();
    setCurrentView('technician');
    setIsTechnicianMode(true);
  };

  // If in landing view, render full landing page
  if (currentView === 'landing') {
    return (
      <div>
        <Navbar 
          currentView={currentView}
          setCurrentView={setCurrentView}
          isTechnicianMode={isTechnicianMode}
          setIsTechnicianMode={setIsTechnicianMode}
          onDataReset={loadAllData}
        />
        <LandingView onGetStarted={() => setCurrentView('dashboard')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-zinc-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      <Navbar 
        currentView={currentView}
        setCurrentView={setCurrentView}
        isTechnicianMode={isTechnicianMode}
        setIsTechnicianMode={setIsTechnicianMode}
        onDataReset={loadAllData}
      />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar 
          currentView={currentView}
          setCurrentView={(view) => {
            if (view !== 'detail') setSelectedApplianceId(null);
            setCurrentView(view);
          }}
          isTechnicianMode={isTechnicianMode}
          setIsTechnicianMode={setIsTechnicianMode}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-8 max-w-6xl mx-auto w-full">
          {currentView === 'dashboard' && (
            <DashboardView 
              metrics={metrics}
              appliances={appliances}
              repairs={repairs}
              onSelectAppliance={handleSelectAppliance}
              onOpenAddModal={() => {
                setEditingAppliance(null);
                setIsAddApplianceOpen(true);
              }}
              onNavigateToVoice={() => setCurrentView('voice')}
            />
          )}

          {currentView === 'appliances' && (
            <AppliancesView 
              appliances={appliances}
              onSelectAppliance={handleSelectAppliance}
              onOpenAddModal={() => {
                setEditingAppliance(null);
                setIsAddApplianceOpen(true);
              }}
              onEditAppliance={handleEditAppliance}
              onRefresh={loadAllData}
            />
          )}

          {currentView === 'detail' && selectedApplianceId && (
            <ApplianceDetailView 
              applianceId={selectedApplianceId}
              onBack={() => setCurrentView('appliances')}
              onOpenUploadDoc={handleOpenUploadDoc}
              onOpenReportComplaint={(app) => {
                setSelectedApplianceId(app.id);
                setCurrentView('voice');
              }}
              onOpenAddRepair={handleOpenAddRepair}
              onOpenReportModal={handleOpenReportModal}
            />
          )}

          {currentView === 'history' && (
            <RepairHistoryView 
              repairs={repairs}
              onSelectAppliance={handleSelectAppliance}
            />
          )}

          {currentView === 'documents' && (
            <DocumentsView 
              documents={documents}
              appliances={appliances}
              onSelectAppliance={handleSelectAppliance}
              onOpenUploadModal={handleOpenUploadDoc}
            />
          )}

          {currentView === 'voice' && (
            <VoiceAssistantView 
              appliances={appliances}
              preselectedApplianceId={selectedApplianceId}
              onSuccess={handleVoiceSuccess}
            />
          )}

          {currentView === 'technician' && (
            <TechnicianView onRefresh={loadAllData} />
          )}

          {currentView === 'settings' && (
            <SettingsView onDataReset={loadAllData} />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <AddApplianceModal 
        isOpen={isAddApplianceOpen}
        onClose={() => {
          setIsAddApplianceOpen(false);
          setEditingAppliance(null);
        }}
        initialData={editingAppliance}
        onSaved={loadAllData}
      />

      <DocumentUploadModal 
        isOpen={isUploadDocOpen}
        onClose={() => setIsUploadDocOpen(false)}
        appliance={targetApplianceForDoc}
        onSaved={loadAllData}
      />

      <AddRepairModal 
        isOpen={isAddRepairOpen}
        onClose={() => setIsAddRepairOpen(false)}
        appliance={targetApplianceForRepair}
        onSaved={loadAllData}
      />

      <RepairReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        applianceId={reportApplianceId}
      />
    </div>
  );
}
