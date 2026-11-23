import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  ShieldCheck,
  Search,
  Filter,
  Lock,
  Plus
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { medicalService } from '../services/medicalService';
import { MedicalReport } from '../types';

export const HealthReports: React.FC = () => {
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState<MedicalReport['reportType']>('Blood Test');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const list = await medicalService.getReports();
    setReports(list);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !reportTitle.trim()) return;
    setIsUploading(true);
    try {
      const created = await medicalService.uploadReport(uploadFile, reportTitle, reportType);
      setReports([created, ...reports]);
      setIsUploadOpen(false);
      setReportTitle('');
      setUploadFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Permanently delete this encrypted clinical record?')) {
      await medicalService.deleteReport(id);
      setReports(reports.filter((r) => r.id !== id));
    }
  };

  const handleDownload = async (id: string) => {
    const { blobUrl, fileName } = await medicalService.decryptAndDownload(id);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileName;
    a.click();
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch = r.reportTitle.toLowerCase().includes(searchQuery.toLowerCase()) || r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = selectedFilter === 'All' || r.reportType === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-olive font-semibold mb-1">
            <Lock className="w-3.5 h-3.5 text-forest" />
            <span>AES-256-GCM Encrypted at Rest</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">Medical Reports Vault</h1>
          <p className="text-xs text-warm-brown mt-0.5">Secure clinical documents, diagnostic lab reports, and AI scan evaluations.</p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Upload Report
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center gap-3 bg-white">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-warm-brown absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports by title or tags..."
            className="w-full bg-ivory rounded-xl border border-soft-beige pl-9 pr-3 py-2 text-xs text-charcoal focus:outline-none focus:border-forest"
          />
        </div>
        <div className="w-full sm:w-56">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="w-full bg-ivory rounded-xl border border-soft-beige px-3 py-2 text-xs text-charcoal"
          >
            <option value="All">All Report Types</option>
            <option value="Ayurvedic Consultation">Ayurvedic Consultation</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Blood Test">Blood Test</option>
            <option value="Prescription">Prescription</option>
          </select>
        </div>
      </Card>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <div className="text-center py-12 text-warm-brown text-xs">
            No medical records found matching your query.
          </div>
        ) : (
          filteredReports.map((report) => (
            <Card key={report.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="forest" size="sm">{report.reportType}</Badge>
                  <span className="text-[11px] text-warm-brown">{report.dateUploaded}</span>
                  <div className="flex items-center gap-1 text-[10px] text-olive font-medium">
                    <ShieldCheck className="w-3 h-3 text-forest" />
                    <span>Verified Encrypted</span>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-charcoal">{report.reportTitle}</h3>
                {report.previewSnippet && (
                  <p className="text-xs text-warm-brown line-clamp-1 italic">"{report.previewSnippet}"</p>
                )}
                <div className="flex gap-1.5 pt-1">
                  {report.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-cream text-[10px] text-warm-brown">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => handleDownload(report.id)} leftIcon={<Download className="w-3.5 h-3.5" />}>
                  Decrypt & Download
                </Button>
                <button
                  onClick={() => handleDelete(report.id)}
                  className="p-2 text-warm-brown hover:text-state-error hover:bg-state-error/10 rounded-lg transition-colors"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Upload Modal */}
      <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Upload Encrypted Clinical Report">
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <Input
            label="Report Title"
            required
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            placeholder="e.g. Lipid Profile & Liver Function Chart"
          />

          <Select
            label="Report Classification"
            value={reportType}
            onChange={(e) => setReportType(e.target.value as any)}
            options={[
              { value: 'Blood Test', label: 'Blood & Metabolic Test' },
              { value: 'Ayurvedic Consultation', label: 'Ayurvedic Consultation Notes' },
              { value: 'Dermatology', label: 'Dermatology & Skin Barrier Report' },
              { value: 'Prescription', label: 'Prescription & Dosha Guidance' },
            ]}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider">Select Document</label>
            <input
              type="file"
              required
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-charcoal file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-forest file:text-ivory hover:file:bg-forest-hover cursor-pointer"
            />
          </div>

          <div className="p-3 bg-cream rounded-xl text-[11px] text-warm-brown">
            Document will be encrypted with a unique 16-byte initialization vector (IV) using AES-256-GCM authenticated cipher prior to storage.
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isUploading}>
              Encrypt & Upload
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
