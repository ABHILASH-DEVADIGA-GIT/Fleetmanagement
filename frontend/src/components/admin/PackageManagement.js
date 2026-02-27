import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Edit, Trash2, Copy } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

export const PackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [addons, setAddons] = useState([]);
  const [open, setOpen] = useState(false);
  const [addonOpen, setAddonOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    base_price: '',
    description: '',
    included_services: [],
    default_discount: 0,
  });
  const [addonFormData, setAddonFormData] = useState({
    name: '',
    price: '',
    description: '',
  });
  const [serviceInput, setServiceInput] = useState('');

  useEffect(() => {
    fetchPackages();
    fetchAddons();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await api.get('/admin/packages');
      setPackages(response.data);
    } catch (error) {
      toast.error('Failed to fetch packages');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPackage) {
        await api.put(`/admin/packages/${editingPackage.package_id}`, formData);
        toast.success('Package updated');
      } else {
        await api.post('/admin/packages', formData);
        toast.success('Package created');
      }
      setOpen(false);
      resetForm();
      fetchPackages();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleAddonSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/addons', addonFormData);
      toast.success('Add-on created');
      setAddonOpen(false);
      resetAddonForm();
      fetchAddons();
    } catch (error) {
      toast.error('Failed to create add-on');
    }
  };

  const handleDelete = async (packageId) => {
    if (!window.confirm('Delete this package?')) return;
    try {
      await api.delete(`/admin/packages/${packageId}`);
      toast.success('Package deleted');
      fetchPackages();
    } catch (error) {
      toast.error('Failed to delete package');
    }
  };

  const handleDuplicate = (pkg) => {
    setFormData({
      name: `${pkg.name} (Copy)`,
      base_price: pkg.base_price,
      description: pkg.description,
      included_services: [...pkg.included_services],
      default_discount: pkg.default_discount,
    });
    setOpen(true);
  };

  const addService = () => {
    if (serviceInput.trim()) {
      setFormData({
        ...formData,
        included_services: [...formData.included_services, serviceInput.trim()],
      });
      setServiceInput('');
    }
  };

  const removeService = (index) => {
    setFormData({
      ...formData,
      included_services: formData.included_services.filter((_, i) => i !== index),
    });
  };

  const resetForm = () => {
    setEditingPackage(null);
    setFormData({
      name: '',
      base_price: '',
      description: '',
      included_services: [],
      default_discount: 0,
    });
  };

  const resetAddonForm = () => {
    setAddonFormData({
      name: '',
      price: '',
      description: '',
    });
  };

  return (
    <div data-testid="package-management">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-4xl font-bold">Package Management</h1>
        <div className="flex gap-4">
          <Dialog open={addonOpen} onOpenChange={(value) => { setAddonOpen(value); if (!value) resetAddonForm(); }}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add-on
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Add-on Service</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddonSubmit} className="space-y-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={addonFormData.name}
                    onChange={(e) => setAddonFormData({ ...addonFormData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Price *</Label>
                  <Input
                    type="number"
                    value={addonFormData.price}
                    onChange={(e) => setAddonFormData({ ...addonFormData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={addonFormData.description}
                    onChange={(e) => setAddonFormData({ ...addonFormData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full">Create Add-on</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Package
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPackage ? 'Edit Package' : 'Create Package'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Package Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Base Price *</Label>
                  <Input
                    type="number"
                    value={formData.base_price}
                    onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Default Discount (%)</Label>
                  <Input
                    type="number"
                    value={formData.default_discount}
                    onChange={(e) => setFormData({ ...formData, default_discount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Included Services</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={serviceInput}
                      onChange={(e) => setServiceInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                      placeholder="Enter service and press Enter"
                    />
                    <Button type="button" onClick={addService}>Add</Button>
                  </div>
                  <div className="space-y-2">
                    {formData.included_services.map((service, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                        <span className="font-body text-sm">{service}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeService(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  {editingPackage ? 'Update Package' : 'Create Package'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {packages.map((pkg) => (
          <Card key={pkg.package_id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-heading text-xl font-bold">{pkg.name}</h3>
                <p className="font-ui text-2xl font-bold text-primary mt-2">₹{pkg.base_price.toLocaleString()}</p>
              </div>
              <Badge>{pkg.is_active ? 'Active' : 'Inactive'}</Badge>
            </div>
            <p className="font-body text-sm text-muted-foreground mb-4">{pkg.description}</p>
            <div className="space-y-2 mb-4">
              <p className="font-ui text-xs uppercase tracking-wider text-muted-foreground">Included:</p>
              {pkg.included_services.slice(0, 3).map((service, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span className="font-body text-sm">{service}</span>
                </div>
              ))}
              {pkg.included_services.length > 3 && (
                <p className="font-body text-xs text-muted-foreground">+{pkg.included_services.length - 3} more</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleDuplicate(pkg)} variant="outline" size="sm" className="flex-1">
                <Copy className="mr-2 h-3 w-3" />
                Duplicate
              </Button>
              <Button onClick={() => handleDelete(pkg.package_id)} variant="outline" size="sm" className="text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {addons.length > 0 && (
        <div>
          <h2 className="font-heading text-2xl font-bold mb-4">Add-on Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {addons.map((addon) => (
              <Card key={addon.addon_id} className="p-4">
                <h4 className="font-ui font-semibold mb-1">{addon.name}</h4>
                <p className="font-ui text-lg font-bold text-primary">₹{addon.price}</p>
                {addon.description && (
                  <p className="font-body text-xs text-muted-foreground mt-2">{addon.description}</p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
