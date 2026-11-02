import React from 'react';
import { Plus, Tv, ArrowRight, Clock, ShieldCheck, AlertCircle, Wrench } from 'lucide-react';

export default function DashboardView({ 
  metrics, 
  appliances, 
  repairs, 
  onSelectAppliance, 
  onOpenAddModal, 
  onNavigateToVoice 
}) {
  const getWarrantyBadge = (status) => {
    switch (status) {
      case 'Active':
        return (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60">
            Active
          </span>
        );
      case 'Expired':
        return (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
            Expired
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Top Greeting & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Good morning!
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Here is the status of your household appliances and repair history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToVoice}
            className="px-3.5 py-2 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100/80 border border-teal-200/60 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>Speak Complaint</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Appliance</span>
          </button>
        </div>
      </div>

      {/* Three Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-zinc-200/80 bg-white shadow-xs">
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
            Total Appliances
          </span>
          <p className="text-2xl font-bold text-zinc-900 mt-1">
            {metrics?.totalAppliances || appliances?.length || 0}
          </p>
          <p className="text-[11px] text-zinc-400 mt-1">Registered in household</p>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200/80 bg-white shadow-xs">
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
            Repairs Recorded
          </span>
          <p className="text-2xl font-bold text-zinc-900 mt-1">
            {metrics?.repairsRecorded || repairs?.length || 0}
          </p>
          <p className="text-[11px] text-zinc-400 mt-1">Chronological service entries</p>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200/80 bg-white shadow-xs">
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
            Active Warranties
          </span>
          <p className="text-2xl font-bold text-teal-700 mt-1">
            {metrics?.activeWarranties || 0}
          </p>
          <p className="text-[11px] text-zinc-400 mt-1">Covered under manufacturer terms</p>
        </div>
      </div>

      {/* My Appliances Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">
            My Appliances
          </h3>
          <span className="text-xs text-zinc-500">
            {appliances?.length} appliances
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {appliances?.map((app) => (
            <div
              key={app.id}
              onClick={() => onSelectAppliance(app.id)}
              className="p-4 rounded-xl border border-zinc-200/80 bg-white hover:border-zinc-300 transition-all cursor-pointer shadow-xs hover:shadow-sm space-y-3 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200/60 flex items-center justify-center text-zinc-700 font-semibold text-xs group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors">
                    {app.brand?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-900 group-hover:text-teal-700 transition-colors">
                      {app.brand} {app.name}
                    </h4>
                    <p className="text-xs text-zinc-500">
                      Model: {app.modelNumber || 'Standard'}
                    </p>
                  </div>
                </div>
                {getWarrantyBadge(app.status)}
              </div>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                <span>Purchased: {app.purchaseDate || 'Unknown'}</span>
                <span className="font-medium text-zinc-700">
                  {app.repairCount || 0} {app.repairCount === 1 ? 'repair' : 'repairs'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Repairs Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">
            Recent Repairs
          </h3>
          <span className="text-xs text-zinc-400">Chronological activity</span>
        </div>

        <div className="border border-zinc-200/80 rounded-xl bg-white overflow-hidden shadow-xs divide-y divide-zinc-100">
          {repairs?.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-400">
              No repairs recorded yet.
            </div>
          ) : (
            repairs?.slice(0, 5).map((repair) => (
              <div
                key={repair.id}
                onClick={() => onSelectAppliance(repair.applianceId)}
                className="p-3.5 hover:bg-zinc-50/70 transition-colors flex items-center justify-between cursor-pointer gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-zinc-900 truncate">
                      {repair.problemReported || repair.complaint}
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate">
                      {repair.applianceName || 'Appliance'} • {repair.workPerformed}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-semibold text-zinc-900">
                    ₹{repair.amountPaid?.toLocaleString('en-IN') || 0}
                  </span>
                  <p className="text-[10px] text-zinc-400">{repair.repairDate}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
