import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="space-y-5 max-w-md">
        <div className="w-16 h-16 rounded-3xl bg-forest/10 text-forest flex items-center justify-center mx-auto">
          <Leaf className="w-8 h-8 text-forest" />
        </div>
        <h1 className="text-4xl font-serif font-bold text-charcoal">404</h1>
        <h2 className="text-lg font-semibold text-charcoal">Pathway Not Found</h2>
        <p className="text-xs text-warm-brown leading-relaxed">
          The requested Ayurvedic wellness coordinate does not exist or has been harmoniously relocated.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link to="/">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button size="sm">
              User Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
