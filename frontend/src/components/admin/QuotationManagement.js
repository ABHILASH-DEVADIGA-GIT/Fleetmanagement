import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { generateQuotationPDF } from '../../utils/pdfGenerator';
import { Plus, FileText, Eye, Send, Edit, Trash2, Download, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

export const QuotationManagement = () => {
  const [quotations, setQuotations] = useState([]);
  const [leads, setLeads] = useState([]);
  const [packages, setPackages] = useState([]);
  const [addons, setAddons] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedLead, setSelectedLead] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);
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
    const existingIndex = selectedItems.findIndex(
      si => si.item_id === (item.package_id || item.addon_id) && si.item_type === type
    );
    
    if (existingIndex >= 0) {
      const newItems = [...selectedItems];
      newItems[existingIndex].quantity += 1;
      setSelectedItems(newItems);
    } else {
      setSelectedItems([...selectedItems, {
        item_type: type,
        item_id: item.package_id || item.addon_id,
        name: item.name,
        price: item.base_price || item.price,
        quantity: 1
      }]);
    }
  };

  const addCustomItem = () => {
    setSelectedItems([...selectedItems, {
      item_type: 'custom',
      item_id: null,
      name: 'Custom Item',
      price: 0,
      quantity: 1
    }]);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...selectedItems];
    newItems[index][field] = field === 'quantity' || field === 'price' ? parseFloat(value) || 0 : value;
    setSelectedItems(newItems);
  };

  const removeItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = (subtotal * discount) / 100;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (afterDiscount * taxPercent) / 100;
    return { subtotal, discountAmount, taxAmount, total: afterDiscount + taxAmount };
  };

  const handleSubmit = async () => {
    if (!selectedLead || selectedItems.length === 0) {
      toast.error('Please select a lead and add items');
      return;
    }

    try {
      const payload = {
        lead_id: selectedLead,
        items: selectedItems,
        discount_percentage: discount,
        discount_amount: 0,
        tax_percentage: taxPercent,
        notes
      };

      if (editMode && selectedQuotation) {
        await api.put(`/admin/quotations/${selectedQuotation.quotation_id}`, payload);
        toast.success('Quotation updated successfully');
      } else {
        await api.post('/admin/quotations', payload);
        toast.success('Quotation created successfully');
      }
      
      setCreateOpen(false);
      resetForm();
      fetchQuotations();
    } catch (error) {
      toast.error('Failed to save quotation');
    }
  };

  const handleDelete = async (quotationId) => {
    if (!window.confirm('Are you sure you want to delete this quotation?')) return;
    try {
      await api.delete(`/admin/quotations/${quotationId}`);
      toast.success('Quotation deleted');
      fetchQuotations();
    } catch (error) {
      toast.error('Failed to delete quotation');
    }
  };

  const handleStatusChange = async (quotationId, newStatus) => {
    try {
      await api.put(`/admin/quotations/${quotationId}/status`, { status: newStatus });
      toast.success('Status updated');
      fetchQuotations();
      if (viewOpen && selectedQuotation?.quotation_id === quotationId) {
        setSelectedQuotation({ ...selectedQuotation, status: newStatus });
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDownload = async (quotationId) => {
    try {
      const response = await api.get(`/admin/quotations/${quotationId}/pdf-data`);
      generateQuotationPDF(response.data);
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };

  const openEditDialog = (quotation) => {
    setSelectedQuotation(quotation);
    setSelectedLead(quotation.lead_id);
    setSelectedItems(quotation.items || []);
    setDiscount(quotation.discount_percentage || 0);
    setTaxPercent(quotation.tax_percentage || 0);
    setNotes(quotation.notes || '');
    setEditMode(true);
    setCreateOpen(true);
  };

  const openViewDialog = (quotation) => {
    setSelectedQuotation(quotation);
    setViewOpen(true);
  };

  const resetForm = () => {
    setSelectedLead('');
    setSelectedItems([]);
    setDiscount(0);
    setTaxPercent(0);
    setNotes('');
    setEditMode(false);
    setSelectedQuotation(null);
  };

  const getLeadName = (leadId) => {
    const lead = leads.find(l => l.lead_id === leadId);
    return lead ? lead.name : leadId;
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-blue-100 text-blue-700',
      accepted: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const { subtotal, discountAmount, taxAmount, total } = calculateTotal();

  return (
    <div data-testid="quotation-management" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Quotations</h1>
          <p className="text-muted-foreground mt-1">Create and manage quotations for your clients</p>
        </div>
        <Button 
          onClick={() => { resetForm(); setCreateOpen(true); }}
          className="font-ui"
          data-testid="create-quotation-btn"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Quotation
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase">Total Quotations</p>
          <p className="text-2xl font-bold">{quotations.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase">Draft</p>
          <p className="text-2xl font-bold text-gray-600">{quotations.filter(q => q.status === 'draft').length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase">Sent</p>
          <p className="text-2xl font-bold text-blue-600">{quotations.filter(q => q.status === 'sent').length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase">Accepted</p>
          <p className="text-2xl font-bold text-green-600">{quotations.filter(q => q.status === 'accepted').length}</p>
        </Card>
      </div>

      {/* Quotations List */}
      <div className="grid gap-4">
        {quotations.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Quotations Yet</h3>
            <p className="text-muted-foreground mb-4">Create your first quotation to get started</p>
            <Button onClick={() => { resetForm(); setCreateOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Create Quotation
            </Button>
          </Card>
        ) : (
          quotations.map(quotation => (
            <Card key={quotation.quotation_id} className="p-6" data-testid={`quotation-${quotation.quotation_id}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{quotation.quotation_number}</h3>
                    <Badge className={getStatusColor(quotation.status)}>
                      {quotation.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Customer: <span className="font-medium text-foreground">{getLeadName(quotation.lead_id)}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Created: {new Date(quotation.created_at).toLocaleDateString()}
                    {quotation.items && ` • ${quotation.items.length} item(s)`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">₹{quotation.total_amount.toLocaleString()}</p>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" onClick={() => openViewDialog(quotation)} data-testid={`view-${quotation.quotation_id}`}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(quotation)} data-testid={`edit-${quotation.quotation_id}`}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownload(quotation.quotation_id)} data-testid={`download-${quotation.quotation_id}`}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(quotation.quotation_id)} data-testid={`delete-${quotation.quotation_id}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={createOpen} onOpenChange={(value) => { setCreateOpen(value); if (!value) resetForm(); }}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">
              {editMode ? 'Edit Quotation' : 'Create Quotation'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            {/* Left Column - Lead & Items Selection */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <Label>Select Customer/Lead *</Label>
                <Select value={selectedLead} onValueChange={setSelectedLead}>
                  <SelectTrigger data-testid="select-lead">
                    <SelectValue placeholder="Choose a customer" />
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

              {/* Packages */}
              <div>
                <h3 className="font-semibold mb-3">Add Packages</h3>
                <div className="grid grid-cols-2 gap-3">
                  {packages.map(pkg => (
                    <Card 
                      key={pkg.package_id} 
                      className="p-3 cursor-pointer hover:bg-muted hover:border-primary transition-all"
                      onClick={() => addItem('package', pkg)}
                    >
                      <p className="font-semibold text-sm">{pkg.name}</p>
                      <p className="text-primary font-bold">₹{pkg.base_price?.toLocaleString()}</p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <div>
                <h3 className="font-semibold mb-3">Add-ons</h3>
                <div className="grid grid-cols-2 gap-3">
                  {addons.map(addon => (
                    <Card 
                      key={addon.addon_id} 
                      className="p-3 cursor-pointer hover:bg-muted hover:border-primary transition-all"
                      onClick={() => addItem('addon', addon)}
                    >
                      <p className="font-semibold text-sm">{addon.name}</p>
                      <p className="text-primary font-bold">₹{addon.price?.toLocaleString()}</p>
                    </Card>
                  ))}
                </div>
              </div>

              <Button variant="outline" onClick={addCustomItem} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Custom Item
              </Button>

              <div>
                <Label>Notes</Label>
                <Textarea 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  placeholder="Additional notes for the quotation..."
                  rows={3}
                />
              </div>
            </div>

            {/* Right Column - Selected Items & Total */}
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Selected Items</h3>
                {selectedItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Click on packages or add-ons to add them
                  </p>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {selectedItems.map((item, index) => (
                      <div key={index} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-start justify-between">
                          {item.item_type === 'custom' ? (
                            <Input
                              value={item.name}
                              onChange={(e) => updateItem(index, 'name', e.target.value)}
                              placeholder="Item name"
                              className="flex-1 mr-2"
                            />
                          ) : (
                            <span className="font-medium text-sm">{item.name}</span>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => removeItem(index)}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
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
                        <p className="text-right text-sm font-semibold">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="p-4 bg-muted">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label className="text-xs whitespace-nowrap">Discount %</Label>
                    <Input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      className="h-8"
                      min={0}
                      max={100}
                    />
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Label className="text-xs whitespace-nowrap">Tax %</Label>
                    <Input
                      type="number"
                      value={taxPercent}
                      onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                      className="h-8"
                      min={0}
                    />
                  </div>

                  {taxAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>₹{taxAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xl font-bold pt-3 border-t">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </Card>

              <Button 
                onClick={handleSubmit} 
                className="w-full" 
                disabled={!selectedLead || selectedItems.length === 0}
                data-testid="save-quotation-btn"
              >
                {editMode ? 'Update Quotation' : 'Create Quotation'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl flex items-center gap-3">
              {selectedQuotation?.quotation_number}
              <Badge className={getStatusColor(selectedQuotation?.status)}>
                {selectedQuotation?.status}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          {selectedQuotation && (
            <div className="space-y-6 mt-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-semibold">{getLeadName(selectedQuotation.lead_id)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-semibold">{new Date(selectedQuotation.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Item</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">Qty</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">Price</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedQuotation.items?.map((item, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-3">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-xs text-muted-foreground ml-2 capitalize">({item.item_type})</span>
                        </td>
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
                    <span>₹{selectedQuotation.subtotal?.toLocaleString()}</span>
                  </div>
                  {selectedQuotation.discount_amount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{selectedQuotation.discount_amount?.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedQuotation.tax_amount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax ({selectedQuotation.tax_percentage}%)</span>
                      <span>₹{selectedQuotation.tax_amount?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">₹{selectedQuotation.total_amount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {selectedQuotation.notes && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p>{selectedQuotation.notes}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <Select 
                  value={selectedQuotation.status} 
                  onValueChange={(value) => handleStatusChange(selectedQuotation.quotation_id, value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => openEditDialog(selectedQuotation)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button onClick={() => handleDownload(selectedQuotation.quotation_id)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
