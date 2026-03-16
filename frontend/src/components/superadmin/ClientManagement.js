import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Edit, Trash2, Settings, ExternalLink, Copy } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner';

const AVAILABLE_MODULES = [
  { id: 'about', label: 'About Section', description: 'Company/Business information' },
  { id: 'services', label: 'Services Section', description: 'List of services offered' },
  { id: 'gallery', label: 'Gallery Section', description: 'Photo/Video gallery' },
  { id: 'booking', label: 'Booking System', description: 'Appointment booking form' },
  { id: 'products', label: 'Product Catalog', description: 'E-commerce style product display' },
  { id: 'offers', label: 'Offers Section', description: 'Special offers and discounts' },
  { id: 'contact', label: 'Contact Section', description: 'Contact form and map' },
];

const DEFAULT_MODULES = ['about', 'services', 'gallery', 'booking', 'offers', 'contact'];

export const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    business_name: '',
    email: '',
    phone: '',
    domain: '',
    subscription_plan: 'basic',
    enabled_languages: ['en'],
    theme: 'light',
    enabled_modules: DEFAULT_MODULES,
    primary_color: '#1e40af',
    logo_url: '',
    admin_password: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.get('/super-admin/clients');
      setClients(response.data);
    } catch (error) {
      toast.error('Failed to fetch clients');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        const { admin_password, ...updateData } = formData;
        await api.put(`/super-admin/clients/${editingClient.client_id}`, updateData);
        toast.success('Client updated successfully');
      } else {
        await api.post('/super-admin/clients', formData);
        toast.success('Client created successfully! Admin account created with the provided credentials.');
      }
      setOpen(false);
      resetForm();
      fetchClients();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Operation failed');
    }
  };

  const handleDelete = async (clientId) => {
    if (!window.confirm('Are you sure you want to delete this client? This will remove all their data.')) return;
    try {
      await api.delete(`/super-admin/clients/${clientId}`);
      toast.success('Client deleted successfully');
      fetchClients();
    } catch (error) {
      toast.error('Failed to delete client');
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      business_name: client.business_name,
      email: client.email,
      phone: client.phone,
      domain: client.domain || '',
      subscription_plan: client.subscription_plan,
      enabled_languages: client.enabled_languages || ['en'],
      theme: client.theme,
      enabled_modules: client.enabled_modules || DEFAULT_MODULES,
      primary_color: client.primary_color || '#1e40af',
      logo_url: client.logo_url || '',
      admin_password: ''
    });
    setOpen(true);
  };

  const toggleModule = (moduleId) => {
    setFormData(prev => ({
      ...prev,
      enabled_modules: prev.enabled_modules.includes(moduleId)
        ? prev.enabled_modules.filter(m => m !== moduleId)
        : [...prev.enabled_modules, moduleId]
    }));
  };

  const toggleLanguage = (lang) => {
    setFormData(prev => ({
      ...prev,
      enabled_languages: prev.enabled_languages.includes(lang)
        ? prev.enabled_languages.filter(l => l !== lang)
        : [...prev.enabled_languages, lang]
    }));
  };

  const resetForm = () => {
    setEditingClient(null);
    setFormData({
      business_name: '',
      email: '',
      phone: '',
      domain: '',
      subscription_plan: 'basic',
      enabled_languages: ['en'],
      theme: 'light',
      enabled_modules: DEFAULT_MODULES,
      primary_color: '#1e40af',
      logo_url: '',
      admin_password: ''
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getPublicUrl = (clientId) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/site/${clientId}`;
  };

  return (
    <div data-testid="client-management">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold">Client Management</h1>
          <p className="text-muted-foreground mt-1">Manage all client accounts and their websites</p>
        </div>
        <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) resetForm(); }}>
          <DialogTrigger asChild>
            <Button data-testid="add-client-button">
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingClient ? 'Edit Client' : 'Create New Client'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="client-form">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Business Name *</Label>
                  <Input
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    required
                    placeholder="ABC Photography"
                  />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="admin@business.com"
                  />
                  {!editingClient && <p className="text-xs text-muted-foreground mt-1">This will be the admin login email</p>}
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="9876543210"
                  />
                </div>
                <div>
                  <Label>Domain (Optional)</Label>
                  <Input
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    placeholder="www.mybusiness.com"
                  />
                </div>
              </div>

              {/* Admin Password - Only for new clients */}
              {!editingClient && (
                <div>
                  <Label>Admin Password</Label>
                  <Input
                    type="password"
                    value={formData.admin_password}
                    onChange={(e) => setFormData({ ...formData, admin_password: e.target.value })}
                    placeholder="Leave blank for default (admin123)"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Password for the admin account that will be auto-created</p>
                </div>
              )}

              {/* Plan & Theme */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Subscription Plan</Label>
                  <Select value={formData.subscription_plan} onValueChange={(value) => setFormData({ ...formData, subscription_plan: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Theme</Label>
                  <Select value={formData.theme} onValueChange={(value) => setFormData({ ...formData, theme: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Primary Color & Logo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      placeholder="#1e40af"
                    />
                  </div>
                </div>
                <div>
                  <Label>Logo URL</Label>
                  <Input
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Languages */}
              <div>
                <Label className="mb-3 block">Enabled Languages</Label>
                <div className="flex gap-4">
                  {[
                    { id: 'en', label: 'English' },
                    { id: 'kn', label: 'Kannada (ಕನ್ನಡ)' },
                    { id: 'hi', label: 'Hindi (हिंदी)' }
                  ].map(lang => (
                    <label key={lang.id} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={formData.enabled_languages.includes(lang.id)}
                        onCheckedChange={() => toggleLanguage(lang.id)}
                      />
                      <span>{lang.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Modules */}
              <div>
                <Label className="mb-3 block">Enabled Modules</Label>
                <div className="grid grid-cols-2 gap-3">
                  {AVAILABLE_MODULES.map(module => (
                    <label
                      key={module.id}
                      className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.enabled_modules.includes(module.id) 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <Checkbox
                        checked={formData.enabled_modules.includes(module.id)}
                        onCheckedChange={() => toggleModule(module.id)}
                      />
                      <div>
                        <p className="font-medium">{module.label}</p>
                        <p className="text-xs text-muted-foreground">{module.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                {editingClient ? 'Update Client' : 'Create Client'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Modules</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No clients yet. Create your first client to get started.
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.client_id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{client.business_name}</p>
                      {client.domain && <p className="text-xs text-muted-foreground">{client.domain}</p>}
                    </div>
                  </TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{client.subscription_plan}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(client.enabled_modules || DEFAULT_MODULES).slice(0, 3).map(m => (
                        <Badge key={m} variant="secondary" className="text-xs capitalize">{m}</Badge>
                      ))}
                      {(client.enabled_modules || DEFAULT_MODULES).length > 3 && (
                        <Badge variant="secondary" className="text-xs">+{(client.enabled_modules || DEFAULT_MODULES).length - 3}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="View Public Site"
                        onClick={() => window.open(getPublicUrl(client.client_id), '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        title="Copy Site URL"
                        onClick={() => copyToClipboard(getPublicUrl(client.client_id))}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleEdit(client)} variant="ghost" size="icon" title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleDelete(client.client_id)} variant="ghost" size="icon" className="text-destructive" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
