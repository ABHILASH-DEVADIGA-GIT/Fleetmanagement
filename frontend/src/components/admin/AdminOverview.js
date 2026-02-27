import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Calendar, Users, Briefcase, Tag } from 'lucide-react';
import { Card } from '../ui/card';
import { useAuth } from '../../context/AuthContext';

export const AdminOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalServices: 0,
    activeOffers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [bookingsRes, servicesRes, offersRes] = await Promise.all([
          api.get('/admin/bookings'),
          api.get('/admin/services'),
          api.get('/admin/offers'),
        ]);
        setStats({
          totalBookings: bookingsRes.data.length,
          pendingBookings: bookingsRes.data.filter(b => b.status === 'pending').length,
          totalServices: servicesRes.data.length,
          activeOffers: offersRes.data.filter(o => o.status === 'active').length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'text-blue-500' },
    { label: 'Pending Bookings', value: stats.pendingBookings, icon: Users, color: 'text-yellow-500' },
    { label: 'Services', value: stats.totalServices, icon: Briefcase, color: 'text-green-500' },
    { label: 'Active Offers', value: stats.activeOffers, icon: Tag, color: 'text-purple-500' },
  ];

  return (
    <div data-testid="admin-overview">
      <h1 className="font-heading text-4xl font-bold mb-2">Welcome, {user?.full_name}</h1>
      <p className="font-body text-muted-foreground mb-8">Manage your photography business</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.label} className="p-6 bg-card border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-ui text-xs uppercase tracking-wider text-muted-foreground mb-2">{stat.label}</p>
                <p className="font-heading text-3xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className={`h-10 w-10 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
