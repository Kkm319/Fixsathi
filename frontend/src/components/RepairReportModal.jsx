import React, { useState, useEffect } from 'react';
import { X, Printer, Volume2, Globe, Loader2, AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { fetchReport, sarvamTextToSpeech, sarvamTranslate } from '../api';

export default function RepairReportModal({ isOpen, onClose, applianceId }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [targetLang, setTargetLang] = useState('hi-IN');
  const [translatedText, setTranslatedText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !applianceId) return;
    setLoading(true);
    setTranslatedText('');
    setAudioUrl('');
    setError('');

    fetchReport(applianceId)
      .then(data => setReport(data))
      .catch(err => setError(err.message || 'Failed to load report'))
      .finally(() => setLoading(false));
  }, [isOpen, applianceId]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleTranslate = async (langCode) => {
    if (!report) return;
    setTargetLang(langCode);
    if (langCode === 'en-IN') {
      setTranslatedText('');
      return;
    }

    setTranslating(true);
    setError('');

    const textToTranslate = `Appliance: ${report.appliance.brand} ${report.appliance.name}. Total repairs recorded: ${report.totalRepairsCount}. Total spent: ₹${report.totalRecordedExpenditure}. Recurring Issue: ${report.recurringIssuesSummary}`;

    try {
      const res = await sarvamTranslate(textToTranslate, langCode, 'en-IN');
      setTranslatedText(res.translatedText || '');
    } catch (err) {
      setError(err.message || 'Translation failed');
    } finally {
      setTranslating(false);
    }
  };

  const handleSpeak = async () => {
    if (!report) return;
    setSpeaking(true);
    setError('');

    const textToSpeak = translatedText || 
      `यह ${report.appliance.brand} ${report.appliance.name} की मरम्मत रिपोर्ट है। कुल मरम्मत: ${report.totalRepairsCount}। कुल खर्च: ${report.totalRecordedExpenditure} रुपये। ${report.recurringIssuesSummary}`;

    try {
      const res = await sarvamTextToSpeech(textToSpeak, targetLang || 'hi-IN', 'ritu');
      if (res.audio_base64) {
        const audioSrc = `data:audio/wav;base64,${res.audio_base64}`;
        setAudioUrl(audioSrc);
        const audio = new Audio(audioSrc);
        audio.play();
      }
    } catch (err) {
      setError(err.message || 'Audio generation failed');
    } finally {
      setSpeaking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-zinc-200 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between no-print">
          <div>
            <h3 className="text-base font-semibold text-zinc-900">
              Appliance Repair Summary Dossier
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Official FixSaathi Digital History Report
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Print or Save PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-600 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Bar (Translation & TTS) */}
        <div className="px-6 py-2.5 bg-zinc-50 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-3 text-xs no-print">
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-zinc-600 font-medium">Translate Summary:</span>
            <select
              value={targetLang}
              onChange={(e) => handleTranslate(e.target.value)}
              disabled={translating}
              className="text-xs bg-white border border-zinc-200 rounded-md px-2 py-1 text-zinc-800 focus:outline-hidden focus:ring-1 focus:ring-teal-600"
            >
              <option value="en-IN">English (Original)</option>
              <option value="hi-IN">Hindi (हिन्दी)</option>
              <option value="mr-IN">Marathi (मराठी)</option>
              <option value="ta-IN">Tamil (தமிழ்)</option>
              <option value="te-IN">Telugu (తెలుగు)</option>
              <option value="bn-IN">Bengali (বাংলা)</option>
            </select>
            {translating && <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600 ml-1" />}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeak}
              disabled={speaking}
              className="px-3 py-1 bg-teal-50 text-teal-700 hover:bg-teal-100/80 rounded-md font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              {speaking ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Generating Voice...
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                  Listen to Summary (Sarvam Bulbul)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Audio Player if generated */}
        {audioUrl && (
          <div className="px-6 py-2 bg-teal-50/50 border-b border-teal-100 flex items-center justify-between gap-2 text-xs no-print">
            <span className="text-teal-900 font-medium flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-teal-600" /> Spoken Summary Audio Ready:
            </span>
            <audio controls src={audioUrl} className="h-7 max-w-xs" autoPlay />
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {loading ? (
            <div className="py-12 text-center text-zinc-400 text-xs flex flex-col items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
              <span>Generating comprehensive repair dossier...</span>
            </div>
          ) : error ? (
            <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-lg">
              {error}
            </div>
          ) : report ? (
            <div className="space-y-5 printable-content">
              {/* Translated Alert if active */}
              {translatedText && (
                <div className="p-3 bg-teal-50/50 border border-teal-100 rounded-lg text-xs text-teal-900 leading-relaxed">
                  <span className="font-semibold block mb-1">अनुवादित सारांश (Translated Summary):</span>
                  {translatedText}
                </div>
              )}

              {/* Recurring Warning if present */}
              {report.hasRecurringIssues && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Recurring Issue Alert:</span>
                    <span>{report.recurringIssuesSummary}</span>
                  </div>
                </div>
              )}

              {/* Appliance Spec Grid */}
              <div className="border border-zinc-200 rounded-xl p-4 bg-zinc-50/50 space-y-2">
                <div className="flex items-center justify-between border-b border-zinc-200/80 pb-2">
                  <h4 className="text-sm font-semibold text-zinc-900">
                    {report.appliance.brand} {report.appliance.name}
                  </h4>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    report.appliance.warrantyStatus === 'Active' 
                      ? 'bg-teal-50 text-teal-700 border border-teal-200' 
                      : 'bg-zinc-100 text-zinc-600'
                  }`}>
                    Warranty {report.appliance.warrantyStatus}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-zinc-500 block">Model</span>
                    <span className="font-medium text-zinc-800">{report.appliance.modelNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Purchase Date</span>
                    <span className="font-medium text-zinc-800">{report.appliance.purchaseDate || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Warranty Until</span>
                    <span className="font-medium text-zinc-800">{report.appliance.warrantyExpiryDate || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Total Expenditure</span>
                    <span className="font-semibold text-teal-700">₹{report.totalRecordedExpenditure.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Repair Timeline */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-2.5">
                  Chronological Repair History ({report.repairTimeline?.length || 0})
                </h4>
                {report.repairTimeline?.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic">No past repairs recorded.</p>
                ) : (
                  <div className="space-y-2.5">
                    {report.repairTimeline.map((item, idx) => (
                      <div key={idx} className="p-3 border border-zinc-200 rounded-lg bg-white text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-zinc-900">{item.problemReported || item.complaint}</span>
                          <span className="text-zinc-500">{item.repairDate}</span>
                        </div>
                        <p className="text-zinc-600">
                          <strong className="text-zinc-700">Work Performed:</strong> {item.workPerformed}
                        </p>
                        <div className="flex flex-wrap items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-100">
                          <span>Parts: {item.replacedParts || 'None'}</span>
                          <span>Technician: {item.technicianName}</span>
                          <span className="font-semibold text-zinc-900">₹{item.amountPaid}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Associated Documents */}
              {report.associatedDocuments?.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-2">
                    Verified Documents on File ({report.associatedDocuments.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {report.associatedDocuments.map((doc, idx) => (
                      <div key={idx} className="p-2.5 border border-zinc-200 rounded-lg flex items-center justify-between bg-zinc-50/50">
                        <div className="truncate pr-2">
                          <span className="font-medium text-zinc-800 block truncate">{doc.filename}</span>
                          <span className="text-[11px] text-zinc-500">{doc.documentType}</span>
                        </div>
                        <span className="text-[11px] font-medium text-teal-700 shrink-0">Attached</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
