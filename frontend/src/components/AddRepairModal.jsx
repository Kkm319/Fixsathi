import React, { useState } from 'react';
import { X, Wrench } from 'lucide-react';
import { createRepair } from '../api';

export default function AddRepairModal({ isOpen, onClose, appliance, onSaved }) {
  const [formData, setFormData] = useState({
    problemReported: '',
    repairDate: new Date().toISOString().split('T')[0],
    workPerformed: '',
    replacedParts: '',
    amountPaid: '',
    technicianName: '',
    technicianContact: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.problemReported.trim()) {
      setError('Problem description is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createRepair(appliance.id, {
        ...formData,
        amountPaid: Number(formData.amountPaid) || 0
      });
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to record repair');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-zinc-200 shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-zinc-900">
              Record Appliance Repair
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              For {appliance?.brand} {appliance?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 p-1 rounded-md hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Problem Reported *
            </label>
            <input
              type="text"
              placeholder="e.g. Water not draining / abnormal noise"
              value={formData.problemReported}
              onChange={(e) => setFormData({ ...formData, problemReported: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Repair Date
              </label>
              <input
                type="date"
                value={formData.repairDate}
                onChange={(e) => setFormData({ ...formData, repairDate: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Amount Paid (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 1200"
                value={formData.amountPaid}
                onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Work Performed
            </label>
            <input
              type="text"
              placeholder="e.g. Drain pump replaced and outlet valve cleaned"
              value={formData.workPerformed}
              onChange={(e) => setFormData({ ...formData, workPerformed: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Replaced Parts
            </label>
            <input
              type="text"
              placeholder="e.g. Drain Pump Assembly (DC31-00181A)"
              value={formData.replacedParts}
              onChange={(e) => setFormData({ ...formData, replacedParts: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Technician Name / Agency
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar (Samsung Care)"
                value={formData.technicianName}
                onChange={(e) => setFormData({ ...formData, technicianName: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Technician Phone
              </label>
              <input
                type="text"
                placeholder="e.g. +91 98450 11223"
                value={formData.technicianContact}
                onChange={(e) => setFormData({ ...formData, technicianContact: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Wrench className="w-3.5 h-3.5" />
              {loading ? 'Saving...' : 'Record Repair'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
