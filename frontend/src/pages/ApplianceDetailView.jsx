import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Mic, 
  Plus, 
  FileText, 
  Wrench, 
  Calendar, 
  AlertTriangle, 
  ShieldCheck, 
  FileCheck, 
  Printer,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { fetchApplianceById } from '../api';

export default function ApplianceDetailView({ 
  applianceId, 
  onBack, 
  onOpenUploadDoc, 
  onOpenReportComplaint, 
  onOpenAddRepair,
  onOpenReportModal 
}) {
  const [appliance, setAppliance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = () => {
    setLoading(true);
    fetchApplianceById(applianceId)
      .then(data => setAppliance(data))
      .catch(err => setError(err.message || 'Failed to load appliance details'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [applianceId]);

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-zinc-400">
        Loading appliance details...
      </div>
    );
  }

  if (error || !appliance) {
    return (
      <div className="p-6 text-center text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl">
        {error || 'Appliance not found'}
        <div className="mt-3">
          <button onClick={onBack} className="text-zinc-600 hover:underline">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Detect recurring problems in repair history
  // E.g. If problem mentioned drain pump, water, cooling multiple times
  const repairs = appliance.repairs || [];
  const recurringDrain = repairs.filter(r => 
    (r.problemReported || r.complaint || '').toLowerCase().includes('drain') ||
    (r.workPerformed || '').toLowerCase().includes('drain')
  );
  const showRecurringWarning = recurringDrain.length > 1 || appliance.hasRecurringIssue;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-medium text-zinc-500 hover:text-zinc-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Appliances</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenReportModal(appliance.id)}
            className="px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Generate Report</span>
          </button>

          <button
            onClick={() => onOpenUploadDoc(appliance)}
            className="px-3.5 py-1.5 text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Repair Bill</span>
          </button>

          <button
            onClick={() => onOpenReportComplaint(appliance)}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Report a Problem</span>
          </button>
        </div>
      </div>

      {/* Appliance Header Card */}
      <div className="p-6 rounded-xl border border-zinc-200/80 bg-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                {appliance.brand} {appliance.name}
              </h2>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                appliance.status === 'Active'
                  ? 'bg-teal-50 text-teal-700 border border-teal-200/60'
                  : 'bg-zinc-100 text-zinc-600'
              }`}>
                Warranty {appliance.status}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Model: {appliance.modelNumber || 'Standard'} • Serial: {appliance.serialNumber || 'N/A'}
            </p>
          </div>

          <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-zinc-100 pt-3 sm:pt-0 sm:pl-6 text-xs">
            <div>
              <span className="text-zinc-400 block text-[11px]">Total Repairs</span>
              <span className="text-base font-bold text-zinc-900">{appliance.repairCount || 0}</span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[11px]">Total Spent</span>
              <span className="text-base font-bold text-teal-700">₹{appliance.totalSpent?.toLocaleString('en-IN') || 0}</span>
            </div>
          </div>
        </div>

        {/* Dates Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-3 border-t border-zinc-100">
          <div>
            <span className="text-zinc-400 block">Purchase Date</span>
            <span className="font-medium text-zinc-800">{appliance.purchaseDate || 'Not specified'}</span>
          </div>
          <div>
            <span className="text-zinc-400 block">Warranty Expiry</span>
            <span className="font-medium text-zinc-800">{appliance.warrantyExpiryDate || 'Unknown'}</span>
          </div>
          <div>
            <span className="text-zinc-400 block">Category</span>
            <span className="font-medium text-zinc-800">{appliance.category || 'General'}</span>
          </div>
        </div>
      </div>

      {/* Subtle Recurring Issue Alert */}
      {showRecurringWarning && (
        <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900 shadow-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-amber-950">
              Similar issue reported previously.
            </p>
            <p className="text-amber-800/90 leading-relaxed">
              Records indicate a recurring issue (such as water drainage or pump replacement on 15 September 2026). When contacting a technician, be sure to request verification of previous parts and warranty.
            </p>
          </div>
        </div>
      )}

      {/* Repair Timeline Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">
              Repair History Timeline
            </h3>
            <p className="text-xs text-zinc-500">
              Chronological log of maintenance, replaced components and service fees.
            </p>
          </div>

          <button
            onClick={() => onOpenAddRepair(appliance)}
            className="text-xs text-teal-700 hover:text-teal-800 font-medium flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Manual Entry</span>
          </button>
        </div>

        {repairs.length === 0 ? (
          <div className="p-8 border border-dashed border-zinc-200 rounded-xl bg-white text-center text-xs text-zinc-400">
            No repairs recorded yet. Upload a bill or record an issue.
          </div>
        ) : (
          <div className="space-y-3">
            {repairs.map((repair, idx) => (
              <div
                key={repair.id || idx}
                className="p-4 rounded-xl border border-zinc-200/80 bg-white shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-teal-600"></div>
                    <h4 className="text-xs font-semibold text-zinc-900">
                      {repair.problemReported || repair.complaint}
                    </h4>
                  </div>
                  <span className="text-xs font-semibold text-zinc-900">
                    ₹{repair.amountPaid?.toLocaleString('en-IN') || 0}
                  </span>
                </div>

                <p className="text-xs text-zinc-600 pl-4">
                  <strong className="text-zinc-700">Work Performed:</strong> {repair.workPerformed}
                </p>

                <div className="pl-4 pt-2 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-500">
                  <span>
                    <strong className="text-zinc-600">Parts Replaced:</strong> {repair.replacedParts || 'None'}
                  </span>
                  <span>
                    <strong className="text-zinc-600">Technician:</strong> {repair.technicianName || 'N/A'}
                  </span>
                  <span className="text-zinc-400">
                    {repair.repairDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Uploaded Documents Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">
            Uploaded Documents ({appliance.documents?.length || 0})
          </h3>
          <button
            onClick={() => onOpenUploadDoc(appliance)}
            className="text-xs text-teal-700 hover:text-teal-800 font-medium flex items-center gap-1"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New</span>
          </button>
        </div>

        {appliance.documents?.length === 0 ? (
          <div className="p-6 border border-dashed border-zinc-200 rounded-xl bg-white text-center text-xs text-zinc-400">
            No bills or warranty documents uploaded for this appliance.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {appliance.documents?.map((doc) => (
              <div
                key={doc.id}
                className="p-3 rounded-lg border border-zinc-200/80 bg-white flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-7 h-7 rounded-md bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="font-medium text-zinc-800 truncate">{doc.filename}</p>
                    <p className="text-[11px] text-zinc-400">{doc.documentType}</p>
                  </div>
                </div>

                <span className="text-[11px] font-medium text-teal-700 shrink-0">
                  Verified
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
