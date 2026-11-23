import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ScanEye,
  Upload,
  Camera,
  X,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Download,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { aiService } from '../services/aiService';
import { medicalService } from '../services/medicalService';
import { HealthScanResult, ScanHistoryItem } from '../types';

export const HealthScan: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<HealthScanResult | null>(null);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [savedToVault, setSavedToVault] = useState(false);

  useEffect(() => {
    aiService.getScanHistory().then(setHistory);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim() && !imageFile) {
      alert('Please enter symptom details or upload a photo for screening.');
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    setSavedToVault(false);

    try {
      const res = await aiService.analyzeSymptoms({ symptoms, imageFile });
      setResult(res);
      const updatedHistory = await aiService.getScanHistory();
      setHistory(updatedHistory);
    } catch {
      alert('Analysis error. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToVault = async () => {
    if (!result) return;
    const fakeFile = new File([JSON.stringify(result, null, 2)], `AI_Scan_${Date.now()}.json`, {
      type: 'application/json',
    });
    await medicalService.uploadReport(fakeFile, `AI Scan: ${result.doshaImbalance.primary} Analysis`, 'Dermatology');
    setSavedToVault(true);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cream text-forest text-[11px] font-semibold border border-sand mb-2">
          <Sparkles className="w-3.5 h-3.5 text-forest" />
          <span>Multimodal Ayurvedic Clinical Screening</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">AI Health & Symptom Scan</h1>
        <p className="text-xs text-warm-brown max-w-2xl mt-1">
          Upload dermatological photos or describe wellness symptoms. Our AI engine evaluates root dosha imbalances according to classical Ayurvedic criteria.
        </p>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-4 bg-state-warning/10/60 border border-state-warning/30 rounded-2xl flex items-start gap-3 text-xs text-[#8A6118] leading-relaxed">
        <AlertTriangle className="w-5 h-5 text-[#A9761F] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Preventive Wellness Notice:</span> This AI analysis provides educational insight into bio-energy dosha imbalances. It is not an acute emergency medical diagnosis. For clinical concerns, please consult a verified Vaidya or physician.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload & Symptom Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6">
            <form onSubmit={handleAnalyze} className="space-y-5">
              {/* Photo Upload Box */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider">
                  Symptom / Skin Photo (Optional)
                </label>
                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-sand bg-ivory p-2 flex items-center justify-center">
                    <img src={imagePreview} alt="Symptom Preview" className="max-h-56 rounded-xl object-contain" />
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="absolute top-4 right-4 p-1.5 bg-charcoal/70 text-white rounded-full hover:bg-charcoal transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-sand rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-cream/40 transition-colors bg-white">
                    <Upload className="w-8 h-8 text-forest mb-2" />
                    <span className="text-xs font-semibold text-charcoal">Upload Photo or Click to Browse</span>
                    <span className="text-[10px] text-warm-brown mt-1">JPG, PNG up to 5MB (Skin redness, eye/tongue photo, rash)</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                )}
              </div>

              {/* Symptom Text Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider">
                  Describe Symptoms & Sensation
                </label>
                <textarea
                  rows={4}
                  required
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. Mild burning sensation on forearm, dryness after shower, aggravated by spicy food and afternoon sun..."
                  className="w-full rounded-xl border border-soft-beige bg-white p-3 text-xs text-charcoal placeholder-warm-brown/60 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest shadow-earth-sm"
                />
              </div>

              <Button type="submit" size="lg" isLoading={isAnalyzing} className="w-full" leftIcon={<ScanEye className="w-4 h-4" />}>
                {isAnalyzing ? 'Evaluating Bio-Dosha Resonance...' : 'Analyze Health & Symptoms'}
              </Button>
            </form>
          </Card>

          {/* Analysis Results Display */}
          {result && (
            <Card className="p-6 space-y-5 border-forest/30 bg-white shadow-earth-md animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-soft-beige">
                <div className="flex items-center gap-2">
                  <Badge variant={result.doshaImbalance.primary.toLowerCase() as any}>
                    {result.doshaImbalance.primary} Imbalance
                  </Badge>
                  <span className="text-xs text-warm-brown font-medium">Confidence: {result.confidenceScore}%</span>
                </div>
                <Badge variant="neutral">{result.urgencyLevel}</Badge>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-charcoal">Condition Evaluation</h3>
                <p className="text-xs text-warm-brown leading-relaxed">{result.conditionAssessment}</p>
              </div>

              {/* Herbal Recommendations */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-forest uppercase tracking-wider">Beneficial Ayurvedic Herbs</h4>
                <div className="flex flex-wrap gap-2">
                  {result.recommendations.herbs.map((h) => (
                    <span key={h} className="px-2.5 py-1 rounded-lg bg-cream text-forest text-xs font-semibold border border-sand">
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lifestyle Guidance */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-forest uppercase tracking-wider">Lifestyle Adjustments</h4>
                <ul className="list-disc list-inside text-xs text-warm-brown space-y-1">
                  {result.recommendations.lifestyleTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-soft-beige flex flex-wrap items-center justify-between gap-3">
                <Button
                  size="sm"
                  variant={savedToVault ? 'secondary' : 'outline'}
                  onClick={handleSaveToVault}
                  disabled={savedToVault}
                  leftIcon={<ShieldCheck className="w-4 h-4" />}
                >
                  {savedToVault ? 'Encrypted & Saved to Vault' : 'Save to Medical Vault'}
                </Button>

                <Link to="/telemedicine">
                  <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Consult a Vaidya
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>

        {/* Scan History (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal">Previous Screenings</h3>
            <span className="text-xs text-warm-brown">{history.length} records</span>
          </div>

          <div className="space-y-3">
            {history.map((item) => (
              <Card key={item.id} className="p-4 space-y-2 bg-white">
                <div className="flex items-center justify-between">
                  <Badge variant={item.dosha.toLowerCase() as any} size="sm">{item.dosha}</Badge>
                  <span className="text-[10px] text-warm-brown flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.date}
                  </span>
                </div>
                <p className="text-xs font-semibold text-charcoal">{item.condition}</p>
                <p className="text-[11px] text-warm-brown line-clamp-2">{item.summary}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
