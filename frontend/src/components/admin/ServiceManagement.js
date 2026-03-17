import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Card } from '../ui/card';
import { toast } from 'sonner';
import { ImageUpload } from '../shared/ImageUpload';
import { getImageUrl } from '../../utils/imageUrl';

export const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: { en: '', kn: '', hi: '' },
    description: { en: '', kn: '', hi: '' },
    price: '',
    image_url: '',
    is_active: true,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/admin/services');
      setServices(response.data);
    } catch (error) {
      toast.error('Failed to fetch services');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await api.put(`/admin/services/${editingService.service_id}`, formData);
        toast.success('Service updated successfully');
      } else {
        await api.post('/admin/services', formData);
        toast.success('Service created successfully');
      }
      setOpen(false);
      resetForm();
      fetchServices();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Operation failed');
    }
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/admin/services/${serviceId}`);
      toast.success('Service deleted successfully');
      fetchServices();
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price || '',
      image_url: service.image_url || '',
      is_active: service.is_active,
    });
    setOpen(true);
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({
      name: { en: '', kn: '', hi: '' },
      description: { en: '', kn: '', hi: '' },
      price: '',
      image_url: '',
      is_active: true,
    });
  };

  return (
    <div data-testid="service-management">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-4xl font-bold">Service Management</h1>
        <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="font-ui uppercase tracking-wider" data-testid="add-service-button">
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl">
                {editingService ? 'Edit Service' : 'Create New Service'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="service-form">
              <ImageUpload
                label="Service Image"
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                category="services"
                previewSize="lg"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Name (English)</Label>
                  <Input
                    value={formData.name.en}
                    onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
                    required
                    data-testid="name-en-input"
                  />
                </div>
                <div>
                  <Label>Name (Kannada)</Label>
                  <Input
                    value={formData.name.kn}
                    onChange={(e) => setFormData({ ...formData, name: { ...formData.name, kn: e.target.value } })}
                    data-testid="name-kn-input"
                  />
                </div>
                <div>
                  <Label>Name (Hindi)</Label>
                  <Input
                    value={formData.name.hi}
                    onChange={(e) => setFormData({ ...formData, name: { ...formData.name, hi: e.target.value } })}
                    data-testid="name-hi-input"
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
              <div>
                <Label>Description (Kannada)</Label>
                <Textarea
                  value={formData.description.kn}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, kn: e.target.value } })}
                  rows={3}
                  data-testid="description-kn-input"
                />
              </div>
              <div>
                <Label>Description (Hindi)</Label>
                <Textarea
                  value={formData.description.hi}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, hi: e.target.value } })}
                  rows={3}
                  data-testid="description-hi-input"
                />
              </div>
              <div>
                <Label>Price (Optional)</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="5000"
                  data-testid="price-input"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  data-testid="active-switch"
                />
                <Label>Active</Label>
              </div>
              <Button type="submit" className="w-full font-ui uppercase tracking-wider" data-testid="submit-service-button">
                {editingService ? 'Update Service' : 'Create Service'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.service_id} className="overflow-hidden" data-testid="service-card">
            {service.image_url && (
              <img src={getImageUrl(service.image_url)} alt={service.name.en} className="w-full h-48 object-cover" />
            )}
            <div className="p-6">
              <h3 className="font-heading text-xl font-bold mb-2">{service.name.en}</h3>
              <p className="font-body text-sm text-muted-foreground mb-3 line-clamp-2">{service.description.en}</p>
              {service.price && (
                <p className="font-ui text-lg font-semibold text-primary mb-3">₹{service.price}</p>
              )}
              <div className="flex items-center justify-between">
                <span className={`text-xs font-ui uppercase tracking-wider ${service.is_active ? 'text-green-500' : 'text-gray-400'}`}>
                  {service.is_active ? 'Active' : 'Inactive'}
                </span>
                <div className="flex gap-2">
                  <Button onClick={() => handleEdit(service)} variant="ghost" size="icon" data-testid="edit-service-button">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => handleDelete(service.service_id)} variant="ghost" size="icon" className="text-destructive" data-testid="delete-service-button">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
