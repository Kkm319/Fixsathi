import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Square, 
  Volume2, 
  Sparkles, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { 
  sarvamSpeechToText, 
  sarvamAnalyzeComplaint, 
  createServiceRequest 
} from '../api';

export default function VoiceAssistantView({ 
  appliances, 
  preselectedApplianceId = null, 
  onSuccess 
}) {
  const [selectedApplianceId, setSelectedApplianceId] = useState(preselectedApplianceId || (appliances?.[0]?.id || ''));
  const [selectedLang, setSelectedLang] = useState('hi-IN');
  
  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  // Transcription & Analysis State
  const [transcribing, setTranscribing] = useState(false);
  const [complaintText, setComplaintText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (preselectedApplianceId) {
      setSelectedApplianceId(preselectedApplianceId);
    } else if (appliances?.length && !selectedApplianceId) {
      setSelectedApplianceId(appliances[0].id);
    }
  }, [preselectedApplianceId, appliances]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Supported Sarvam regional languages
  const languages = [
    { code: 'hi-IN', label: 'Hindi (हिन्दी)' },
    { code: 'mr-IN', label: 'Marathi (मराठी)' },
    { code: 'en-IN', label: 'English (Indian)' },
    { code: 'ta-IN', label: 'Tamil (தமிழ்)' },
    { code: 'te-IN', label: 'Telugu (తెలుగు)' },
    { code: 'bn-IN', label: 'Bengali (বাংলা)' },
    { code: 'gu-IN', label: 'Gujarati (ગુજરાતી)' },
    { code: 'kn-IN', label: 'Kannada (ಕನ್ನಡ)' },
    { code: 'pa-IN', label: 'Punjabi (ਪੰਜਾਬੀ)' }
  ];

  // Start Recording via Browser MediaRecorder API
  const startRecording = async () => {
    try {
      setStatusMessage({ type: '', text: '' });
      setAudioUrl('');
      setAudioBlob(null);
      setAnalysisResult(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Stop media tracks
        stream.getTracks().forEach(track => track.stop());

        // Automatically trigger Sarvam Speech-to-Text
        processAudioTranscription(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds(sec => sec + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone error:', err);
      setStatusMessage({
        type: 'error',
        text: 'Microphone access denied or unavailable. You can also type or use sample complaint below.'
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // Process Audio through Sarvam Saaras STT
  const processAudioTranscription = async (blob) => {
    setTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'complaint.wav');
      formData.append('languageCode', selectedLang);

      const res = await sarvamSpeechToText(formData);
      if (res.transcript) {
        setComplaintText(res.transcript);
        // Automatically analyze with history
        await runAnalysis(res.transcript);
      } else {
        setStatusMessage({
          type: 'warning',
          text: 'No speech detected in audio. Please speak clearly or type your complaint below.'
        });
      }
    } catch (err) {
      console.warn('STT Error, falling back gracefully:', err.message);
      setStatusMessage({
        type: 'warning',
        text: `Speech recognition note: ${err.message}. You can edit or enter the complaint in text.`
      });
    } finally {
      setTranscribing(false);
    }
  };

  // Run Sarvam LLM Complaint Intelligence & Recurring Check
  const runAnalysis = async (textToAnalyze = complaintText) => {
    if (!textToAnalyze.trim()) {
      setStatusMessage({ type: 'error', text: 'Please speak or enter a complaint first.' });
      return;
    }

    setAnalyzing(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const result = await sarvamAnalyzeComplaint(textToAnalyze, selectedApplianceId);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Analysis error:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to analyze complaint with Sarvam AI'
      });
    } finally {
      setAnalyzing(false);
    }
  };

  // Submit as verified Service Request
  const handleSubmitServiceRequest = async () => {
    if (!complaintText.trim() || !selectedApplianceId) return;
    setSubmitting(true);

    try {
      await createServiceRequest({
        applianceId: selectedApplianceId,
        complaint: complaintText,
        transcription: complaintText,
        isRecurring: analysisResult?.isRecurring || false,
        previousOccurrenceDetails: analysisResult?.previousOccurrenceDetails || null,
        suggestedQuestions: analysisResult?.suggestedQuestions || [],
        priority: analysisResult?.isRecurring ? 'High' : 'Normal'
      });

      setStatusMessage({
        type: 'success',
        text: 'Service request created! The technician can now view previous repairs and recurring symptoms.'
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to submit service request' });
    } finally {
      setSubmitting(false);
    }
  };

  // Helper for quick demo sample audio text
  const applySampleComplaint = () => {
    const sample = "My washing machine has stopped draining water. It was repaired last month, but the same issue has returned.";
    setComplaintText(sample);
    runAnalysis(sample);
  };

  const selectedAppliance = appliances?.find(a => a.id === selectedApplianceId);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Page Title & Subtitle */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          Tell us what's wrong.
        </h2>
        <p className="text-xs text-zinc-500 max-w-md mx-auto">
          Speak naturally in your preferred language. We'll organize the details for you.
        </p>
      </div>

      {/* Appliance & Language Pickers */}
      <div className="p-4 rounded-xl border border-zinc-200/80 bg-white shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Select Appliance *
            </label>
            <select
              value={selectedApplianceId}
              onChange={(e) => {
                setSelectedApplianceId(e.target.value);
                setAnalysisResult(null);
              }}
              className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600"
            >
              {appliances?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.brand} {a.name} ({a.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Speaking Language
            </label>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedAppliance && (
          <div className="text-[11px] text-zinc-500 flex items-center justify-between pt-1 border-t border-zinc-100">
            <span>Model: {selectedAppliance.modelNumber || 'Standard'}</span>
            <span>Recorded Repairs on File: {selectedAppliance.repairCount || 0}</span>
          </div>
        )}
      </div>

      {/* Voice Recorder Card */}
      <div className="p-8 rounded-xl border border-zinc-200/80 bg-white shadow-xs text-center space-y-4">
        {/* Record Button */}
        <div className="relative inline-block">
          {isRecording && (
            <div className="absolute inset-0 rounded-full bg-teal-400 animate-ping opacity-40"></div>
          )}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`relative w-16 h-16 rounded-full flex items-center justify-center text-white transition-all shadow-md ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-teal-600 hover:bg-teal-700'
            }`}
          >
            {isRecording ? (
              <Square className="w-6 h-6 fill-current" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>
        </div>

        <div>
          <p className="text-xs font-semibold text-zinc-800">
            {isRecording ? `Listening... ${recordingSeconds}s` : 'Tap to Record Voice Complaint'}
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Powered by Sarvam Saaras Multilingual ASR
          </p>
        </div>

        {/* Audio Player if recorded */}
        {audioUrl && (
          <div className="pt-2 flex items-center justify-center gap-2">
            <audio controls src={audioUrl} className="h-8 max-w-xs" />
          </div>
        )}

        {/* Quick Demo Scenario Pill */}
        <div className="pt-2">
          <button
            onClick={applySampleComplaint}
            className="text-[11px] text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100/80 px-2.5 py-1 rounded-md border border-teal-200/60 inline-flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-teal-600" />
            <span>Load Demo Complaint: "Washing machine not draining again..."</span>
          </button>
        </div>
      </div>

      {/* Status Message */}
      {statusMessage.text && (
        <div className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
          statusMessage.type === 'error'
            ? 'bg-rose-50 text-rose-700 border border-rose-200'
            : statusMessage.type === 'warning'
            ? 'bg-amber-50 text-amber-800 border border-amber-200'
            : 'bg-teal-50 text-teal-800 border border-teal-200'
        }`}>
          {statusMessage.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Editable Transcription Input */}
      <div className="p-4 rounded-xl border border-zinc-200/80 bg-white shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-zinc-800">
            Complaint Text (Spoken or Typed)
          </label>
          {transcribing && (
            <span className="text-[11px] text-teal-600 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Transcribing with Sarvam...
            </span>
          )}
        </div>

        <textarea
          rows={3}
          value={complaintText}
          onChange={(e) => setComplaintText(e.target.value)}
          placeholder="e.g. My washing machine has stopped draining water. It was repaired last month, but the same issue has returned."
          className="w-full text-xs p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600 leading-relaxed"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => runAnalysis()}
            disabled={!complaintText.trim() || analyzing}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Analyzing History...
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 text-teal-400" />
                Check Repair History
              </>
            )}
          </button>
        </div>
      </div>

      {/* Structured Analysis Results */}
      {analysisResult && (
        <div className="p-5 rounded-xl border border-zinc-200 bg-white shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
              Diagnostic & History Analysis
            </h3>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              analysisResult.isRecurring
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-zinc-100 text-zinc-700'
            }`}>
              {analysisResult.isRecurring ? 'Recurring Issue Detected' : 'First Occurrence'}
            </span>
          </div>

          {/* Core Fields */}
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-zinc-700 min-w-32">Problem:</span>
              <span className="text-zinc-900">{analysisResult.problem}</span>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-semibold text-zinc-700 min-w-32">Previous occurrence:</span>
              <span className={`font-medium ${analysisResult.isRecurring ? 'text-amber-800' : 'text-zinc-600'}`}>
                {analysisResult.isRecurring ? 'Yes' : 'No recorded previous match'}
              </span>
            </div>

            {analysisResult.previousOccurrenceDetails && (
              <div className="flex items-start gap-2 bg-amber-50/60 p-2.5 rounded-lg border border-amber-100">
                <span className="font-semibold text-amber-900 min-w-32">Past Record:</span>
                <span className="text-amber-900">{analysisResult.previousOccurrenceDetails}</span>
              </div>
            )}
          </div>

          {/* Suggested Questions for Technician */}
          {analysisResult.suggestedQuestions?.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-zinc-100">
              <div className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
                <span className="text-xs font-semibold text-zinc-800">
                  Suggested questions for technician:
                </span>
              </div>
              <ul className="space-y-1.5 pl-5 list-disc text-xs text-zinc-600">
                {analysisResult.suggestedQuestions.map((q, idx) => (
                  <li key={idx} className="leading-relaxed">{q}</li>
                ))}
              </ul>
              <p className="text-[10px] text-zinc-400 italic pt-1">
                Note: These are questions to ask, not definitive diagnoses.
              </p>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-[11px] text-zinc-500">
              Ready to schedule service?
            </span>
            <button
              onClick={handleSubmitServiceRequest}
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'Submitting...' : 'Submit Service Request'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
