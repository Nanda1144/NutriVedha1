import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Search,
  Calendar,
  Clock,
  Video,
  Star,
  ShieldCheck,
  CheckCircle2,
  X,
  ArrowRight
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { telemedicineService } from '../services/telemedicineService';
import { Doctor, Appointment } from '../types';

export const Telemedicine: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations');
  const [activeTab, setActiveTab] = useState<'directory' | 'appointments'>('directory');

  // Booking Modal State
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState('2026-11-26');
  const [bookingSlot, setBookingSlot] = useState('');
  const [bookingMode, setBookingMode] = useState<Appointment['consultationMode']>('Video Consultation');
  const [bookingNotes, setBookingNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const specializations = [
    'All Specializations',
    'Kaya Chikitsa (General Medicine)',
    'Panchakarma Specialist',
    'Twak Roga (Dermatology)',
    'Ayurvedic Dietetics',
  ];

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedSpecialization]);

  const loadData = async () => {
    const [docs, apts] = await Promise.all([
      telemedicineService.getDoctors(searchQuery, selectedSpecialization),
      telemedicineService.getMyAppointments(),
    ]);
    setDoctors(docs);
    setAppointments(apts);
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDoctor || !bookingSlot) return;
    setIsBooking(true);
    try {
      const created = await telemedicineService.bookAppointment({
        doctorId: bookingDoctor.id,
        date: bookingDate,
        timeSlot: bookingSlot,
        consultationMode: bookingMode,
        notes: bookingNotes,
      });
      setAppointments([created, ...appointments]);
      setBookingDoctor(null);
      setBookingSuccess(`Appointment confirmed with ${bookingDoctor.name} for ${bookingDate} at ${bookingSlot}.`);
      setActiveTab('appointments');
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    if (confirm('Are you sure you wish to cancel this scheduled consultation?')) {
      await telemedicineService.cancelAppointment(id);
      setAppointments(appointments.map((a) => (a.id === id ? { ...a, status: 'Cancelled' as const } : a)));
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">Telemedicine & Doctor Consultations</h1>
          <p className="text-xs text-warm-brown mt-0.5">Connect with verified B.A.M.S. & M.D. Ayurvedic physicians across India for personalized care.</p>
        </div>
      </div>

      {bookingSuccess && (
        <div className="p-3 bg-state-success/10 border border-state-success/30 text-[#2F7A4D] rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-state-success shrink-0" />
            <span>{bookingSuccess}</span>
          </div>
          <button onClick={() => setBookingSuccess(null)} className="text-state-success font-bold p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-soft-beige gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('directory')}
          className={`pb-3 transition-colors ${activeTab === 'directory' ? 'text-forest border-b-2 border-forest font-bold' : 'text-warm-brown'}`}
        >
          Find a Doctor ({doctors.length})
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-3 transition-colors ${activeTab === 'appointments' ? 'text-forest border-b-2 border-forest font-bold' : 'text-warm-brown'}`}
        >
          My Scheduled Consultations ({appointments.length})
        </button>
      </div>

      {/* Tab 1: Doctor Directory */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          <Card className="p-4 space-y-3 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 relative">
                <Search className="w-4 h-4 text-warm-brown absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by physician name, language, or specialty..."
                  className="w-full bg-ivory rounded-xl border border-soft-beige pl-10 pr-4 py-2 text-xs text-charcoal focus:outline-none focus:border-forest"
                />
              </div>
              <div>
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="w-full bg-ivory rounded-xl border border-soft-beige px-3 py-2 text-xs text-charcoal"
                >
                  {specializations.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {doctors.map((doc) => (
              <Card key={doc.id} hoverable className="p-6 space-y-4 bg-white flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    <img
                      src={doc.avatarUrl}
                      alt={doc.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-sand shrink-0 shadow-earth-sm"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-serif font-bold text-charcoal">{doc.name}</h3>
                        <ShieldCheck className="w-4 h-4 text-forest" aria-label="Verified Practitioner" />
                      </div>
                      <p className="text-xs text-forest font-medium">{doc.title}</p>
                      <p className="text-xs text-olive">{doc.specialization}</p>
                      <div className="flex items-center gap-2 pt-0.5 text-xs text-warm-brown">
                        <span className="flex items-center text-[#A9761F] font-bold gap-0.5">
                          <Star className="w-3.5 h-3.5 fill-current" /> {doc.rating}
                        </span>
                        <span>•</span>
                        <span>{doc.experienceYears} Years Clinical Exp</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-warm-brown line-clamp-2 leading-relaxed">{doc.about}</p>

                  <div className="text-[11px] text-charcoal space-y-1 pt-1">
                    <p><span className="text-warm-brown font-medium">Languages:</span> {doc.languages.join(', ')}</p>
                    <p><span className="text-warm-brown font-medium">Registration:</span> {doc.registrationNumber}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-soft-beige flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-warm-brown uppercase tracking-wider block">Consultation Fee</span>
                    <span className="text-base font-serif font-bold text-forest">₹{doc.consultationFeeINR}</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setBookingDoctor(doc);
                      setBookingSlot(doc.availableSlots[0]);
                    }}
                  >
                    Schedule Booking
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Scheduled Appointments */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="text-center py-12 text-warm-brown text-xs">
              No consultations scheduled yet. Book your first appointment from the doctor directory.
            </div>
          ) : (
            appointments.map((apt) => (
              <Card key={apt.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
                <div className="flex items-start gap-3.5">
                  <img src={apt.doctorAvatarUrl} alt={apt.doctorName} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-charcoal">{apt.doctorName}</h3>
                      <Badge variant={apt.status === 'Confirmed' ? 'success' : apt.status === 'Cancelled' ? 'danger' : 'neutral'} size="sm">
                        {apt.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-forest">{apt.doctorSpecialization}</p>
                    <div className="flex items-center gap-3 text-xs text-warm-brown pt-0.5">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {apt.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {apt.timeSlot}</span>
                      <span className="flex items-center gap-1"><Video className="w-3.5 h-3.5" /> {apt.consultationMode}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {apt.status === 'Confirmed' && apt.meetingLink && (
                    <a href={apt.meetingLink} target="_blank" rel="noreferrer">
                      <Button size="sm" leftIcon={<Video className="w-3.5 h-3.5" />}>
                        Join Video Room
                      </Button>
                    </a>
                  )}
                  {apt.status === 'Confirmed' && (
                    <Button size="sm" variant="outline" onClick={() => handleCancelAppointment(apt.id)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Booking Modal */}
      {bookingDoctor && (
        <Modal
          isOpen={!!bookingDoctor}
          onClose={() => setBookingDoctor(null)}
          title={`Book Appointment: ${bookingDoctor.name}`}
          description={`${bookingDoctor.specialization} • Fee: ₹${bookingDoctor.consultationFeeINR}`}
        >
          <form onSubmit={handleBookSubmit} className="space-y-4">
            <Input
              label="Select Consultation Date"
              type="date"
              required
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider">
                Available Time Slots
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {bookingDoctor.availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setBookingSlot(slot)}
                    className={`p-2 rounded-xl text-xs font-medium border text-center transition-all ${
                      bookingSlot === slot
                        ? 'bg-forest text-ivory border-forest font-bold'
                        : 'bg-white border-soft-beige text-charcoal hover:bg-cream'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <Select
              label="Consultation Mode"
              value={bookingMode}
              onChange={(e) => setBookingMode(e.target.value as any)}
              options={[
                { value: 'Video Consultation', label: 'Encrypted HD Video Consultation' },
                { value: 'In-Clinic Visit', label: 'In-Person Clinic Visit (Bengaluru)' },
                { value: 'Audio/Chat', label: 'Audio & Secure Chat' },
              ]}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider">
                Chief Symptoms or Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                placeholder="Briefly describe what you would like to discuss with the Vaidya..."
                className="w-full rounded-xl border border-soft-beige bg-white p-2.5 text-xs text-charcoal focus:outline-none focus:border-forest"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-soft-beige">
              <Button type="button" variant="ghost" size="sm" onClick={() => setBookingDoctor(null)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" isLoading={isBooking}>
                Confirm & Pay ₹{bookingDoctor.consultationFeeINR}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
