import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, DollarSign, Receipt } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { toast } from 'sonner';

export const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentNotes, setPaymentNotes] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/admin/invoices');
      setInvoices(response.data);
    } catch (error) {
      console.error('Failed to fetch invoices');
    }
  };

  const handleAddPayment = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast.error('Invalid payment amount');
      return;
    }

    try {
      await api.post(`/admin/invoices/${selectedInvoice.invoice_id}/payments`, {
        amount: parseFloat(paymentAmount),
        payment_method: paymentMethod,
        notes: paymentNotes,
        payment_date: new Date().toISOString().split('T')[0]
      });
      toast.success('Payment recorded successfully');
      setPaymentDialogOpen(false);
      resetPaymentForm();
      fetchInvoices();
    } catch (error) {
      toast.error('Failed to record payment');
    }
  };

  const resetPaymentForm = () => {
    setPaymentAmount('');
    setPaymentMethod('cash');
    setPaymentNotes('');
    setSelectedInvoice(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'partially_paid': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div data-testid="invoice-management">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-4xl font-bold">Invoice & Billing</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-xs uppercase text-muted-foreground mb-1">Total Invoices</p>
              <p className="font-heading text-3xl font-bold">{invoices.length}</p>
            </div>
            <Receipt className="h-10 w-10 text-blue-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-xs uppercase text-muted-foreground mb-1">Total Revenue</p>
              <p className="font-heading text-3xl font-bold">₹{invoices.reduce((sum, inv) => sum + inv.total_amount, 0).toLocaleString()}</p>
            </div>
            <DollarSign className="h-10 w-10 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-xs uppercase text-muted-foreground mb-1">Pending Amount</p>
              <p className="font-heading text-3xl font-bold text-red-600">₹{invoices.reduce((sum, inv) => sum + inv.balance_due, 0).toLocaleString()}</p>
            </div>
            <DollarSign className="h-10 w-10 text-red-500" />
          </div>
        </Card>
      </div>

      <div className="bg-card border border-border rounded-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Paid Amount</TableHead>
              <TableHead>Balance Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map(invoice => (
              <TableRow key={invoice.invoice_id}>
                <TableCell className="font-semibold">{invoice.invoice_number}</TableCell>
                <TableCell>₹{invoice.total_amount.toLocaleString()}</TableCell>
                <TableCell className="text-green-600">₹{invoice.paid_amount.toLocaleString()}</TableCell>
                <TableCell className="text-red-600 font-semibold">₹{invoice.balance_due.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(invoice.issue_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {invoice.balance_due > 0 && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setPaymentAmount(invoice.balance_due.toString());
                        setPaymentDialogOpen(true);
                      }}
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Add Payment
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={paymentDialogOpen} onOpenChange={(value) => { setPaymentDialogOpen(value); if (!value) resetPaymentForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded">
                <p className="text-sm text-muted-foreground">Invoice: {selectedInvoice.invoice_number}</p>
                <p className="text-lg font-semibold">Balance Due: ₹{selectedInvoice.balance_due.toLocaleString()}</p>
              </div>
              <div>
                <Label>Payment Amount *</Label>
                <Input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  max={selectedInvoice.balance_due}
                />
              </div>
              <div>
                <Label>Payment Method</Label>
                <select className="w-full p-2 border rounded" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
              <div>
                <Label>Notes</Label>
                <Input value={paymentNotes} onChange={(e) => setPaymentNotes(e.target.value)} placeholder="Payment notes..." />
              </div>
              <Button onClick={handleAddPayment} className="w-full">Record Payment</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};