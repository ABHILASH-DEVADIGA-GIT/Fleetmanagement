import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

export const ContentOverride = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [content, setContent] = useState(null);
  const [formData, setFormData] = useState({});

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

  const fetchContent = async (clientId) => {
    try {
      const response = await api.get(`/public/content/${clientId}`);
      setContent(response.data);
      setFormData(response.data);
    } catch (error) {
      toast.error('Failed to fetch content');
    }
  };

  const handleClientChange = (clientId) => {
    setSelectedClient(clientId);
    fetchContent(clientId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/super-admin/content/${selectedClient}`, formData);
      toast.success('Content updated successfully');
    } catch (error) {
      toast.error('Failed to update content');
    }
  };

  const updateNestedField = (path, value) => {
    const keys = path.split('.');
    const newData = { ...formData };
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setFormData(newData);
  };

  return (
    <div data-testid="content-override">
      <h1 className="font-heading text-4xl font-bold mb-8">Content Override</h1>

      <div className="mb-6">
        <Label>Select Client</Label>
        <Select value={selectedClient} onValueChange={handleClientChange}>
          <SelectTrigger className="w-full max-w-md" data-testid="client-select">
            <SelectValue placeholder="Choose a client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.client_id} value={client.client_id}>
                {client.business_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {content && (
        <form onSubmit={handleSubmit} className="space-y-8" data-testid="content-form">
          <div className="bg-card border border-border p-6">
            <h2 className="font-heading text-2xl font-bold mb-4">Banner Section</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Headline (English)</Label>
                <Input
                  value={formData.banner?.headline?.en || ''}
                  onChange={(e) => updateNestedField('banner.headline.en', e.target.value)}
                  data-testid="banner-headline-en"
                />
              </div>
              <div>
                <Label>Headline (Kannada)</Label>
                <Input
                  value={formData.banner?.headline?.kn || ''}
                  onChange={(e) => updateNestedField('banner.headline.kn', e.target.value)}
                  data-testid="banner-headline-kn"
                />
              </div>
              <div>
                <Label>Headline (Hindi)</Label>
                <Input
                  value={formData.banner?.headline?.hi || ''}
                  onChange={(e) => updateNestedField('banner.headline.hi', e.target.value)}
                  data-testid="banner-headline-hi"
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border p-6">
            <h2 className="font-heading text-2xl font-bold mb-4">About Section</h2>
            <div className="space-y-4">
              <div>
                <Label>Title (English)</Label>
                <Input
                  value={formData.about?.title?.en || ''}
                  onChange={(e) => updateNestedField('about.title.en', e.target.value)}
                  data-testid="about-title-en"
                />
              </div>
              <div>
                <Label>Description (English)</Label>
                <Textarea
                  value={formData.about?.description?.en || ''}
                  onChange={(e) => updateNestedField('about.description.en', e.target.value)}
                  rows={4}
                  data-testid="about-description-en"
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border p-6">
            <h2 className="font-heading text-2xl font-bold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Contact Email</Label>
                <Input
                  type="email"
                  value={formData.contact_email || ''}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  data-testid="contact-email"
                />
              </div>
              <div>
                <Label>Contact Phone</Label>
                <Input
                  value={formData.contact_phone || ''}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  data-testid="contact-phone"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="font-ui uppercase tracking-wider" data-testid="submit-content-button">
            Update Content
          </Button>
        </form>
      )}
    </div>
  );
};
