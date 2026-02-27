import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, FileText, Eye, Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

export const QuotationManagement = () => {
  const [quotations, setQuotations] = useState([]);
  const [leads, setLeads] = useState([]);
  const [packages, setPackages] = useState([]);
  const [addons, setAddons] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchQuotations();
    fetchLeads();
    fetchPackages();
    fetchAddons();
  }, []);

  const fetchQuotations = async () => {
    try {
      const response = await api.get('/admin/quotations');
      setQuotations(response.data);
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

  const fetchPackages = async () => {
    try {
      const response = await api.get('/admin/packages');
      setPackages(response.data);
    } catch (error) {
      console.error('Failed to fetch packages');
    }
  };

  const fetchAddons = async () => {
    try {
      const response = await api.get('/admin/addons');
      setAddons(response.data);
    } catch (error) {
      console.error('Failed to fetch add-ons');
    }
  };

  const addItem = (type, item) => {
    setSelectedItems([...selectedItems, {
      item_type: type,
      item_id: item.package_id || item.addon_id,
      name: item.name,
      price: item.base_price || item.price,
      quantity: 1
    }]);
  };

  const updateQuantity = (index, delta) => {
    const newItems = [...selectedItems];
    newItems[index].quantity = Math.max(1, newItems[index].quantity + delta);
    setSelectedItems(newItems);
  };

  const removeItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = (subtotal * discount) / 100;
    return { subtotal, discountAmount, total: subtotal - discountAmount };
  };

  const handleSubmit = async () => {
    if (!selectedLead || selectedItems.length === 0) {
      toast.error('Please select a lead and add items');
      return;
    }

    try {
      await api.post('/admin/quotations', {
        lead_id: selectedLead,
        items: selectedItems,
        discount_percentage: discount,
        discount_amount: 0,
        tax_percentage: 0,
        notes
      });
      toast.success('Quotation created successfully');
      setOpen(false);
      resetForm();
      fetchQuotations();
    } catch (error) {
      toast.error('Failed to create quotation');
    }
  };

  const resetForm = () => {
    setSelectedLead('');
    setSelectedItems([]);
    setDiscount(0);
    setNotes('');
  };

  const { subtotal, discountAmount, total } = calculateTotal();

  return (
    <div data-testid="quotation-management">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-4xl font-bold">Quotation Management</h1>
        <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="font-ui uppercase tracking-wider">
              <Plus className="mr-2 h-4 w-4" />
              Create Quotation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl">Create Quotation</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                <div>
                  <Label>Select Lead</Label>
                  <Select value={selectedLead} onValueChange={setSelectedLead}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a lead" />
                    </SelectTrigger>
                    <SelectContent>
                      {leads.map(lead => (
                        <SelectItem key={lead.lead_id} value={lead.lead_id}>
                          {lead.name} - {lead.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="font-ui font-semibold mb-3">Add Packages</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {packages.map(pkg => (
                      <Card key={pkg.package_id} className="p-3 cursor-pointer hover:bg-muted" onClick={() => addItem('package', pkg)}>
                        <p className="font-ui font-semibold text-sm">{pkg.name}</p>
                        <p className="font-ui text-primary">₹{pkg.base_price}</p>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-ui font-semibold mb-3">Add-ons</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {addons.map(addon => (
                      <Card key={addon.addon_id} className="p-3 cursor-pointer hover:bg-muted" onClick={() => addItem('addon', addon)}>
                        <p className="font-ui font-semibold text-sm">{addon.name}</p>
                        <p className="font-ui text-primary">₹{addon.price}</p>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Notes</Label>
                  <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." />
                </div>
              </div>

              <div className="space-y-6">
                <Card className="p-4">
                  <h3 className="font-ui font-semibold mb-3">Selected Items</h3>
                  {selectedItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No items selected</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm border-b pb-2">
                          <div className="flex-1">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-xs text-muted-foreground">₹{item.price} × {item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="outline" onClick={() => updateQuantity(index, -1)}>-</Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button size="sm" variant="outline" onClick={() => updateQuantity(index, 1)}>+</Button>
                            <Button size="sm" variant="ghost" onClick={() => removeItem(index)}>×</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                <Card className="p-4 bg-muted">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-ui">Subtotal</span>
                      <span className="font-ui font-semibold">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div>
                      <Label className="text-xs">Discount (%)</Label>
                      <Input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span className="font-ui text-sm">Discount</span>
                        <span className="font-ui text-sm">-₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-3 border-t">
                      <span className="font-heading">Total</span>
                      <span className="font-heading text-primary">₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </Card>

                <Button onClick={handleSubmit} className="w-full" disabled={!selectedLead || selectedItems.length === 0}>
                  Create Quotation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quotation #</TableHead>
              <TableHead>Lead</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotations.map(quote => (
              <TableRow key={quote.quotation_id}>
                <TableCell className="font-semibold">{quote.quotation_number}</TableCell>
                <TableCell>{quote.lead_id}</TableCell>
                <TableCell>₹{quote.total_amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={quote.status === 'accepted' ? 'default' : 'secondary'}>
                    {quote.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(quote.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm"><Eye className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="sm"><Send className="h-3 w-3" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};