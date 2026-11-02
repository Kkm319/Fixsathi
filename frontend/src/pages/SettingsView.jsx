import React, { useState } from 'react';
import { User, Globe, Bell, Shield, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { resetDemoData } from '../api';

export default function SettingsView({ onDataReset }) {
  const [profile, setProfile] = useState({
    name: 'Parul Sharma',
    email: 'parul@fixsaathi.in',
    phone: '+91 98765 43210',
    address: 'B-402, Green Glen Layout, Bangalore, Karnataka',
    preferredLanguage: 'hi-IN'
  });

  const [notifications, setNotifications] = useState({
    warrantyReminders: true,
    serviceUpdates: true,
    recurringAlerts: true
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleResetDemo = async () => {
    if (window.confirm('Reset all sample demonstration data to initial state?')) {
      await resetDemoData();
      if (onDataReset) onDataReset();
      alert('Demo data successfully restored to Samsung Washing Machine scenario.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-150">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
          Household & Application Settings
        </h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          Configure profile, preferred Indian language, and Sarvam AI connection.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span>Preferences saved successfully.</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSave} className="p-6 rounded-xl border border-zinc-200/80 bg-white shadow-xs space-y-4">
        <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-teal-600" />
          <span>Household Profile</span>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Preferred Spoken Language
            </label>
            <select
              value={profile.preferredLanguage}
              onChange={(e) => setProfile({ ...profile, preferredLanguage: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600"
            >
              <option value="hi-IN">Hindi (हिन्दी)</option>
              <option value="mr-IN">Marathi (मराठी)</option>
              <option value="en-IN">English (Indian)</option>
              <option value="ta-IN">Tamil (தமிழ்)</option>
              <option value="te-IN">Telugu (తెలుగు)</option>
              <option value="bn-IN">Bengali (বাংলা)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">
            Service Address
          </label>
          <input
            type="text"
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600"
          />
        </div>

        {/* Notifications */}
        <div className="pt-3 border-t border-zinc-100 space-y-2">
          <span className="text-xs font-semibold text-zinc-800 block">Notification Preferences</span>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs text-zinc-600 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.warrantyReminders}
                onChange={(e) => setNotifications({ ...notifications, warrantyReminders: e.target.checked })}
                className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
              />
              <span>Send warranty expiration notifications 30 days in advance</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-zinc-600 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.recurringAlerts}
                onChange={(e) => setNotifications({ ...notifications, recurringAlerts: e.target.checked })}
                className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
              />
              <span>Alert when similar recurring problems are detected</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-4 py-2 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Sarvam AI Status & Models Card */}
      <div className="p-6 rounded-xl border border-zinc-200/80 bg-white shadow-xs space-y-3">
        <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Sarvam AI Service Status</span>
        </h3>
        <p className="text-xs text-zinc-500">
          Active integrations configured securely through server environment variables.
        </p>

        <div className="grid grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-between">
            <div>
              <span className="font-semibold text-zinc-800 block">Speech-to-Text</span>
              <span className="text-[11px] text-zinc-500">Saaras v3 / v4 ASR</span>
            </div>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Active
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-between">
            <div>
              <span className="font-semibold text-zinc-800 block">Text-to-Speech</span>
              <span className="text-[11px] text-zinc-500">Bulbul v3 Synthesis</span>
            </div>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Active
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-between">
            <div>
              <span className="font-semibold text-zinc-800 block">LLM Reasoning</span>
              <span className="text-[11px] text-zinc-500">sarvam-105b-conversations</span>
            </div>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Active
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-between">
            <div>
              <span className="font-semibold text-zinc-800 block">Translation</span>
              <span className="text-[11px] text-zinc-500">Mayura v1 Engine</span>
            </div>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Demo Controls Card */}
      <div className="p-5 rounded-xl border border-zinc-200/80 bg-zinc-50 shadow-xs flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-zinc-900 block">Demonstration Scenario</span>
          <p className="text-[11px] text-zinc-500">
            Reset all appliances and repairs back to the default Samsung Washing Machine scenario.
          </p>
        </div>
        <button
          onClick={handleResetDemo}
          className="px-3.5 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-white border border-zinc-200 rounded-lg shadow-xs hover:bg-zinc-100 transition-colors flex items-center gap-1.5 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Scenario</span>
        </button>
      </div>
    </div>
  );
}
