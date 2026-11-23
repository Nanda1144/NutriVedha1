import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-forest">Connect With Us</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal">Get in Touch</h1>
        <p className="text-sm text-warm-brown max-w-xl mx-auto">
          Have inquiries regarding Ayurvedic consultations, clinical research, or organic farmer partnerships? Send us a message.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Sidebar */}
        <div className="space-y-4">
          <Card className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-forest" />
              <div>
                <p className="text-xs font-semibold text-charcoal">Email Us</p>
                <p className="text-xs text-warm-brown">support@nutrivedha.example</p>
              </div>
            </div>
          </Card>

          <Card className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-forest" />
              <div>
                <p className="text-xs font-semibold text-charcoal">Phone Helpline</p>
                <p className="text-xs text-warm-brown">+91 (080) 4920-8819</p>
              </div>
            </div>
          </Card>

          <Card className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-forest" />
              <div>
                <p className="text-xs font-semibold text-charcoal">Ecosystem HQ</p>
                <p className="text-xs text-warm-brown">Indiranagar 100ft Road, Bengaluru, Karnataka, India</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Form Area */}
        <div className="md:col-span-2">
          <Card className="p-6">
            {isSuccess ? (
              <div className="text-center py-10 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-forest mx-auto" />
                <h3 className="text-lg font-serif font-semibold text-charcoal">Message Received</h3>
                <p className="text-xs text-warm-brown max-w-sm mx-auto">
                  Thank you for reaching out. An Ayurvedic health specialist will respond to your inquiry within 24 hours.
                </p>
                <Button size="sm" variant="outline" onClick={() => setIsSuccess(false)} className="mt-4">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Aditi Sharma"
                />

                <Input
                  label="Email Address"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                />

                <Input
                  label="Subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Question regarding Pitta diet recommendations"
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can our clinical or botanical team assist you?"
                    className="w-full rounded-xl border border-soft-beige bg-white p-3 text-xs text-charcoal focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest shadow-earth-sm"
                  />
                </div>

                <Button type="submit" size="md" isLoading={isSubmitting} rightIcon={<Send className="w-4 h-4" />}>
                  Dispatch Message
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
