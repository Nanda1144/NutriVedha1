import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';
import { useAuthStore } from '../../store/useAuthStore';

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Developers', path: '/developers' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-white/95 via-[#FAFDF6]/95 to-[#EFF6E7]/95 backdrop-blur-md border-b border-soft-beige shadow-earth-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-dark via-forest to-teal flex items-center justify-center text-white shadow-earth-md group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5 text-mint" />
          </div>
          <div>
            <span className="text-xl font-display font-bold text-forest tracking-tight">NutriVedha</span>
            <span className="block text-[10px] uppercase tracking-widest text-warm-brown font-semibold">Ayurvedic Intelligence</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'text-forest font-semibold border-b-2 border-teal pb-0.5'
                  : 'text-charcoal/80 hover:text-teal'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Dashboard ({user?.fullName.split(' ')[0]})
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-charcoal hover:bg-cream"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-soft-beige px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                isActive(link.path)
                  ? 'bg-cream text-forest font-semibold'
                  : 'text-charcoal hover:bg-cream/60'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-soft-beige flex flex-col gap-2">
            {isAuthenticated ? (
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Open User Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Create Free Account</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
