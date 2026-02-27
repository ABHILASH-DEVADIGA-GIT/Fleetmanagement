import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Edit, Trash2, Power } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

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
        await api.put(`/super-admin/clients/${editingClient.client_id}`, formData);
        toast.success('Client updated successfully');
      } else {
        await api.post('/super-admin/clients', formData);
        toast.success('Client created successfully');
      }
      setOpen(false);
      resetForm();
      fetchClients();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Operation failed');
    }
  };

  const handleDelete = async (clientId) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;
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
      enabled_languages: client.enabled_languages,
      theme: client.theme,
    });
    setOpen(true);
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
    });
  };

  return (
    <div data-testid="client-management">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-4xl font-bold">Client Management</h1>
        <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="font-ui uppercase tracking-wider" data-testid="add-client-button">
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl">
                {editingClient ? 'Edit Client' : 'Create New Client'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="client-form">
              <div>
                <Label>Business Name</Label>
                <Input
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  required
                  data-testid="business-name-input"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  data-testid="email-input"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  data-testid="phone-input"
                />
              </div>
              <div>
                <Label>Domain (Optional)</Label>
                <Input
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  data-testid="domain-input"
                />
              </div>
              <div>
                <Label>Subscription Plan</Label>
                <Select value={formData.subscription_plan} onValueChange={(value) => setFormData({ ...formData, subscription_plan: value })}>
                  <SelectTrigger data-testid="plan-select">
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
                  <SelectTrigger data-testid="theme-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full font-ui uppercase tracking-wider" data-testid="submit-client-button">
                {editingClient ? 'Update Client' : 'Create Client'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-ui uppercase">Business Name</TableHead>
              <TableHead className="font-ui uppercase">Email</TableHead>
              <TableHead className="font-ui uppercase">Phone</TableHead>
              <TableHead className="font-ui uppercase">Plan</TableHead>
              <TableHead className="font-ui uppercase">Status</TableHead>
              <TableHead className="font-ui uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.client_id} data-testid="client-row">
                <TableCell className="font-body font-semibold">{client.business_name}</TableCell>
                <TableCell className="font-body">{client.email}</TableCell>
                <TableCell className="font-body">{client.phone}</TableCell>
                <TableCell className="font-body capitalize">{client.subscription_plan}</TableCell>
                <TableCell>
                  <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                    {client.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(client)} variant="ghost" size="icon" data-testid="edit-client-button">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => handleDelete(client.client_id)} variant="ghost" size="icon" className="text-destructive" data-testid="delete-client-button">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
