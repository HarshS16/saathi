import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DemoNavigation: React.FC = () => {
  const location = useLocation();

  const routes = [
    { path: '/', label: 'Landing Page', category: 'Public' },
    { path: '/login', label: 'Login Page', category: 'Public' },
    { path: '/otp-verification', label: 'OTP Verification', category: 'Public' },
    { path: '/patient/dashboard', label: 'Patient Dashboard', category: 'Patient' },
    { path: '/patient/find-doctor', label: 'Find Doctor', category: 'Patient' },
    { path: '/patient/book-appointment', label: 'Book Appointment', category: 'Patient' },
    { path: '/patient/appointments', label: 'Appointments History', category: 'Patient' },
    { path: '/patient/profile', label: 'Patient Profile', category: 'Patient' },
    { path: '/patient/symptomatic-analysis', label: 'Symptomatic Analysis', category: 'Patient' },
    { path: '/patient/medicine-approval', label: 'Medicine Approval Request', category: 'Patient' },
    { path: '/patient/vitals', label: 'Vitals Metrics', category: 'Patient' },
    { path: '/patient/daily-meds', label: 'Daily Meds', category: 'Patient' },
    { path: '/patient/report-analyzer', label: 'Medical Report Analyzer', category: 'Patient' },
    { path: '/patient/meds-availability', label: 'Meds Availability', category: 'Patient' },
    { path: '/doctor/dashboard', label: 'Doctor Dashboard', category: 'Doctor' },
    { path: '/doctor/schedule', label: 'Doctor Schedule', category: 'Doctor' },
    { path: '/doctor/consultation', label: 'Video Consultation', category: 'Doctor' },
    { path: '/doctor/medicine-approval', label: 'Medicine Approval', category: 'Doctor' },
    { path: '/pharmacy/inventory', label: 'Inventory Management', category: 'Pharmacy' },
  ];

  const categories = ['Public', 'Patient', 'Doctor', 'Pharmacy'];

  return (
    <Card className="fixed top-4 right-4 w-80 z-50 max-h-96 overflow-y-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Demo Navigation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {categories.map(category => (
          <div key={category}>
            <h4 className="text-xs font-semibold text-muted-foreground mb-1">{category}</h4>
            <div className="space-y-1">
              {routes
                .filter(route => route.category === category)
                .map(route => (
                  <Link key={route.path} to={route.path}>
                    <Button
                      variant={location.pathname === route.path ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start text-xs h-7"
                    >
                      {route.label}
                    </Button>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DemoNavigation;