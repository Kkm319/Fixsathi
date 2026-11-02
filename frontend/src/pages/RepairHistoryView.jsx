import React, { useState } from 'react';
import { Clock, Search, Wrench, ArrowUpRight, Filter } from 'lucide-react';

export default function RepairHistoryView({ repairs, onSelectAppliance }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = repairs?.filter(r => 
    `${r.problemReported || r.complaint} ${r.applianceName || ''} ${r.workPerformed || ''} ${r.technicianName || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalSpent = filtered?.reduce((sum, r) => sum + (Number(r.amountPaid) || 0), 0) || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
            Household Repair History
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Complete chronological record of all maintenance work, replaced components, and fees.
          </p>
        </div>

        <div className="text-right self-start sm:self-auto">
          <span className="text-[11px] text-zinc-400 block">Total Expenditure</span>
          <span className="text-base font-bold text-teal-700">₹{totalSpent.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search by part, problem, or appliance..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-zinc-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600"
        />
      </div>

      {/* List */}
      <div className="border border-zinc-200/80 rounded-xl bg-white overflow-hidden shadow-xs divide-y divide-zinc-100">
        {filtered?.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-400">
            No repair records matching search criteria.
          </div>
        ) : (
          filtered?.map((repair) => (
            <div
              key={repair.id}
              onClick={() => onSelectAppliance(repair.applianceId)}
              className="p-4 hover:bg-zinc-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer gap-4 group"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-900 group-hover:text-teal-700 transition-colors">
                    {repair.problemReported || repair.complaint}
                  </span>
                  <span className="text-[11px] text-zinc-500 font-medium px-2 py-0.5 rounded-md bg-zinc-100">
                    {repair.applianceName}
                  </span>
                </div>

                <p className="text-xs text-zinc-600">
                  <strong className="text-zinc-700">Work:</strong> {repair.workPerformed}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400 pt-1">
                  <span>Parts: {repair.replacedParts || 'None'}</span>
                  <span>•</span>
                  <span>Technician: {repair.technicianName}</span>
                  {repair.technicianContact && <span>({repair.technicianContact})</span>}
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-100">
                <span className="text-xs font-bold text-zinc-900">
                  ₹{repair.amountPaid?.toLocaleString('en-IN') || 0}
                </span>
                <p className="text-[11px] text-zinc-400 mt-0.5">{repair.repairDate}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
