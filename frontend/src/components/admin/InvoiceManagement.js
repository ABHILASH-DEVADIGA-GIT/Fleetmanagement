import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { generateInvoicePDF } from '../../utils/pdfGenerator';
import { Plus, DollarSign, Receipt, Download, Edit, Trash2, Eye, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

export const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [leads, setLeads] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [createMode, setCreateMode] = useState('direct'); // 'direct' or 'quotation'
  const [selectedQuotation, setSelectedQuotation] = useState('');
  
  // Direct invoice form
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    event_date: '',
    notes: ''
  });
  const [items, setItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);

  // Payment form
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentNotes, setPaymentNotes] = useState('');

  useEffect(() => {
    fetchInvoices();
    fetchQuotations();
    fetchLeads();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/admin/invoices');
      setInvoices(response.data);
    } catch (error) {
      console.error('Failed to fetch invoices');
    }
  };

  const fetchQuotations = async () => {
    try {
      const response = await api.get('/admin/quotations');
      setQuotations(response.data.filter(q => q.status === 'accepted'));
    } catch (error) {
      console.error('Failed to fetch quotations');
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await api.get('/admin/leads');
      setLeads(response.data);
    } catch (error) {
      console.error('Failed to fetch leads');
    }
  };

  const addItem = () => {
    setItems([...items, { item_type: 'custom', name: '', price: 0, quantity: 1 }]);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === 'quantity' || field === 'price' ? parseFloat(value) || 0 : value;
    setItems(newItems);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = (subtotal * discount) / 100;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (afterDiscount * taxPercent) / 100;
    return { subtotal, discountAmount, taxAmount, total: afterDiscount + taxAmount };
  };

  const handleCreateFromQuotation = async () => {
    if (!selectedQuotation) {
      toast.error('Please select a quotation');
      return;
    }
    try {
      await api.post(`/admin/invoices/from-quotation/${selectedQuotation}`);
      toast.success('Invoice created from quotation');
      setCreateOpen(false);
      resetForm();
      fetchInvoices();
      fetchQuotations();
    } catch (error) {
      toast.error('Failed to create invoice');
    }
  };

  const handleCreateDirect = async () => {
    if (!formData.customer_name || !formData.customer_phone || items.length === 0) {
      toast.error('Please fill required fields and add items');
      return;
    }
    try {
      await api.post('/admin/invoices', {
        ...formData,
        items,
        discount_percentage: discount,
        tax_percentage: taxPercent
      });
      toast.success('Invoice created successfully');
      setCreateOpen(false);
      resetForm();
      fetchInvoices();
    } catch (error) {
      toast.error('Failed to create invoice');
    }
  };

  const handleDelete = async (invoiceId) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    try {
      await api.delete(`/admin/invoices/${invoiceId}`);
      toast.success('Invoice deleted');
      fetchInvoices();
    } catch (error) {
      toast.error('Failed to delete invoice');
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
      toast.success('Payment recorded');
      setPaymentOpen(false);
      resetPaymentForm();
      fetchInvoices();
      // Update view if open
      if (viewOpen) {
        const updated = await api.get('/admin/invoices');
        const inv = updated.data.find(i => i.invoice_id === selectedInvoice.invoice_id);
        if (inv) setSelectedInvoice(inv);
      }
    } catch (error) {
      toast.error('Failed to record payment');
    }
  };

  const handleDownload = async (invoiceId) => {
    try {
      const response = await api.get(`/admin/invoices/${invoiceId}/pdf-data`);
      generateInvoicePDF(response.data);
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };

  const resetForm = () => {
    setFormData({ customer_name: '', customer_phone: '', customer_email: '', event_date: '', notes: '' });
    setItems([]);
    setDiscount(0);
    setTaxPercent(0);
    setSelectedQuotation('');
    setCreateMode('direct');
  };

  const resetPaymentForm = () => {
    setPaymentAmount('');
    setPaymentMethod('cash');
    setPaymentNotes('');
    setSelectedInvoice(null);
  };

  const getLeadName = (leadId) => {
    const lead = leads.find(l => l.lead_id === leadId);
    return lead ? lead.name : 'Unknown';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'partially_paid': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-red-100 text-red-700';
    }
  };

  const { subtotal, discountAmount, taxAmount, total } = calculateTotal();
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total_amount, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paid_amount, 0);
  const totalPending = invoices.reduce((sum, inv) => sum + inv.balance_due, 0);

  return (
    <div data-testid="invoice-management" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Invoices & Billing</h1>
          <p className="text-muted-foreground mt-1">Manage invoices and track payments</p>
        </div>
        <Button onClick={() => { resetForm(); setCreateOpen(true); }} data-testid="create-invoice-btn">
          <Plus className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Total Invoices</p>
              <p className="text-2xl font-bold">{invoices.length}</p>
            </div>
            <Receipt className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Total Revenue</p>
              <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Received</p>
              <p className="text-2xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Pending</p>
              <p className="text-2xl font-bold text-red-600">₹{totalPending.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Invoices List */}
      <div className="grid gap-4">
        {invoices.length === 0 ? (
          <Card className="p-12 text-center">
            <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Invoices Yet</h3>
            <p className="text-muted-foreground mb-4">Create your first invoice to get started</p>
            <Button onClick={() => { resetForm(); setCreateOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </Card>
        ) : (
          invoices.map(invoice => (
            <Card key={invoice.invoice_id} className="p-6" data-testid={`invoice-${invoice.invoice_id}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{invoice.invoice_number}</h3>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Customer: <span className="font-medium text-foreground">{getLeadName(invoice.lead_id)}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Issue Date: {new Date(invoice.issue_date).toLocaleDateString()}
                    {invoice.event_date && ` • Event: ${new Date(invoice.event_date).toLocaleDateString()}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">₹{invoice.total_amount.toLocaleString()}</p>
                  <p className="text-sm">
                    <span className="text-green-600">Paid: ₹{invoice.paid_amount.toLocaleString()}</span>
                    {invoice.balance_due > 0 && (
                      <span className="text-red-600 ml-3">Due: ₹{invoice.balance_due.toLocaleString()}</span>
                    )}
                  </p>
                  <div className="flex gap-2 mt-3 justify-end">
                    <Button variant="outline" size="sm" onClick={() => { setSelectedInvoice(invoice); setViewOpen(true); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {invoice.balance_due > 0 && (
                      <Button size="sm" onClick={() => { setSelectedInvoice(invoice); setPaymentAmount(invoice.balance_due.toString()); setPaymentOpen(true); }}>
                        <Plus className="h-4 w-4 mr-1" />
                        Payment
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleDownload(invoice.invoice_id)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(invoice.invoice_id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Invoice Dialog */}
      <Dialog open={createOpen} onOpenChange={(value) => { setCreateOpen(value); if (!value) resetForm(); }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Create Invoice</DialogTitle>
          </DialogHeader>
          
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6">
            <Button 
              variant={createMode === 'direct' ? 'default' : 'outline'}
              onClick={() => setCreateMode('direct')}
            >
              Direct Invoice
            </Button>
            <Button 
              variant={createMode === 'quotation' ? 'default' : 'outline'}
              onClick={() => setCreateMode('quotation')}
              disabled={quotations.length === 0}
            >
              From Quotation ({quotations.length})
            </Button>
          </div>

          {createMode === 'quotation' ? (
            <div className="space-y-4">
              <div>
                <Label>Select Accepted Quotation</Label>
                <Select value={selectedQuotation} onValueChange={setSelectedQuotation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a quotation" />
                  </SelectTrigger>
                  <SelectContent>
                    {quotations.map(q => (
                      <SelectItem key={q.quotation_id} value={q.quotation_id}>
                        {q.quotation_number} - ₹{q.total_amount.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateFromQuotation} disabled={!selectedQuotation} className="w-full">
                Create Invoice from Quotation
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Details */}
              <div className="space-y-4">
                <h3 className="font-semibold">Customer Details</h3>
                <div>
                  <Label>Customer Name *</Label>
                  <Input
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <Label>Event Date</Label>
                  <Input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>

              {/* Items & Total */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Invoice Items</h3>
                  <Button variant="outline" size="sm" onClick={addItem}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-[250px] overflow-y-auto">
                  {items.map((item, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          value={item.name}
                          onChange={(e) => updateItem(index, 'name', e.target.value)}
                          placeholder="Item description"
                          className="flex-1"
                        />
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => removeItem(index)}
                          className="text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Label className="text-xs">Price</Label>
                          <Input
                            type="number"
                            value={item.price}
                            onChange={(e) => updateItem(index, 'price', e.target.value)}
                            className="h-8"
                          />
                        </div>
                        <div className="w-20">
                          <Label className="text-xs">Qty</Label>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                            min={1}
                            className="h-8"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Card className="p-4 bg-muted">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">Discount %</Label>
                      <Input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                        className="h-8 w-20"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">Tax %</Label>
                      <Input
                        type="number"
                        value={taxPercent}
                        onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                        className="h-8 w-20"
                      />
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-2 border-t">
                      <span>Total</span>
                      <span className="text-primary">₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </Card>

                <Button 
                  onClick={handleCreateDirect} 
                  className="w-full"
                  disabled={!formData.customer_name || !formData.customer_phone || items.length === 0}
                >
                  Create Invoice
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Invoice Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              {selectedInvoice?.invoice_number}
              <Badge className={getStatusColor(selectedInvoice?.status)}>
                {selectedInvoice?.status.replace('_', ' ')}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-semibold">{getLeadName(selectedInvoice.lead_id)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Issue Date</p>
                  <p className="font-semibold">{new Date(selectedInvoice.issue_date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm">Item</th>
                      <th className="px-4 py-3 text-center text-sm">Qty</th>
                      <th className="px-4 py-3 text-right text-sm">Price</th>
                      <th className="px-4 py-3 text-right text-sm">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items?.map((item, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-3">{item.name}</td>
                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">₹{item.price?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-semibold">₹{(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{selectedInvoice.subtotal?.toLocaleString()}</span>
                  </div>
                  {selectedInvoice.discount_amount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{selectedInvoice.discount_amount?.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedInvoice.tax_amount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>₹{selectedInvoice.tax_amount?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>₹{selectedInvoice.total_amount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Paid</span>
                    <span>₹{selectedInvoice.paid_amount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-red-600 font-bold">
                    <span>Balance Due</span>
                    <span>₹{selectedInvoice.balance_due?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment History */}
              {selectedInvoice.payments && selectedInvoice.payments.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Payment History</h4>
                  <div className="space-y-2">
                    {selectedInvoice.payments.map((p, idx) => (
                      <div key={idx} className="flex justify-between p-3 bg-green-50 rounded-lg">
                        <span>
                          {new Date(p.payment_date).toLocaleDateString()} - {p.payment_method || 'N/A'}
                          {p.notes && <span className="text-muted-foreground ml-2">({p.notes})</span>}
                        </span>
                        <span className="font-semibold text-green-600">₹{p.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                {selectedInvoice.balance_due > 0 && (
                  <Button onClick={() => { setPaymentAmount(selectedInvoice.balance_due.toString()); setPaymentOpen(true); }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Payment
                  </Button>
                )}
                <Button variant="outline" onClick={() => handleDownload(selectedInvoice.invoice_id)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Payment Dialog */}
      <Dialog open={paymentOpen} onOpenChange={(value) => { setPaymentOpen(value); if (!value) resetPaymentForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Invoice: {selectedInvoice.invoice_number}</p>
                <p className="text-lg font-semibold">Balance Due: ₹{selectedInvoice.balance_due?.toLocaleString()}</p>
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
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Notes</Label>
                <Input 
                  value={paymentNotes} 
                  onChange={(e) => setPaymentNotes(e.target.value)} 
                  placeholder="Payment notes..."
                />
              </div>
              <Button onClick={handleAddPayment} className="w-full">Record Payment</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
