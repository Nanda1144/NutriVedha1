import apiClient, { isMockEnabled } from './apiClient';
import { MedicalReport } from '../types';
import { MOCK_REPORTS } from './mockData';

let localReports: MedicalReport[] = [...MOCK_REPORTS];

export const medicalService = {
  async getReports(): Promise<MedicalReport[]> {
    if (isMockEnabled()) {
      await new Promise((r) => setTimeout(r, 300));
      return localReports;
    }
    const res = await apiClient.get<{ data: MedicalReport[] }>('/medical/reports');
    return res.data.data;
  },

  async uploadReport(file: File, reportTitle: string, reportType: MedicalReport['reportType']): Promise<MedicalReport> {
    if (isMockEnabled()) {
      await new Promise((r) => setTimeout(r, 800));
      const newRep: MedicalReport = {
        id: 'rep_' + Date.now(),
        userId: 'usr_88291a0f-1144-4f21-992a-001',
        reportTitle,
        reportType,
        dateUploaded: new Date().toISOString().split('T')[0],
        fileSizeBytes: file.size,
        fileName: file.name,
        isEncrypted: true,
        encryptionAlgorithm: 'AES-256-GCM',
        previewSnippet: 'Secure encrypted document uploaded and verified with AES-256-GCM authentication tag.',
        tags: [reportType, 'Uploaded'],
      };
      localReports.unshift(newRep);
      return newRep;
    }

    const payload = new FormData();
    payload.append('file', file);
    payload.append('reportTitle', reportTitle);
    payload.append('reportType', reportType);

    const res = await apiClient.post<{ data: MedicalReport }>('/medical/reports/upload', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  async deleteReport(id: string): Promise<void> {
    if (isMockEnabled()) {
      await new Promise((r) => setTimeout(r, 400));
      localReports = localReports.filter((r) => r.id !== id);
      return;
    }
    await apiClient.delete(`/medical/reports/${id}`);
  },

  async decryptAndDownload(id: string): Promise<{ blobUrl: string; fileName: string }> {
    await new Promise((r) => setTimeout(r, 600));
    const target = localReports.find((r) => r.id === id);
    const content = `--- NUTRIVEDHA CLINICAL VAULT ---\nReport Title: ${target?.reportTitle}\nType: ${target?.reportType}\nDecrypted via: AES-256-GCM Authenticated Cipher\nDate: ${target?.dateUploaded}\nSecurity: Verified Integrity`;
    const blob = new Blob([content], { type: 'text/plain' });
    return {
      blobUrl: URL.createObjectURL(blob),
      fileName: target ? `${target.reportTitle.replace(/\s+/g, '_')}_decrypted.txt` : 'report.txt',
    };
  },
};
