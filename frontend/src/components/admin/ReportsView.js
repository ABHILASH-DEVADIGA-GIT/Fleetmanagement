import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { TrendingUp, Users, DollarSign, Calendar, FileText } from 'lucide-react';
import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export const ReportsView = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [conversion, setConversion] = useState(null);
  const [eventProfit, setEventProfit] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [selectedYear]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [revenue, pending, conv, profit] = await Promise.all([
        api.get(`/admin/reports/revenue?period=monthly&year=${selectedYear}`).catch(() => ({ data: [] })),
        api.get('/admin/reports/pending-payments').catch(() => ({ data: [] })),
        api.get('/admin/reports/lead-conversion').catch(() => ({ data: null })),
        api.get('/admin/reports/event-profit').catch(() => ({ data: [] }))
      ]);
      setRevenueData(revenue.data || []);
      setPendingPayments(pending.data || []);
      setConversion(conv.data);
      setEventProfit(profit.data || []);
    } catch (error) {
      console.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `₹${(value || 0).toLocaleString()}`;
  };

  const totalRevenue = revenueData.reduce((sum, r) => sum + (r?.total_revenue || 0), 0);
  const totalPaid = revenueData.reduce((sum, r) => sum + (r?.total_paid || 0), 0);
  const totalPending = pendingPayments.reduce((sum, p) => sum + (p?.balance_due || 0), 0);
  const totalProfit = eventProfit.reduce((sum, e) => sum + (e?.profit || 0), 0);

  const getMonthName = (monthNum) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[parseInt(monthNum) - 1] || monthNum;
  };

  return (
    <div data-testid="reports-view" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Business Reports</h1>
          <p className="text-muted-foreground mt-1">Track your business performance</p>
        </div>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-muted-foreground mb-1">Collected</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-muted-foreground mb-1">Pending</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalPending)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-muted-foreground mb-1">Total Profit</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalProfit)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
      </div>

      {/* Lead Conversion */}
      {conversion && (
        <Card className="p-6">
          <h2 className="font-semibold text-xl mb-4">Lead Conversion</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Leads</p>
              <p className="text-3xl font-bold">{conversion.total_leads || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confirmed</p>
              <p className="text-3xl font-bold text-green-600">{conversion.confirmed_leads || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lost</p>
              <p className="text-3xl font-bold text-red-600">{conversion.lost_leads || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-3xl font-bold text-primary">{conversion.conversion_rate || 0}%</p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <Card className="p-6">
          <h2 className="font-semibold text-xl mb-4">Monthly Revenue ({selectedYear})</h2>
          {revenueData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No revenue data for {selectedYear}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {revenueData.map(month => (
                <div key={month._id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">{getMonthName(month._id)}</span>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(month.total_revenue)}</p>
                    <p className="text-xs text-green-600">Paid: {formatCurrency(month.total_paid)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Event Profitability */}
        <Card className="p-6">
          <h2 className="font-semibold text-xl mb-4">Event Profitability</h2>
          {eventProfit.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No completed events yet</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {eventProfit.slice(0, 10).map(event => (
                <div key={event.event_id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{event.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.event_date ? new Date(event.event_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600">Revenue: {formatCurrency(event.revenue)}</p>
                    <p className="text-sm text-red-600">Expenses: {formatCurrency(event.total_expenses)}</p>
                    <p className="font-semibold text-blue-600">Profit: {formatCurrency(event.profit)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Pending Payments */}
      {pendingPayments.length > 0 && (
        <Card className="p-6">
          <h2 className="font-semibold text-xl mb-4">Pending Payments</h2>
          <div className="space-y-3">
            {pendingPayments.slice(0, 10).map(invoice => (
              <div key={invoice.invoice_id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="font-medium">{invoice.invoice_number}</p>
                  <p className="text-xs text-muted-foreground">
                    Issue Date: {invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">Total: {formatCurrency(invoice.total_amount)}</p>
                  <p className="font-semibold text-red-600">Due: {formatCurrency(invoice.balance_due)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
