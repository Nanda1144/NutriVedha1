import apiClient, { isMockEnabled } from './apiClient';
import { Doctor, Appointment } from '../types';
import { MOCK_DOCTORS } from './mockData';

let bookedAppointments: Appointment[] = [
  {
    id: 'apt_001',
    userId: 'usr_88291a0f-1144-4f21-992a-001',
    doctorId: 'doc_001',
    doctorName: 'Dr. Ananya Sharma',
    doctorSpecialization: 'Kaya Chikitsa (General Medicine)',
    doctorAvatarUrl: MOCK_DOCTORS[0].avatarUrl,
    date: '2026-11-25',
    timeSlot: '11:00 AM',
    consultationMode: 'Video Consultation',
    status: 'Confirmed',
    feePaidINR: 750,
    meetingLink: 'https://meet.ayurai.health/room-nv-2026-8819',
    notes: 'Follow-up consultation regarding seasonal Pitta cooling regimen and herbal extract dosing.',
    createdAt: '2026-11-20T11:00:00.000Z',
  },
];

export const telemedicineService = {
  async getDoctors(query?: string, specialization?: string): Promise<Doctor[]> {
    if (isMockEnabled()) {
      await new Promise((r) => setTimeout(r, 300));
      let results = [...MOCK_DOCTORS];
      if (query) {
        const q = query.toLowerCase();
        results = results.filter((d) => d.name.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q));
      }
      if (specialization && specialization !== 'All Specializations') {
        results = results.filter((d) => d.specialization === specialization);
      }
      return results;
    }
    const res = await apiClient.get<{ data: Doctor[] }>('/telemedicine/doctors', {
      params: { query, specialization },
    });
    return res.data.data;
  },

  async getDoctorById(id: string): Promise<Doctor | null> {
    if (isMockEnabled()) {
      return MOCK_DOCTORS.find((d) => d.id === id) || null;
    }
    const res = await apiClient.get<{ data: Doctor }>(`/telemedicine/doctors/${id}`);
    return res.data.data;
  },

  async bookAppointment(booking: {
    doctorId: string;
    date: string;
    timeSlot: string;
    consultationMode: Appointment['consultationMode'];
    notes?: string;
  }): Promise<Appointment> {
    if (isMockEnabled()) {
      await new Promise((r) => setTimeout(r, 700));
      const doctor = MOCK_DOCTORS.find((d) => d.id === booking.doctorId);
      if (!doctor) throw new Error('Doctor not found');

      const newApt: Appointment = {
        id: 'apt_' + Date.now(),
        userId: 'usr_88291a0f-1144-4f21-992a-001',
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialization: doctor.specialization,
        doctorAvatarUrl: doctor.avatarUrl,
        date: booking.date,
        timeSlot: booking.timeSlot,
        consultationMode: booking.consultationMode,
        status: 'Confirmed',
        feePaidINR: doctor.consultationFeeINR,
        meetingLink: booking.consultationMode === 'Video Consultation' ? `https://meet.ayurai.health/room-nv-${Date.now()}` : undefined,
        notes: booking.notes,
        createdAt: new Date().toISOString(),
      };
      bookedAppointments.unshift(newApt);
      return newApt;
    }

    const res = await apiClient.post<{ data: Appointment }>('/telemedicine/appointments', booking);
    return res.data.data;
  },

  async getMyAppointments(): Promise<Appointment[]> {
    if (isMockEnabled()) {
      return bookedAppointments;
    }
    const res = await apiClient.get<{ data: Appointment[] }>('/telemedicine/appointments/my');
    return res.data.data;
  },

  async cancelAppointment(id: string): Promise<void> {
    if (isMockEnabled()) {
      await new Promise((r) => setTimeout(r, 400));
      bookedAppointments = bookedAppointments.map((a) => (a.id === id ? { ...a, status: 'Cancelled' as const } : a));
      return;
    }
    await apiClient.post(`/telemedicine/appointments/${id}/cancel`);
  },
};
