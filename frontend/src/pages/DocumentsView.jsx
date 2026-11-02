import React, { useState } from 'react';
import { FileText, Search, Upload, ArrowUpRight, ShieldCheck, Tag } from 'lucide-react';

export default function DocumentsView({ documents, appliances, onSelectAppliance, onOpenUploadModal }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = documents?.filter(d => 
    `${d.filename} ${d.documentType} ${d.applianceName || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
            Document Repository
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Bills, service invoices, receipts, and warranty cards verified by Sarvam AI.
          </p>
        </div>

        <button
          onClick={() => onOpenUploadModal(appliances?.[0])}
          className="px-4 py-2 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search documents by name or appliance..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-zinc-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered?.length === 0 ? (
          <div className="col-span-full p-12 border border-dashed border-zinc-200 rounded-xl bg-white text-center text-xs text-zinc-400">
            No documents found. Upload a receipt or warranty card to get started.
          </div>
        ) : (
          filtered?.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectAppliance(doc.applianceId)}
              className="p-4 rounded-xl border border-zinc-200/80 bg-white hover:border-zinc-300 transition-all cursor-pointer shadow-xs hover:shadow-sm space-y-3 flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                    {doc.documentType}
                  </span>
                </div>

                <div className="truncate">
                  <h4 className="text-xs font-semibold text-zinc-900 truncate group-hover:text-teal-700 transition-colors">
                    {doc.filename}
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    {doc.applianceName}
                  </p>
                </div>

                {doc.extractedData?.replacedParts && (
                  <p className="text-[11px] text-zinc-600 bg-zinc-50 p-2 rounded-md border border-zinc-100">
                    <strong className="text-zinc-700">Parts:</strong> {doc.extractedData.replacedParts}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
                <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                <span className="text-teal-700 font-medium group-hover:underline flex items-center gap-0.5">
                  View Appliance →
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
