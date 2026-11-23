import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { UserLayout } from '../layouts/UserLayout';
import { PrivateRoute } from './PrivateRoute';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Public Pages
const Home = lazy(() => import('../pages/Home').then(m => ({ default: m.Home })));
const About = lazy(() => import('../pages/About').then(m => ({ default: m.About })));
const Services = lazy(() => import('../pages/Services').then(m => ({ default: m.Services })));
const Developers = lazy(() => import('../pages/Developers').then(m => ({ default: m.Developers })));
const Contact = lazy(() => import('../pages/Contact').then(m => ({ default: m.Contact })));
const Login = lazy(() => import('../pages/Login').then(m => ({ default: m.Login })));
const Signup = lazy(() => import('../pages/Signup').then(m => ({ default: m.Signup })));

// Protected User Pages
const Dashboard = lazy(() => import('../pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Profile = lazy(() => import('../pages/Profile').then(m => ({ default: m.Profile })));
const HealthScan = lazy(() => import('../pages/HealthScan').then(m => ({ default: m.HealthScan })));
const HealthReports = lazy(() => import('../pages/HealthReports').then(m => ({ default: m.HealthReports })));
const DietPlanner = lazy(() => import('../pages/DietPlanner').then(m => ({ default: m.DietPlanner })));
const RecipeGenerator = lazy(() => import('../pages/RecipeGenerator').then(m => ({ default: m.RecipeGenerator })));
const FoodIntelligence = lazy(() => import('../pages/FoodIntelligence').then(m => ({ default: m.FoodIntelligence })));
const FitnessYoga = lazy(() => import('../pages/FitnessYoga').then(m => ({ default: m.FitnessYoga })));
const Telemedicine = lazy(() => import('../pages/Telemedicine').then(m => ({ default: m.Telemedicine })));
const AiAssistant = lazy(() => import('../pages/AiAssistant').then(m => ({ default: m.AiAssistant })));
const SignLanguageAi = lazy(() => import('../pages/SignLanguageAi').then(m => ({ default: m.SignLanguageAi })));
const Marketplace = lazy(() => import('../pages/Marketplace').then(m => ({ default: m.Marketplace })));
const Cart = lazy(() => import('../pages/Cart').then(m => ({ default: m.Cart })));
const Checkout = lazy(() => import('../pages/Checkout').then(m => ({ default: m.Checkout })));
const Orders = lazy(() => import('../pages/Orders').then(m => ({ default: m.Orders })));
const DeliveryTracking = lazy(() => import('../pages/DeliveryTracking').then(m => ({ default: m.DeliveryTracking })));
const SavedItems = lazy(() => import('../pages/SavedItems').then(m => ({ default: m.SavedItems })));
const Notifications = lazy(() => import('../pages/Notifications').then(m => ({ default: m.Notifications })));
const GlobalSearch = lazy(() => import('../pages/GlobalSearch').then(m => ({ default: m.GlobalSearch })));
const Settings = lazy(() => import('../pages/Settings').then(m => ({ default: m.Settings })));
const NotFound = lazy(() => import('../pages/NotFound').then(m => ({ default: m.NotFound })));

const RouteLoading: React.FC = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <LoadingSpinner message="Loading Ayurvedic Intelligence..." />
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        {/* Public Website Layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected Authenticated User Dashboard Layout */}
        <Route
          element={
            <PrivateRoute>
              <UserLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/scan" element={<HealthScan />} />
          <Route path="/reports" element={<HealthReports />} />
          <Route path="/diet" element={<DietPlanner />} />
          <Route path="/recipes" element={<RecipeGenerator />} />
          <Route path="/food-intel" element={<FoodIntelligence />} />
          <Route path="/fitness" element={<FitnessYoga />} />
          <Route path="/telemedicine" element={<Telemedicine />} />
          <Route path="/ai-assistant" element={<AiAssistant />} />
          <Route path="/sign-ai" element={<SignLanguageAi />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id/track" element={<DeliveryTracking />} />
          <Route path="/saved" element={<SavedItems />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/search" element={<GlobalSearch />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Global Fallbacks */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
