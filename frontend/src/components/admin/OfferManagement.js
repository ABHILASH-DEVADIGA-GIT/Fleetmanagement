import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

export const OfferManagement = () => {
  const [offers, setOffers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({
    title: { en: '', kn: '', hi: '' },
    description: { en: '', kn: '', hi: '' },
    discount_percentage: '',
    flat_discount: '',
    start_date: '',
    end_date: '',
    banner_image: '',
    status: 'active',
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await api.get('/admin/offers');
      setOffers(response.data);
    } catch (error) {
      toast.error('Failed to fetch offers');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOffer) {
        await api.put(`/admin/offers/${editingOffer.offer_id}`, formData);
        toast.success('Offer updated successfully');
      } else {
        await api.post('/admin/offers', formData);
        toast.success('Offer created successfully');
      }
      setOpen(false);
      resetForm();
      fetchOffers();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Operation failed');
    }
  };

  const handleDelete = async (offerId) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    try {
      await api.delete(`/admin/offers/${offerId}`);
      toast.success('Offer deleted successfully');
      fetchOffers();
    } catch (error) {
      toast.error('Failed to delete offer');
    }
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description,
      discount_percentage: offer.discount_percentage || '',
      flat_discount: offer.flat_discount || '',
      start_date: offer.start_date.split('T')[0],
      end_date: offer.end_date.split('T')[0],
      banner_image: offer.banner_image || '',
      status: offer.status,
    });
    setOpen(true);
  };

  const resetForm = () => {
    setEditingOffer(null);
    setFormData({
      title: { en: '', kn: '', hi: '' },
      description: { en: '', kn: '', hi: '' },
      discount_percentage: '',
      flat_discount: '',
      start_date: '',
      end_date: '',
      banner_image: '',
      status: 'active',
    });
  };

  return (
    <div data-testid="offer-management">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-4xl font-bold">Offer Management</h1>
        <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="font-ui uppercase tracking-wider" data-testid="add-offer-button">
              <Plus className="mr-2 h-4 w-4" />
              Add Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl">
                {editingOffer ? 'Edit Offer' : 'Create New Offer'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="offer-form">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Title (English)</Label>
                  <Input
                    value={formData.title.en}
                    onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
                    required
                    data-testid="title-en-input"
                  />
                </div>
                <div>
                  <Label>Title (Kannada)</Label>
                  <Input
                    value={formData.title.kn}
                    onChange={(e) => setFormData({ ...formData, title: { ...formData.title, kn: e.target.value } })}
                    data-testid="title-kn-input"
                  />
                </div>
                <div>
                  <Label>Title (Hindi)</Label>
                  <Input
                    value={formData.title.hi}
                    onChange={(e) => setFormData({ ...formData, title: { ...formData.title, hi: e.target.value } })}
                    data-testid="title-hi-input"
                  />
                </div>
              </div>
              <div>
                <Label>Description (English)</Label>
                <Textarea
                  value={formData.description.en}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                  required
                  rows={3}
                  data-testid="description-en-input"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Discount Percentage</Label>
                  <Input
                    type="number"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                    placeholder="20"
                    data-testid="discount-percentage-input"
                  />
                </div>
                <div>
                  <Label>Flat Discount (₹)</Label>
                  <Input
                    type="number"
                    value={formData.flat_discount}
                    onChange={(e) => setFormData({ ...formData, flat_discount: e.target.value })}
                    placeholder="1000"
                    data-testid="flat-discount-input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                    data-testid="start-date-input"
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                    data-testid="end-date-input"
                  />
                </div>
              </div>
              <div>
                <Label>Banner Image URL (Optional)</Label>
                <Input
                  value={formData.banner_image}
                  onChange={(e) => setFormData({ ...formData, banner_image: e.target.value })}
                  placeholder="https://example.com/banner.jpg"
                  data-testid="banner-image-input"
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger data-testid="status-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full font-ui uppercase tracking-wider" data-testid="submit-offer-button">
                {editingOffer ? 'Update Offer' : 'Create Offer'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {offers.map((offer) => {
          const now = new Date();
          const startDate = new Date(offer.start_date);
          const endDate = new Date(offer.end_date);
          const isActive = now >= startDate && now <= endDate && offer.status === 'active';
          const isExpired = now > endDate;

          return (
            <Card key={offer.offer_id} className="p-6" data-testid="offer-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-heading text-xl font-bold mb-1">{offer.title.en}</h3>
                  <p className="font-body text-sm text-muted-foreground">{offer.description.en}</p>
                </div>
                <Badge variant={isActive ? 'default' : isExpired ? 'secondary' : 'outline'}>
                  {isActive ? 'Active' : isExpired ? 'Expired' : offer.status}
                </Badge>
              </div>
              <div className="space-y-2 mb-4">
                {offer.discount_percentage && (
                  <p className="font-ui text-sm"><span className="font-semibold">Discount:</span> {offer.discount_percentage}%</p>
                )}
                {offer.flat_discount && (
                  <p className="font-ui text-sm"><span className="font-semibold">Flat Discount:</span> ₹{offer.flat_discount}</p>
                )}
                <p className="font-ui text-sm"><span className="font-semibold">Valid:</span> {new Date(offer.start_date).toLocaleDateString()} - {new Date(offer.end_date).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(offer)} variant="outline" size="sm" data-testid="edit-offer-button">
                  <Edit className="mr-2 h-3 w-3" />
                  Edit
                </Button>
                <Button onClick={() => handleDelete(offer.offer_id)} variant="outline" size="sm" className="text-destructive" data-testid="delete-offer-button">
                  <Trash2 className="mr-2 h-3 w-3" />
                  Delete
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
