import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Calendar, Users, Briefcase, Tag, DollarSign, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';

export const AdminOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_revenue_month: 0,
    events_this_month: 0,
    pending_payments: 0,
    upcoming_events: [],
    new_leads_count: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      label: 'Revenue This Month', 
      value: `₹${stats.total_revenue_month.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      link: '/admin/invoices'
    },
    { 
      label: 'Events This Month', 
      value: stats.events_this_month, 
      icon: Calendar, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      link: '/admin/calendar'
    },
    { 
      label: 'Pending Payments', 
      value: `₹${stats.pending_payments.toLocaleString()}`, 
      icon: AlertCircle, 
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      link: '/admin/invoices'
    },
    { 
      label: 'New Leads', 
      value: stats.new_leads_count, 
      icon: Users, 
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      link: '/admin/leads'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div data-testid="admin-overview">
      <h1 className="font-heading text-4xl font-bold mb-2">Welcome, {user?.full_name}</h1>
      <p className="font-body text-muted-foreground mb-8">Here's what's happening with your business today</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.label} to={stat.link}>
            <Card className={`p-6 bg-card border border-border hover:shadow-lg transition-shadow cursor-pointer ${stat.bgColor}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-ui text-xs uppercase tracking-wider text-muted-foreground mb-2">{stat.label}</p>
                  <p className="font-heading text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-4 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold">Upcoming Events</h2>
            <Link to="/admin/calendar">
              <Button variant="outline" size="sm">View Calendar</Button>
            </Link>
          </div>
          
          {stats.upcoming_events.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No upcoming events in the next 7 days</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.upcoming_events.slice(0, 5).map((event) => (
                <div key={event.event_id} className="flex items-start justify-between border-b border-border pb-4 last:border-0">
                  <div className="flex-1">
                    <p className="font-ui font-semibold">{event.name}</p>
                    <p className="font-body text-sm text-muted-foreground capitalize">{event.event_type}</p>
                    <p className="font-body text-xs text-muted-foreground mt-1">
                      {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {event.event_time && ` at ${event.event_time}`}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-ui uppercase tracking-wider ${
                    event.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    event.status === 'inquiry' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                  }`}>
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6 bg-card border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Link to="/admin/leads">
              <Button className="w-full h-24 flex flex-col items-center justify-center gap-2" variant="outline">
                <Users className="h-6 w-6" />
                <span className="font-ui text-sm">Add Lead</span>
              </Button>
            </Link>
            <Link to="/admin/packages">
              <Button className="w-full h-24 flex flex-col items-center justify-center gap-2" variant="outline">
                <Briefcase className="h-6 w-6" />
                <span className="font-ui text-sm">Create Package</span>
              </Button>
            </Link>
            <Link to="/admin/quotations">
              <Button className="w-full h-24 flex flex-col items-center justify-center gap-2" variant="outline">
                <Tag className="h-6 w-6" />
                <span className="font-ui text-sm">New Quotation</span>
              </Button>
            </Link>
            <Link to="/admin/calendar">
              <Button className="w-full h-24 flex flex-col items-center justify-center gap-2" variant="outline">
                <Calendar className="h-6 w-6" />
                <span className="font-ui text-sm">View Calendar</span>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
