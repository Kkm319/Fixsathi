import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Filter, 
  FileText, 
  Send,
  Loader2,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { fetchServiceRequests, updateServiceRequest } from '../api';

export default function TechnicianView({ onRefresh }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Form for technician update
  const [status, setStatus] = useState('In Progress');
  const [technicianNotes, setTechnicianNotes] = useState('');
  const [replacedParts, setReplacedParts] = useState('');
  const [workPerformed, setWorkPerformed] = useState('');
  const [amountCharged, setAmountCharged] = useState('');
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const loadRequests = () => {
    setLoading(true);
    fetchServiceRequests()
      .then(data => {
        setRequests(data);
        if (data.length > 0 && !selectedRequest) {
          setSelectedRequest(data[0]);
          setStatus(data[0].status);
          setTechnicianNotes(data[0].technicianNotes || '');
        }
      })
      .catch(err => console.error('Failed to load service requests:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleSelect = (req) => {
    setSelectedRequest(req);
    setStatus(req.status);
    setTechnicianNotes(req.technicianNotes || '');
    setSuccessMessage('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    setUpdating(true);
    setSuccessMessage('');

    try {
      await updateServiceRequest(selectedRequest.id, {
        status,
        technicianNotes,
        replacedParts,
        workPerformed,
        amountCharged: Number(amountCharged) || 0
      });

      setSuccessMessage('Service status and repair details updated successfully!');
      loadRequests();
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to update request');
    } finally {
      setUpdating(false);
    }
  };

  const filtered = requests.filter(r => {
    if (statusFilter === 'All') return true;
    return r.status === statusFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900">
              Technician Field Service Portal
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              Technician View
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Review incoming household complaints, past repair history, and log service resolutions.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg text-xs self-start sm:self-auto">
          {['All', 'Pending', 'In Progress', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                statusFilter === tab
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Request List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Assigned Service Requests ({filtered.length})
          </h3>

          {loading ? (
            <div className="p-8 text-center text-xs text-zinc-400">Loading requests...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 border border-dashed border-zinc-200 rounded-xl bg-white text-center text-xs text-zinc-400">
              No service requests matching status: {statusFilter}
            </div>
          ) : (
            <div className="space-y-2.5">
              {filtered.map((req) => {
                const isSelected = selectedRequest?.id === req.id;
                return (
                  <div
                    key={req.id}
                    onClick={() => handleSelect(req)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-left shadow-xs space-y-2 ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/20 ring-1 ring-teal-500/20'
                        : 'border-zinc-200/80 bg-white hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-zinc-900">
                        {req.appliance?.brand} {req.appliance?.name}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        req.status === 'Completed'
                          ? 'bg-teal-50 text-teal-700 border border-teal-200'
                          : req.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-700 line-clamp-2 leading-relaxed">
                      "{req.complaint}"
                    </p>

                    {req.isRecurring && (
                      <div className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Recurring problem flag</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
                      <span>{req.repairHistoryCount || 0} past repairs on record</span>
                      <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Selected Request Detail & Update Form */}
        <div className="lg:col-span-7 space-y-4">
          {selectedRequest ? (
            <div className="p-6 rounded-xl border border-zinc-200/80 bg-white shadow-xs space-y-5">
              {/* Request Header */}
              <div className="border-b border-zinc-100 pb-4 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-zinc-900">
                    Service Job: {selectedRequest.appliance?.brand} {selectedRequest.appliance?.name}
                  </h3>
                  <span className="text-xs text-zinc-500 font-mono">
                    ID: {selectedRequest.id}
                  </span>
                </div>
                <p className="text-xs text-zinc-500">
                  Model: {selectedRequest.appliance?.modelNumber || 'Standard'} • Serial: {selectedRequest.appliance?.serialNumber || 'N/A'}
                </p>
              </div>

              {/* Reported Complaint */}
              <div className="space-y-1.5 bg-zinc-50 p-3.5 rounded-lg border border-zinc-100 text-xs">
                <span className="font-semibold text-zinc-800 block">Reported Household Complaint:</span>
                <p className="text-zinc-700 leading-relaxed italic">
                  "{selectedRequest.complaint}"
                </p>
                {selectedRequest.transcription && selectedRequest.transcription !== selectedRequest.complaint && (
                  <p className="text-[11px] text-zinc-500 pt-1 border-t border-zinc-200/60 mt-1">
                    Voice Transcription: {selectedRequest.transcription}
                  </p>
                )}
              </div>

              {/* Previous Repair Dossier for Technician */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>Previous Repair Records ({selectedRequest.previousRepairs?.length || 0})</span>
                </h4>

                {selectedRequest.previousRepairs?.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic">No previous repairs recorded.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedRequest.previousRepairs?.map((prev, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-zinc-200/80 bg-white text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-zinc-900">{prev.problemReported || prev.complaint}</span>
                          <span className="text-[11px] text-zinc-500">{prev.repairDate}</span>
                        </div>
                        <p className="text-zinc-600">
                          <strong>Work:</strong> {prev.workPerformed}
                        </p>
                        <div className="flex justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-100">
                          <span>Replaced: {prev.replacedParts || 'None'}</span>
                          <span>Tech: {prev.technicianName}</span>
                          <span className="font-semibold text-zinc-800">₹{prev.amountPaid}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Suggested Questions Household May Ask */}
              {selectedRequest.suggestedQuestions?.length > 0 && (
                <div className="p-3 bg-teal-50/50 border border-teal-100 rounded-lg space-y-1.5 text-xs text-teal-900">
                  <span className="font-semibold block">Customer Diagnostic Inquiries:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-teal-800/90 text-[11px]">
                    {selectedRequest.suggestedQuestions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technician Update Form */}
              <form onSubmit={handleUpdate} className="pt-3 border-t border-zinc-100 space-y-3.5">
                <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                  Update Service Status & Record Resolution
                </h4>

                {successMessage && (
                  <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      Status *
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      Amount Charged (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 1200"
                      value={amountCharged}
                      onChange={(e) => setAmountCharged(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Replaced Parts (if any)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Drain pump impeller cleaned / new motor belt installed"
                    value={replacedParts}
                    onChange={(e) => setReplacedParts(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Work Performed / Diagnosis Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Cleared foreign object obstruction in drain filter and tested 3 spin cycles successfully."
                    value={workPerformed}
                    onChange={(e) => setWorkPerformed(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-zinc-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Updating Service...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Save Technician Record
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-12 border border-dashed border-zinc-200 rounded-xl bg-white text-center text-xs text-zinc-400">
              Select a service request from the list to view appliance history and log repair actions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
