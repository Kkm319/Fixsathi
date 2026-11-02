import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, AlertCircle } from 'lucide-react';
import { createAppliance, updateAppliance } from '../api';

export default function AddApplianceModal({ isOpen, onClose, onSaved, initialData = null }) {
  const isEditing = Boolean(initialData);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    brand: initialData?.brand || '',
    modelNumber: initialData?.modelNumber || '',
    purchaseDate: initialData?.purchaseDate || new Date().toISOString().split('T')[0],
    warrantyExpiryDate: initialData?.warrantyExpiryDate || '',
    serialNumber: initialData?.serialNumber || '',
    category: initialData?.category || 'General'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        brand: initialData.brand || '',
        modelNumber: initialData.modelNumber || '',
        purchaseDate: initialData.purchaseDate || new Date().toISOString().split('T')[0],
        warrantyExpiryDate: initialData.warrantyExpiryDate || '',
        serialNumber: initialData.serialNumber || '',
        category: initialData.category || 'General'
      });
    } else {
      setFormData({
        name: '',
        brand: '',
        modelNumber: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        warrantyExpiryDate: '',
        serialNumber: '',
        category: 'General'
      });
    }
    setError('');
  }, [isOpen, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.brand.trim()) {
      setError('Appliance name and brand are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (isEditing) {
        await updateAppliance(initialData.id, formData);
      } else {
        await createAppliance(formData);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save appliance');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-zinc-200 shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-semibold text-zinc-900">
              {isEditing ? 'Edit Appliance' : 'Add New Appliance'}
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">Enter appliance details.</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 p-1 rounded-md hover:bg-zinc-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <form id="appliance-form" onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Appliance Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Washing Machine"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Brand *</label>
                <input
                  type="text"
                  placeholder="e.g. Samsung, LG, IFB"
                  value={formData.brand}
                  onChange={e => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition-all"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Model Number</label>
                <input
                  type="text"
                  placeholder="e.g. WW80T504DAX"
                  value={formData.modelNumber}
                  onChange={e => setFormData({ ...formData, modelNumber: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition-all"
                >
                  <option value="Laundry">Laundry</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Cooling">Cooling / AC</option>
                  <option value="Water Purifier">Water Purifier</option>
                  <option value="Living Room">Living Room</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Purchase Date</label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={e => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Warranty Expiry Date</label>
                <input
                  type="date"
                  value={formData.warrantyExpiryDate}
                  onChange={e => setFormData({ ...formData, warrantyExpiryDate: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Serial Number</label>
              <input
                type="text"
                placeholder="e.g. SM-WM-8829104"
                value={formData.serialNumber}
                onChange={e => setFormData({ ...formData, serialNumber: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition-all"
              />
            </div>
          </form>
        </div>
        <div className="px-6 py-3.5 border-t border-zinc-100 flex items-center justify-end gap-2 bg-zinc-50/50 shrink-0">
          <button type="button" onClick={onClose} className="px-3.5 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg transition-colors">
            Cancel
          </button>
          <button type="submit" form="appliance-form" disabled={loading} className="px-4 py-1.5 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50">
            {loading ? <>Saving...</> : <><ShieldCheck className="w-3.5 h-3.5" />{isEditing ? 'Update Appliance' : 'Save Appliance'}</>}
          </button>
        </div>
      </div>
    </div>
  );
}
