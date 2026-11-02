import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { Login } from './pages/Login';
import { Login1 } from './pages/Login1';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { Account } from './pages/Account';
import { Documentation } from './pages/Documentation';
import { Contact } from './pages/Contact';
import { LegalPages } from './pages/LegalPages';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Deploy } from './pages/Deploy';
import { Stock } from './pages/Stock';
import { Billing } from './pages/Billing';
import { Waitlist } from './pages/Waitlist';
import { PublicWaitlist } from './components/waitlist/public/PublicWaitlist';
import { authService } from './services/auth.service';
import { Account1 } from './pages/Account1';
import { AuthorityX } from './pages/7ea-authorityX';
import { UniverseX_Page } from './pages/7ea-universeX';
import { PDash } from './components/universex/pages/Marketplace/PDash';
import { AuthXLogin } from './components/authx/login/auth';
import { AuthXApplications } from './components/authx/pages/AuthXApplications';
import { SinglePage as AuthXSinglePage } from './components/authx/pages/sections/SinglePage';
import { DataHubPage } from './pages/datahub';
import { DataHubDashboard } from './components/d/DataHubDashboard';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return authService.isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen w-full bg-white dark:bg-black transition-colors duration-300">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
                <Header />
                <HeroSection />
              </div>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/login1" element={<Login1 />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/forgot-password/code" element={<ForgotPassword />} />
            <Route path="/forgot-password/code/:token" element={<ForgotPassword />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/:pageId" element={<LegalPages />} />
            <Route path="/p/:projectId" element={<PublicWaitlist />} />

            {/* AuthX Routes */}
            <Route path="/authority" element={<AuthorityX />} />
            <Route path="/authority/p/:appId" element={<AuthXLogin />} />
            <Route path="/authority/apps" element={<AuthorityX />} />
            <Route path="/authority/apps/:appId" element={<AuthXSinglePage />} />

            {/* UniverseX Routes */}
            <Route path="/universe" element={<UniverseX_Page />} />
            <Route path="/universe/m/:id" element={<PDash />} />

            {/* Protected routes with dashboard layout */}
            <Route
              element={
                <PrivateRoute>
                  <div className="flex flex-col lg:flex-row min-h-screen">
                    <DashboardLayout />
                  </div>
                </PrivateRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/account" element={<Account1 />} />
              <Route path="/deploy" element={<Deploy />} />
              <Route path="/stock" element={<Stock />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/waitlist" element={<Waitlist />} />
              <Route path="/waitlist/:projectId" element={<Waitlist />} />
              <Route path="/datahub" element={<DataHubPage />} />
              <Route path="/datahub/b/:id" element={<DataHubDashboard />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}