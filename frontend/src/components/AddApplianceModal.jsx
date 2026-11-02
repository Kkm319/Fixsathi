import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Camera, 
  Upload, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { createAppliance, updateAppliance, sarvamScanAppliance } from '../api';

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
  const [scanning, setScanning] = useState(false);
  const [autoFilledBadge, setAutoFilledBadge] = useState(false);

  // Camera states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

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
    setAutoFilledBadge(false);
    setError('');
    stopCamera();
  }, [isOpen, initialData]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!isOpen) return null;

  // Start Camera
  const startCamera = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.warn('Camera access denied:', err.message);
      setError('Camera access not available. You can upload an image or choose a demo nameplate.');
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  // Capture Photo from Camera
  const capturePhoto = async () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Data = canvas.toDataURL('image/jpeg', 0.85);

      stopCamera();
      await processScannedImage({ imageBase64: base64Data });
    } catch (err) {
      setError('Failed to capture photo: ' + err.message);
    }
  };

  // Upload Photo File
  const handleFileUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);
      formDataUpload.append('textHint', file.name);
      await processScannedImage(formDataUpload, true);
    }
  };

  // Process image with Sarvam AI
  const processScannedImage = async (payload, isFormData = false) => {
    setScanning(true);
    setError('');
    setAutoFilledBadge(false);

    try {
      let result;
      if (isFormData) {
        result = await sarvamScanAppliance(payload);
      } else {
        const formDataPayload = new FormData();
        formDataPayload.append('imageBase64', payload.imageBase64);
        formDataPayload.append('textHint', payload.textHint || 'Appliance nameplate scan');
        result = await sarvamScanAppliance(formDataPayload);
      }

      if (result) {
        setFormData(prev => ({
          ...prev,
          name: result.name || prev.name || 'Washing Machine',
          brand: result.brand || prev.brand || 'Samsung',
          modelNumber: result.modelNumber || prev.modelNumber || '',
          serialNumber: result.serialNumber || prev.serialNumber || '',
          category: result.category || prev.category || 'General',
          purchaseDate: result.purchaseDate || prev.purchaseDate,
          warrantyExpiryDate: result.warrantyExpiryDate || prev.warrantyExpiryDate
        }));
        setAutoFilledBadge(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to scan image with Sarvam AI');
    } finally {
      setScanning(false);
    }
  };

  // Demo presets for quick testing
  const handlePresetScan = (presetName) => {
    if (presetName === 'samsung-wm') {
      processScannedImage({
        imageBase64: 'demo',
        textHint: 'SAMSUNG EcoBubble 8.0 kg Fully Automatic Front Load Model: WW80T504DAX Serial: SM-WM-8829104 Manufactured: 2025/01 Inverter 10 Year Warranty'
      });
    } else if (presetName === 'lg-fridge') {
      processScannedImage({
        imageBase64: 'demo',
        textHint: 'LG Smart Inverter Frost Free Double Door Refrigerator Model: GL-T402JDS3 Serial: LG-RF-9043221 Purchase Date: 2024-03-15 10 Year Smart Inverter Compressor Warranty'
      });
    } else if (presetName === 'voltas-ac') {
      processScannedImage({
        imageBase64: 'demo',
        textHint: 'Voltas 1.5 Ton 3 Star Inverter Split AC Model: 185V-JZTI Serial: VOL-AC-4410982 Installed: 2023-05-20 PCB 5 Year Warranty'
      });
    }
  };

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-zinc-200 shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-semibold text-zinc-900">
              {isEditing ? 'Edit Appliance' : 'Add New Appliance'}
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Take a picture of the nameplate or fill details manually.
            </p>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-zinc-400 hover:text-zinc-600 p-1 rounded-md hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* AI Picture / Nameplate Scanner Section */}
          {!isEditing && (
            <div className="p-3.5 rounded-xl border border-teal-200/80 bg-teal-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-semibold text-teal-950">
                    Scan Nameplate with Sarvam AI
                  </span>
                </div>
                <span className="text-[10px] text-teal-700 bg-teal-100/70 font-semibold px-2 py-0.5 rounded-full">
                  Instant Auto-Fill
                </span>
              </div>

              {/* Camera Video Stream Preview if active */}
              {isCameraActive ? (
                <div className="space-y-2">
                  <div className="relative rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 border-2 border-teal-400/60 border-dashed rounded-lg pointer-events-none m-4"></div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="text-xs text-zinc-600 hover:text-zinc-900 px-3 py-1.5 rounded-md hover:bg-zinc-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Snap Photo & Scan</span>
                    </button>
                  </div>
                </div>
              ) : scanning ? (
                <div className="py-6 text-center text-xs text-teal-800 space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-teal-600 mx-auto" />
                  <p className="font-medium">Sarvam AI is analyzing the nameplate sticker...</p>
                  <p className="text-[11px] text-teal-600">Extracting brand, model code, serial, and warranty terms</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[11px] text-teal-800/90 leading-relaxed">
                    Take a picture of the appliance label, invoice, or rating sticker. Sarvam AI will extract and fill the details automatically.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Take a Picture</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Upload Photo</span>
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Preset photo tags for instant testing */}
                  <div className="pt-2 border-t border-teal-100 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-zinc-500">Or try sample scan:</span>
                    <button
                      type="button"
                      onClick={() => handlePresetScan('samsung-wm')}
                      className="text-[10px] font-medium text-teal-800 bg-white hover:bg-teal-50 px-2 py-0.5 rounded border border-teal-200/80 transition-colors"
                    >
                      Samsung EcoBubble Label
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetScan('lg-fridge')}
                      className="text-[10px] font-medium text-teal-800 bg-white hover:bg-teal-50 px-2 py-0.5 rounded border border-teal-200/80 transition-colors"
                    >
                      LG Inverter Fridge
                    </button>
                  </div>
                </div>
              )}

              {autoFilledBadge && (
                <div className="p-2 rounded-lg bg-teal-100/70 border border-teal-300 text-teal-900 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                  <span><strong>Details auto-filled!</strong> Review or edit the values below before saving.</span>
                </div>
              )}
            </div>
          )}

          {/* Form Fields */}
          <form id="appliance-form" onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Appliance Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Washing Machine"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Brand *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Samsung, LG, IFB"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Model Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. WW80T504DAX"
                  value={formData.modelNumber}
                  onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition-all"
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
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Warranty Expiry Date
                </label>
                <input
                  type="date"
                  value={formData.warrantyExpiryDate}
                  onChange={(e) => setFormData({ ...formData, warrantyExpiryDate: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Serial Number
              </label>
              <input
                type="text"
                placeholder="e.g. SM-WM-8829104"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition-all"
              />
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-zinc-100 flex items-center justify-end gap-2 bg-zinc-50/50 shrink-0">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-3.5 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="appliance-form"
            disabled={loading}
            className="px-4 py-1.5 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <>Saving...</>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                {isEditing ? 'Update Appliance' : 'Save Appliance'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
