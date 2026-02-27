import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Users, Building, Calendar, TrendingUp } from 'lucide-react';
import { Card } from '../ui/card';

export const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [clientsRes, usersRes] = await Promise.all([
          api.get('/super-admin/clients'),
          api.get('/admin/users'),
        ]);
        setStats({
          totalClients: clientsRes.data.length,
          activeClients: clientsRes.data.filter(c => c.status === 'active').length,
          totalUsers: usersRes.data.length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Clients', value: stats.totalClients, icon: Building, color: 'text-blue-500' },
    { label: 'Active Clients', value: stats.activeClients, icon: TrendingUp, color: 'text-green-500' },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-purple-500' },
  ];

  return (
    <div data-testid="dashboard-overview">
      <h1 className="font-heading text-4xl font-bold mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.label} className="p-6 bg-card border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-ui text-xs uppercase tracking-wider text-muted-foreground mb-2">{stat.label}</p>
                <p className="font-heading text-3xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className={`h-12 w-12 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
