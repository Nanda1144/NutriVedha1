import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-cream flex items-center justify-center text-forest mb-4 border border-sand/60">
        <ShieldAlert className="w-8 h-8 text-warm-brown" />
      </div>
      <h1 className="font-serif text-2xl font-bold text-forest mb-1">Administrative Route Not Found</h1>
      <p className="text-xs text-warm-brown max-w-sm mb-6 leading-relaxed">
        The requested system control endpoint does not exist or has been relocated under a stricter RBAC gate.
      </p>
      <Link to="/admin-control">
        <Button variant="primary" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
          Return to Control Center
        </Button>
      </Link>
    </div>
  );
};
