// FixSaathi API client

export async function fetchHealth() {
  const res = await fetch('/api/health');
  return res.json();
}

export async function fetchMetrics() {
  const res = await fetch('/api/metrics');
  return res.json();
}

export async function fetchAppliances() {
  const res = await fetch('/api/appliances');
  return res.json();
}

export async function fetchApplianceById(id) {
  const res = await fetch(`/api/appliances/${id}`);
  if (!res.ok) throw new Error('Appliance not found');
  return res.json();
}

export async function createAppliance(data) {
  const res = await fetch('/api/appliances', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create appliance');
  return res.json();
}

export async function updateAppliance(id, data) {
  const res = await fetch(`/api/appliances/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteAppliance(id) {
  const res = await fetch(`/api/appliances/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function fetchRepairs(applianceId = null) {
  const url = applianceId ? `/api/repairs?applianceId=${applianceId}` : '/api/repairs';
  const res = await fetch(url);
  return res.json();
}

export async function createRepair(applianceId, data) {
  const res = await fetch(`/api/appliances/${applianceId}/repairs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function fetchDocuments(applianceId = null) {
  const url = applianceId ? `/api/documents?applianceId=${applianceId}` : '/api/documents';
  const res = await fetch(url);
  return res.json();
}

export async function uploadDocument(applianceId, formData) {
  const res = await fetch(`/api/appliances/${applianceId}/documents`, {
    method: 'POST',
    body: formData
  });
  return res.json();
}

export async function fetchServiceRequests() {
  const res = await fetch('/api/service-requests');
  return res.json();
}

export async function createServiceRequest(data) {
  const res = await fetch('/api/service-requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateServiceRequest(id, data) {
  const res = await fetch(`/api/service-requests/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

// Sarvam AI calls
export async function sarvamSpeechToText(formData) {
  const res = await fetch('/api/sarvam/stt', {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Speech-to-Text failed');
  }
  return res.json();
}

export async function sarvamAnalyzeComplaint(complaint, applianceId = null) {
  const res = await fetch('/api/sarvam/analyze-complaint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ complaint, applianceId })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Complaint analysis failed');
  }
  return res.json();
}

export async function sarvamOcrDocument(formData) {
  const res = await fetch('/api/sarvam/ocr-document', {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Document OCR failed');
  }
  return res.json();
}

export async function sarvamScanAppliance(formData) {
  const res = await fetch('/api/sarvam/scan-appliance', {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Appliance scanning failed');
  }
  return res.json();
}

export async function sarvamTextToSpeech(text, targetLanguageCode = 'hi-IN', speaker = 'ritu') {
  const res = await fetch('/api/sarvam/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, targetLanguageCode, speaker })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Text-to-Speech failed');
  }
  return res.json();
}

export async function sarvamTranslate(text, targetLanguageCode = 'hi-IN', sourceLanguageCode = 'en-IN') {
  const res = await fetch('/api/sarvam/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, targetLanguageCode, sourceLanguageCode })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Translation failed');
  }
  return res.json();
}

export async function fetchReport(applianceId) {
  const res = await fetch(`/api/reports/${applianceId}`);
  return res.json();
}

export async function resetDemoData() {
  const res = await fetch('/api/demo/reset', { method: 'POST' });
  return res.json();
}
