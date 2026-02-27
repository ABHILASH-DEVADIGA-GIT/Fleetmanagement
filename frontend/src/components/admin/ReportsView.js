import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export const ReportsView = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [conversion, setConversion] = useState(null);
  const [eventProfit, setEventProfit] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchReports();
  }, [selectedYear]);

  const fetchReports = async () => {
    try {
      const [revenue, pending, conv, profit] = await Promise.all([
        api.get(`/admin/reports/revenue?period=monthly&year=${selectedYear}`),
        api.get('/admin/reports/pending-payments'),
        api.get('/admin/reports/lead-conversion'),
        api.get('/admin/reports/event-profit')
      ]);
      setRevenueData(revenue.data);
      setPendingPayments(pending.data);
      setConversion(conv.data);
      setEventProfit(profit.data);
    } catch (error) {
      console.error('Failed to fetch reports');
    }
  };

  const totalRevenue = revenueData.reduce((sum, r) => sum + r.total_revenue, 0);
  const totalPaid = revenueData.reduce((sum, r) => sum + r.total_paid, 0);
  const totalPending = pendingPayments.reduce((sum, p) => sum + p.balance_due, 0);
  const totalProfit = eventProfit.reduce((sum, e) => sum + e.profit, 0);

  return (
    <div data-testid="reports-view">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-4xl font-bold">Business Reports</h1>
        <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[2026, 2025, 2024].map(year => (
              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-xs uppercase text-muted-foreground mb-1">Total Revenue</p>
              <p className="font-heading text-3xl font-bold">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-10 w-10 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-xs uppercase text-muted-foreground mb-1">Collected</p>
              <p className="font-heading text-3xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-xs uppercase text-muted-foreground mb-1">Pending</p>
              <p className="font-heading text-3xl font-bold text-red-600">₹{totalPending.toLocaleString()}</p>
            </div>
            <DollarSign className="h-10 w-10 text-red-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-xs uppercase text-muted-foreground mb-1">Total Profit</p>
              <p className="font-heading text-3xl font-bold text-blue-600">₹{totalProfit.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-blue-500" />
          </div>
        </Card>
      </div>

      {conversion && (
        <Card className="p-6 mb-8">
          <h2 className="font-heading text-2xl font-bold mb-4">Lead Conversion</h2>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="font-ui text-sm text-muted-foreground">Total Leads</p>
              <p className="font-heading text-3xl font-bold">{conversion.total_leads}</p>
            </div>
            <div>
              <p className="font-ui text-sm text-muted-foreground">Confirmed</p>
              <p className="font-heading text-3xl font-bold text-green-600">{conversion.confirmed_leads}</p>
            </div>
            <div>
              <p className="font-ui text-sm text-muted-foreground">Lost</p>
              <p className="font-heading text-3xl font-bold text-red-600">{conversion.lost_leads}</p>
            </div>
            <div>
              <p className="font-ui text-sm text-muted-foreground">Conversion Rate</p>
              <p className="font-heading text-3xl font-bold text-primary">{conversion.conversion_rate}%</p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="font-heading text-2xl font-bold mb-4">Monthly Revenue</h2>
          <div className="space-y-3">
            {revenueData.map(month => (
              <div key={month._id} className="flex items-center justify-between p-3 bg-muted rounded">
                <span className="font-ui">Month {month._id}</span>
                <div className="text-right">
                  <p className="font-ui font-semibold">₹{month.total_revenue.toLocaleString()}</p>
                  <p className="font-ui text-xs text-green-600">Paid: ₹{month.total_paid.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-heading text-2xl font-bold mb-4">Event Profitability</h2>
          <div className="space-y-3">
            {eventProfit.slice(0, 10).map(event => (
              <div key={event.event_id} className="flex items-center justify-between p-3 bg-muted rounded">
                <div>
                  <p className="font-ui font-semibold">{event.name}</p>
                  <p className="font-ui text-xs text-muted-foreground">{new Date(event.event_date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-ui text-sm text-green-600">Revenue: ₹{event.revenue.toLocaleString()}</p>
                  <p className="font-ui text-sm text-red-600">Expenses: ₹{event.total_expenses.toLocaleString()}</p>
                  <p className="font-ui font-semibold text-blue-600">Profit: ₹{event.profit.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};