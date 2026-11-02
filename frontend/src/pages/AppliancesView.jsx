import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, ArrowUpRight, Wrench, ShieldCheck } from 'lucide-react';
import { deleteAppliance } from '../api';

export default function AppliancesView({ 
  appliances, 
  onSelectAppliance, 
  onOpenAddModal, 
  onEditAppliance, 
  onRefresh 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = appliances?.filter(a => 
    `${a.brand} ${a.name} ${a.modelNumber || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (e, id, name) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${name}? All associated repair history will be removed.`)) {
      try {
        await deleteAppliance(id);
        onRefresh();
      } catch (err) {
        alert(err.message || 'Failed to delete appliance');
      }
    }
  };

  const handleEdit = (e, app) => {
    e.stopPropagation();
    onEditAppliance(app);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
            Registered Appliances
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage your home devices, warranty validity, and repair records.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-4 py-2 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Appliance</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search by brand, name or model..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-zinc-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition-all"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered?.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 rounded-xl bg-white">
            No appliances matching your search.
          </div>
        ) : (
          filtered?.map((app) => (
            <div
              key={app.id}
              onClick={() => onSelectAppliance(app.id)}
              className="p-4 rounded-xl border border-zinc-200/80 bg-white hover:border-zinc-300 transition-all cursor-pointer shadow-xs hover:shadow-sm flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center">
                      {app.brand?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-900 group-hover:text-teal-700 transition-colors">
                        {app.brand} {app.name}
                      </h4>
                      <p className="text-[11px] text-zinc-500">
                        {app.modelNumber || 'Standard Model'}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    app.status === 'Active'
                      ? 'bg-teal-50 text-teal-700 border border-teal-200/60'
                      : 'bg-zinc-100 text-zinc-600'
                  }`}>
                    {app.status}
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-zinc-600">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Purchased:</span>
                    <span className="font-medium text-zinc-700">{app.purchaseDate || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Warranty Until:</span>
                    <span className="font-medium text-zinc-700">{app.warrantyExpiryDate || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Total Repairs:</span>
                    <span className="font-semibold text-zinc-800">{app.repairCount || 0}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleEdit(e, app)}
                    className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-md hover:bg-zinc-100 transition-colors"
                    title="Edit Appliance"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, app.id, `${app.brand} ${app.name}`)}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                    title="Delete Appliance"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onSelectAppliance(app.id)}
                  className="text-xs font-medium text-teal-700 hover:text-teal-800 flex items-center gap-1 group-hover:underline"
                >
                  <span>View Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
