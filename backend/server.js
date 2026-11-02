const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const store = require('./store');
const sarvam = require('./sarvam');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static directory for file uploads
const uploadDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${basename}_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 25 * 1024 * 1024 } });

// ----------------------------------------------------
// Health & Diagnostics
// ----------------------------------------------------
app.get('/api/health', (req, res) => {
  const hasKey = Boolean(sarvam.getApiKey());
  res.json({
    status: 'ok',
    sarvamConfigured: hasKey,
    timestamp: new Date().toISOString()
  });
});

// ----------------------------------------------------
// Dashboard Metrics
// ----------------------------------------------------
app.get('/api/metrics', (req, res) => {
  const metrics = store.getMetrics();
  res.json(metrics);
});

// ----------------------------------------------------
// Appliances CRUD
// ----------------------------------------------------
app.get('/api/appliances', (req, res) => {
  const appliances = store.getAppliances();
  res.json(appliances);
});

app.get('/api/appliances/:id', (req, res) => {
  const appliance = store.getApplianceById(req.params.id);
  if (!appliance) {
    return res.status(404).json({ error: 'Appliance not found' });
  }
  res.json(appliance);
});

app.post('/api/appliances', (req, res) => {
  const { name, brand, modelNumber, purchaseDate, warrantyExpiryDate, serialNumber, category } = req.body;
  if (!name || !brand) {
    return res.status(400).json({ error: 'Appliance name and brand are required' });
  }
  const created = store.addAppliance({
    name,
    brand,
    modelNumber,
    purchaseDate,
    warrantyExpiryDate,
    serialNumber,
    category
  });
  res.status(201).json(created);
});

app.put('/api/appliances/:id', (req, res) => {
  const updated = store.updateAppliance(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Appliance not found' });
  }
  res.json(updated);
});

app.delete('/api/appliances/:id', (req, res) => {
  const success = store.deleteAppliance(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Appliance not found' });
  }
  res.json({ success: true, message: 'Appliance deleted' });
});

// ----------------------------------------------------
// Repairs CRUD
// ----------------------------------------------------
app.get('/api/repairs', (req, res) => {
  const applianceId = req.query.applianceId;
  const repairs = store.getRepairs(applianceId);
  res.json(repairs);
});

app.post('/api/appliances/:id/repairs', (req, res) => {
  const appliance = store.getApplianceById(req.params.id);
  if (!appliance) {
    return res.status(404).json({ error: 'Appliance not found' });
  }
  const { complaint, problemReported, repairDate, workPerformed, replacedParts, amountPaid, technicianName, technicianContact, notes } = req.body;
  const newRepair = store.addRepair({
    applianceId: req.params.id,
    complaint,
    problemReported,
    repairDate,
    workPerformed,
    replacedParts,
    amountPaid,
    technicianName,
    technicianContact,
    notes
  });
  res.status(201).json(newRepair);
});

// ----------------------------------------------------
// Documents & Uploads
// ----------------------------------------------------
app.get('/api/documents', (req, res) => {
  const applianceId = req.query.applianceId;
  const documents = store.getDocuments(applianceId);
  res.json(documents);
});

app.post('/api/appliances/:id/documents', upload.single('file'), (req, res) => {
  const appliance = store.getApplianceById(req.params.id);
  if (!appliance) {
    return res.status(404).json({ error: 'Appliance not found' });
  }

  let extractedData = {};
  if (req.body.extractedData) {
    try {
      extractedData = typeof req.body.extractedData === 'string' ? JSON.parse(req.body.extractedData) : req.body.extractedData;
    } catch (e) {
      console.warn('Could not parse extractedData JSON:', e.message);
    }
  }

  const fileUrl = req.file ? `/uploads/${req.file.filename}` : (req.body.fileUrl || '');
  const filename = req.file ? req.file.originalname : (req.body.filename || 'uploaded_document.pdf');

  const doc = store.addDocument({
    applianceId: req.params.id,
    documentType: req.body.documentType || 'Repair Bill',
    filename,
    fileUrl,
    extractedData
  });

  if (req.body.createRepairRecord === 'true' || req.body.createRepairRecord === true) {
    store.addRepair({
      applianceId: req.params.id,
      complaint: extractedData.replacedParts ? `Repair for ${extractedData.replacedParts}` : 'Service from uploaded bill',
      problemReported: extractedData.replacedParts || 'Documented repair',
      repairDate: extractedData.repairDate || new Date().toISOString().split('T')[0],
      workPerformed: `Service completed. Document: ${filename}`,
      replacedParts: extractedData.replacedParts || 'None',
      amountPaid: Number(extractedData.amountPaid) || 0,
      technicianName: extractedData.technicianName || 'Service Provider',
      notes: `Extracted from ${doc.documentType}`
    });
  }

  res.status(201).json(doc);
});

// ----------------------------------------------------
// Service Requests (Household & Technician View)
// ----------------------------------------------------
app.get('/api/service-requests', (req, res) => {
  const requests = store.getServiceRequests();
  res.json(requests);
});

app.post('/api/service-requests', (req, res) => {
  const { applianceId, complaint, transcription, isRecurring, previousOccurrenceDetails, suggestedQuestions, priority } = req.body;
  if (!applianceId || !complaint) {
    return res.status(400).json({ error: 'applianceId and complaint are required' });
  }
  const created = store.addServiceRequest({
    applianceId,
    complaint,
    transcription,
    isRecurring,
    previousOccurrenceDetails,
    suggestedQuestions,
    priority
  });
  res.status(201).json(created);
});

app.put('/api/service-requests/:id', (req, res) => {
  const { status, technicianNotes, replacedParts, workPerformed, amountCharged } = req.body;
  const updated = store.updateServiceRequest(req.params.id, {
    status,
    technicianNotes,
    completedAt: status === 'Completed' ? new Date().toISOString() : undefined
  });
  if (!updated) {
    return res.status(404).json({ error: 'Service request not found' });
  }

  if (status === 'Completed' && (workPerformed || replacedParts || amountCharged)) {
    store.addRepair({
      applianceId: updated.applianceId,
      complaint: updated.complaint,
      problemReported: updated.complaint,
      repairDate: new Date().toISOString().split('T')[0],
      workPerformed: workPerformed || 'Technician resolved reported complaint',
      replacedParts: replacedParts || 'None',
      amountPaid: Number(amountCharged) || 0,
      technicianName: 'FixSaathi Field Technician',
      notes: technicianNotes || 'Completed via service request portal'
    });
  }

  res.json(updated);
});

// ----------------------------------------------------
// Sarvam AI Integrations
// ----------------------------------------------------

// 1. Speech to Text (Saaras)
app.post('/api/sarvam/stt', upload.single('audio'), async (req, res) => {
  try {
    let audioBuffer;
    let filename = 'recording.wav';

    if (req.file) {
      audioBuffer = fs.readFileSync(req.file.path);
      filename = req.file.originalname;
    } else if (req.body.audioBase64) {
      audioBuffer = Buffer.from(req.body.audioBase64, 'base64');
    } else {
      return res.status(400).json({ error: 'Audio file or audioBase64 required' });
    }

    const languageCode = req.body.languageCode || 'unknown';
    const result = await sarvam.speechToText(audioBuffer, filename, languageCode);
    res.json(result);
  } catch (err) {
    console.error('STT API Error:', err.message);
    res.status(500).json({
      error: 'Sarvam Speech-to-Text error',
      message: err.message
    });
  }
});

// 2. Intelligent Complaint Analysis & History Comparison (Sarvam LLM)
app.post('/api/sarvam/analyze-complaint', async (req, res) => {
  try {
    const { complaint, applianceId } = req.body;
    if (!complaint) {
      return res.status(400).json({ error: 'complaint text is required' });
    }

    let appliance = null;
    let previousRepairs = [];
    if (applianceId) {
      appliance = store.getApplianceById(applianceId);
      if (appliance) {
        previousRepairs = appliance.repairs || [];
      }
    }

    const analysis = await sarvam.analyzeComplaintWithHistory(complaint, appliance, previousRepairs);
    res.json(analysis);
  } catch (err) {
    console.error('Analyze Complaint Error:', err.message);
    res.status(500).json({
      error: 'Sarvam Complaint Analysis error',
      message: err.message
    });
  }
});

// 3. Document OCR & Extraction
app.post('/api/sarvam/ocr-document', upload.single('file'), async (req, res) => {
  try {
    const fileInfo = {
      originalname: req.file ? req.file.originalname : (req.body.filename || 'document.pdf'),
      mimetype: req.file ? req.file.mimetype : 'application/pdf',
      textHint: req.body.textHint || ''
    };

    let applianceHint = null;
    if (req.body.applianceId) {
      applianceHint = store.getApplianceById(req.body.applianceId);
    }

    const extracted = await sarvam.extractDocumentData(fileInfo, applianceHint);
    
    if (req.file) {
      extracted.uploadedFileUrl = `/uploads/${req.file.filename}`;
      extracted.filename = req.file.originalname;
    }

    res.json(extracted);
  } catch (err) {
    console.error('OCR Document Error:', err.message);
    res.status(500).json({
      error: 'Sarvam Document Extraction error',
      message: err.message
    });
  }
});

// 4. Scan Appliance Picture (Camera / Nameplate / Rating Label)
app.post('/api/sarvam/scan-appliance', upload.single('image'), async (req, res) => {
  try {
    let fileInfo = {
      originalname: req.file ? req.file.originalname : 'camera_capture.jpg',
      mimetype: req.file ? req.file.mimetype : 'image/jpeg',
      textHint: req.body.textHint || ''
    };

    if (req.body.imageBase64 && !req.file) {
      const base64Data = req.body.imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `appliance_snap_${Date.now()}.jpg`;
      const filepath = path.join(uploadDir, filename);
      fs.writeFileSync(filepath, buffer);
      fileInfo.filepath = filepath;
      fileInfo.fileUrl = `/uploads/${filename}`;
    } else if (req.file) {
      fileInfo.fileUrl = `/uploads/${req.file.filename}`;
    }

    const extracted = await sarvam.scanAppliancePhoto(fileInfo);
    if (fileInfo.fileUrl) {
      extracted.imageUrl = fileInfo.fileUrl;
    }
    res.json(extracted);
  } catch (err) {
    console.error('Scan appliance photo error:', err.message);
    res.status(500).json({
      error: 'Sarvam Appliance Scan error',
      message: err.message
    });
  }
});

// 5. Text to Speech (Bulbul)
app.post('/api/sarvam/tts', async (req, res) => {
  try {
    const { text, targetLanguageCode, speaker } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'text is required' });
    }

    const result = await sarvam.textToSpeech(text, {
      target_language_code: targetLanguageCode || 'hi-IN',
      speaker: speaker || 'ritu'
    });

    res.json(result);
  } catch (err) {
    console.error('TTS API Error:', err.message);
    res.status(500).json({
      error: 'Sarvam Text-to-Speech error',
      message: err.message
    });
  }
});

// 6. Translation (Mayura)
app.post('/api/sarvam/translate', async (req, res) => {
  try {
    const { text, sourceLanguageCode, targetLanguageCode } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'text is required' });
    }

    const translated = await sarvam.translateText(
      text,
      sourceLanguageCode || 'en-IN',
      targetLanguageCode || 'hi-IN'
    );

    res.json({ translatedText: translated });
  } catch (err) {
    console.error('Translate API Error:', err.message);
    res.status(500).json({
      error: 'Sarvam Translation error',
      message: err.message
    });
  }
});

// ----------------------------------------------------
// Complete Repair Dossier Report
// ----------------------------------------------------
app.get('/api/reports/:applianceId', (req, res) => {
  const appliance = store.getApplianceById(req.params.applianceId);
  if (!appliance) {
    return res.status(404).json({ error: 'Appliance not found' });
  }

  const recurringIssues = appliance.repairs.filter((r, idx, arr) => 
    arr.some((other, oIdx) => oIdx !== idx && (
      (r.problemReported || '').toLowerCase().includes('drain') ||
      (r.replacedParts || '').toLowerCase().includes('pump')
    ))
  );

  const report = {
    title: `FixSaathi Official Repair History Dossier – ${appliance.brand} ${appliance.name}`,
    generatedAt: new Date().toISOString(),
    appliance: {
      name: appliance.name,
      brand: appliance.brand,
      modelNumber: appliance.modelNumber,
      purchaseDate: appliance.purchaseDate,
      warrantyStatus: appliance.status,
      warrantyExpiryDate: appliance.warrantyExpiryDate,
      serialNumber: appliance.serialNumber
    },
    totalRecordedExpenditure: appliance.totalSpent,
    totalRepairsCount: appliance.repairCount,
    hasRecurringIssues: recurringIssues.length > 0,
    recurringIssuesSummary: recurringIssues.length > 0 
      ? 'Recurring water drainage / pump failure recorded across multiple services.'
      : 'No critical recurring faults detected.',
    repairTimeline: appliance.repairs,
    associatedDocuments: appliance.documents,
    activeServiceRequests: appliance.serviceRequests
  };

  res.json(report);
});

// ----------------------------------------------------
// Reset Demo Data
// ----------------------------------------------------
app.post('/api/demo/reset', (req, res) => {
  store.resetDemo();
  res.json({ success: true, message: 'Demo scenario reset to initial state' });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`FixSaathi Backend running on http://localhost:${PORT}`);
});
