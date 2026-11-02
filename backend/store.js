const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(__dirname, 'data');
const dbFile = path.resolve(dataDir, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial realistic demo seed data adhering to FixSaathi spec
const defaultData = {
  users: [
    {
      id: 'user_1',
      name: 'Parul Sharma',
      email: 'parul@fixsaathi.in',
      preferredLanguage: 'hi-IN',
      phone: '+91 98765 43210',
      address: 'B-402, Green Glen Layout, Bangalore, Karnataka'
    }
  ],
  appliances: [
    {
      id: 'app_1',
      userId: 'user_1',
      name: 'Washing Machine',
      brand: 'Samsung',
      modelNumber: 'WW80T504DAX',
      purchaseDate: '2025-01-10',
      warrantyExpiryDate: '2027-01-10',
      serialNumber: 'SM-WM-8829104',
      status: 'Active', // Warranty status: Active, Expired, Unknown
      category: 'Laundry',
      isDemo: true
    },
    {
      id: 'app_2',
      userId: 'user_1',
      name: 'Refrigerator',
      brand: 'LG',
      modelNumber: 'GL-T402JDS3',
      purchaseDate: '2024-03-15',
      warrantyExpiryDate: '2026-03-15',
      serialNumber: 'LG-RF-9043221',
      status: 'Active',
      category: 'Kitchen',
      isDemo: true
    },
    {
      id: 'app_3',
      userId: 'user_1',
      name: 'Air Conditioner',
      brand: 'Voltas',
      modelNumber: '185V-JZTI',
      purchaseDate: '2023-05-20',
      warrantyExpiryDate: '2024-05-20',
      serialNumber: 'VOL-AC-4410982',
      status: 'Expired',
      category: 'Cooling',
      isDemo: true
    },
    {
      id: 'app_4',
      userId: 'user_1',
      name: 'Microwave Oven',
      brand: 'IFB',
      modelNumber: '30BRC2',
      purchaseDate: '2025-08-11',
      warrantyExpiryDate: '2027-08-11',
      serialNumber: 'IFB-MW-1192834',
      status: 'Active',
      category: 'Kitchen',
      isDemo: true
    }
  ],
  repairs: [
    {
      id: 'rep_1',
      applianceId: 'app_1',
      complaint: 'Water not draining from drum',
      problemReported: 'Water not draining',
      repairDate: '2026-09-15',
      workPerformed: 'Drain pump replaced and outlet valve cleaned',
      replacedParts: 'Drain Pump Assembly (DC31-00181A)',
      amountPaid: 1200,
      technicianName: 'Ramesh Kumar (Samsung Care)',
      technicianContact: '+91 98450 11223',
      status: 'Completed',
      notes: '1 month warranty provided on the newly installed drain pump.',
      isDemo: true
    },
    {
      id: 'rep_2',
      applianceId: 'app_2',
      complaint: 'Excessive cooling and ice formation in chiller tray',
      problemReported: 'Chiller tray over-freezing',
      repairDate: '2025-11-04',
      workPerformed: 'Defrost thermostat sensor replaced and temperature calibrated',
      replacedParts: 'Defrost Thermostat Sensor',
      amountPaid: 950,
      technicianName: 'Sanjay Verma (LG Authorized Service)',
      technicianContact: '+91 99123 45678',
      status: 'Completed',
      notes: 'Sensor recalibrated, functioning normally.',
      isDemo: true
    },
    {
      id: 'rep_3',
      applianceId: 'app_3',
      complaint: 'AC blowing room temperature air instead of cooling',
      problemReported: 'No cooling',
      repairDate: '2024-04-12',
      workPerformed: 'Refrigerant gas leak patched and R32 gas recharged',
      replacedParts: 'Copper pipe flare nut & R32 refrigerant',
      amountPaid: 2400,
      technicianName: 'CoolComfort Solutions (Anand)',
      technicianContact: '+91 98234 56789',
      status: 'Completed',
      notes: 'Advised cleaning condenser filter every 3 months.',
      isDemo: true
    }
  ],
  documents: [
    {
      id: 'doc_1',
      applianceId: 'app_1',
      documentType: 'Repair Bill',
      filename: 'samsung_wm_drain_pump_bill_sep2026.pdf',
      fileUrl: '/uploads/sample_samsung_bill.pdf',
      extractedData: {
        documentType: 'Repair Bill',
        applianceName: 'Washing Machine',
        brand: 'Samsung',
        modelNumber: 'WW80T504DAX',
        repairDate: '2026-09-15',
        technicianName: 'Ramesh Kumar (Samsung Care)',
        replacedParts: 'Drain Pump Assembly',
        amountPaid: 1200,
        warrantyStatus: 'Active'
      },
      uploadedAt: '2026-09-16T10:30:00Z',
      isDemo: true
    },
    {
      id: 'doc_2',
      applianceId: 'app_1',
      documentType: 'Warranty Card',
      filename: 'samsung_digital_inverter_warranty.pdf',
      fileUrl: '/uploads/samsung_warranty_card.pdf',
      extractedData: {
        documentType: 'Warranty Card',
        applianceName: 'Washing Machine',
        brand: 'Samsung',
        modelNumber: 'WW80T504DAX',
        purchaseDate: '2025-01-10',
        warrantyExpiryDate: '2027-01-10',
        technicianName: 'Samsung India Electronics',
        replacedParts: 'Comprehensive Machine + 10Yr Motor Warranty',
        amountPaid: 0,
        warrantyStatus: 'Active'
      },
      uploadedAt: '2025-01-11T14:15:00Z',
      isDemo: true
    }
  ],
  serviceRequests: [
    {
      id: 'sr_1',
      applianceId: 'app_1',
      userId: 'user_1',
      complaint: 'Washing machine water is not draining again after spin cycle.',
      transcription: 'वॉशिंग मशीन से पानी बाहर नहीं निकल रहा है। पिछले महीने भी यही परेशानी हुई थी। (Washing machine is not draining water. The same problem occurred last month.)',
      status: 'Pending', // Pending, In Progress, Completed
      priority: 'High',
      isRecurring: true,
      previousRepairRef: 'rep_1',
      suggestedQuestions: [
        'Is the drain pump assembly failing again or is there an internal impeller blockage?',
        'Was the replaced drain pump genuine Samsung spare part?',
        'Is the coin trap/drain filter clogged with coins or fabric threads?'
      ],
      technicianNotes: 'Assigned to field technician for priority inspection.',
      createdAt: '2026-11-01T15:20:00Z',
      isDemo: true
    }
  ]
};

// Database wrapper
class DataStore {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(dbFile)) {
        const raw = fs.readFileSync(dbFile, 'utf8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed reading db.json, using default seed data:', e.message);
    }
    this.save(defaultData);
    return JSON.parse(JSON.stringify(defaultData));
  }

  save(dataToSave = this.data) {
    try {
      fs.writeFileSync(dbFile, JSON.stringify(dataToSave, null, 2), 'utf8');
    } catch (e) {
      console.error('Failed writing db.json:', e.message);
    }
  }

  resetDemo() {
    this.data = JSON.parse(JSON.stringify(defaultData));
    this.save();
    return this.data;
  }

  // Appliances
  getAppliances() {
    return this.data.appliances.map(app => {
      const repairs = this.data.repairs.filter(r => r.applianceId === app.id);
      return {
        ...app,
        repairCount: repairs.length,
        totalSpent: repairs.reduce((sum, r) => sum + (Number(r.amountPaid) || 0), 0)
      };
    });
  }

  getApplianceById(id) {
    const app = this.data.appliances.find(a => a.id === id);
    if (!app) return null;
    const repairs = this.data.repairs.filter(r => r.applianceId === id).sort((a, b) => new Date(b.repairDate) - new Date(a.repairDate));
    const documents = this.data.documents.filter(d => d.applianceId === id);
    const serviceRequests = this.data.serviceRequests.filter(s => s.applianceId === id);
    
    // Check if there are recurring issues in past repairs
    const recurringAlert = repairs.length > 1;

    return {
      ...app,
      repairCount: repairs.length,
      totalSpent: repairs.reduce((sum, r) => sum + (Number(r.amountPaid) || 0), 0),
      repairs,
      documents,
      serviceRequests,
      hasRecurringIssue: recurringAlert
    };
  }

  addAppliance(appData) {
    const newApp = {
      id: 'app_' + Date.now(),
      userId: 'user_1',
      name: appData.name || 'Unnamed Appliance',
      brand: appData.brand || 'Unknown',
      modelNumber: appData.modelNumber || '',
      purchaseDate: appData.purchaseDate || new Date().toISOString().split('T')[0],
      warrantyExpiryDate: appData.warrantyExpiryDate || '',
      serialNumber: appData.serialNumber || '',
      status: appData.status || (appData.warrantyExpiryDate && new Date(appData.warrantyExpiryDate) >= new Date() ? 'Active' : 'Expired'),
      category: appData.category || 'General',
      isDemo: false
    };
    this.data.appliances.push(newApp);
    this.save();
    return newApp;
  }

  updateAppliance(id, updates) {
    const idx = this.data.appliances.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.data.appliances[idx] = { ...this.data.appliances[idx], ...updates };
    this.save();
    return this.data.appliances[idx];
  }

  deleteAppliance(id) {
    const idx = this.data.appliances.findIndex(a => a.id === id);
    if (idx === -1) return false;
    this.data.appliances.splice(idx, 1);
    this.data.repairs = this.data.repairs.filter(r => r.applianceId !== id);
    this.data.documents = this.data.documents.filter(d => d.applianceId !== id);
    this.data.serviceRequests = this.data.serviceRequests.filter(s => s.applianceId !== id);
    this.save();
    return true;
  }

  // Repairs
  getRepairs(applianceId = null) {
    if (applianceId) {
      return this.data.repairs.filter(r => r.applianceId === applianceId).sort((a, b) => new Date(b.repairDate) - new Date(a.repairDate));
    }
    return this.data.repairs.map(r => {
      const app = this.data.appliances.find(a => a.id === r.applianceId);
      return {
        ...r,
        applianceName: app ? `${app.brand} ${app.name}` : 'Unknown Appliance'
      };
    }).sort((a, b) => new Date(b.repairDate) - new Date(a.repairDate));
  }

  addRepair(repairData) {
    const newRepair = {
      id: 'rep_' + Date.now(),
      applianceId: repairData.applianceId,
      complaint: repairData.complaint || repairData.problemReported || 'General servicing',
      problemReported: repairData.problemReported || repairData.complaint || 'General servicing',
      repairDate: repairData.repairDate || new Date().toISOString().split('T')[0],
      workPerformed: repairData.workPerformed || 'Inspection and repair completed',
      replacedParts: repairData.replacedParts || 'None',
      amountPaid: Number(repairData.amountPaid) || 0,
      technicianName: repairData.technicianName || 'Certified Technician',
      technicianContact: repairData.technicianContact || '',
      status: repairData.status || 'Completed',
      notes: repairData.notes || '',
      isDemo: false
    };
    this.data.repairs.push(newRepair);
    this.save();
    return newRepair;
  }

  // Documents
  getDocuments(applianceId = null) {
    if (applianceId) {
      return this.data.documents.filter(d => d.applianceId === applianceId);
    }
    return this.data.documents.map(d => {
      const app = this.data.appliances.find(a => a.id === d.applianceId);
      return {
        ...d,
        applianceName: app ? `${app.brand} ${app.name}` : 'General'
      };
    });
  }

  addDocument(docData) {
    const newDoc = {
      id: 'doc_' + Date.now(),
      applianceId: docData.applianceId,
      documentType: docData.documentType || 'Repair Bill',
      filename: docData.filename,
      fileUrl: docData.fileUrl,
      extractedData: docData.extractedData || {},
      uploadedAt: new Date().toISOString(),
      isDemo: false
    };
    this.data.documents.push(newDoc);
    this.save();
    return newDoc;
  }

  // Service Requests
  getServiceRequests() {
    return this.data.serviceRequests.map(sr => {
      const app = this.data.appliances.find(a => a.id === sr.applianceId);
      const repairs = this.data.repairs.filter(r => r.applianceId === sr.applianceId);
      return {
        ...sr,
        appliance: app,
        repairHistoryCount: repairs.length,
        previousRepairs: repairs
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  addServiceRequest(srData) {
    const newSR = {
      id: 'sr_' + Date.now(),
      applianceId: srData.applianceId,
      userId: 'user_1',
      complaint: srData.complaint,
      transcription: srData.transcription || srData.complaint,
      status: 'Pending',
      priority: srData.priority || 'Normal',
      isRecurring: Boolean(srData.isRecurring),
      previousOccurrenceDetails: srData.previousOccurrenceDetails || null,
      suggestedQuestions: srData.suggestedQuestions || [],
      technicianNotes: '',
      createdAt: new Date().toISOString(),
      isDemo: false
    };
    this.data.serviceRequests.push(newSR);
    this.save();
    return newSR;
  }

  updateServiceRequest(id, updates) {
    const idx = this.data.serviceRequests.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.data.serviceRequests[idx] = { ...this.data.serviceRequests[idx], ...updates };
    this.save();
    return this.data.serviceRequests[idx];
  }

  // Summary Metrics
  getMetrics() {
    const totalAppliances = this.data.appliances.length;
    const repairsRecorded = this.data.repairs.length;
    const activeWarranties = this.data.appliances.filter(a => {
      if (a.status === 'Active') return true;
      if (a.warrantyExpiryDate) {
        return new Date(a.warrantyExpiryDate) >= new Date();
      }
      return false;
    }).length;

    const totalSpent = this.data.repairs.reduce((sum, r) => sum + (Number(r.amountPaid) || 0), 0);
    const pendingRequests = this.data.serviceRequests.filter(s => s.status !== 'Completed').length;

    return {
      totalAppliances,
      repairsRecorded,
      activeWarranties,
      totalSpent,
      pendingRequests
    };
  }
}

module.exports = new DataStore();
