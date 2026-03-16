import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Edit, Save, X, Image, MapPin, Facebook, Instagram, Twitter, Youtube, Link } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';

const SECTIONS = [
  { id: 'hero', label: 'Hero Section', icon: Image },
  { id: 'about', label: 'About Section', icon: Image },
  { id: 'services_section', label: 'Services Section', icon: Image },
  { id: 'gallery_section', label: 'Gallery Section', icon: Image },
  { id: 'products_section', label: 'Products Section', icon: Image },
  { id: 'booking_section', label: 'Booking Section', icon: Image },
  { id: 'contact', label: 'Contact Section', icon: MapPin },
  { id: 'footer', label: 'Footer', icon: Link },
];

export const SiteContentEditor = () => {
  const [content, setContent] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await api.get('/admin/site-content');
      setContent(response.data);
    } catch (error) {
      console.error('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sectionId) => {
    setEditingSection(sectionId);
    setFormData(content[sectionId] || {});
  };

  const handleSave = async () => {
    try {
      await api.put(`/admin/site-content/${editingSection}`, formData);
      toast.success('Section updated');
      setEditingSection(null);
      fetchContent();
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  const updateField = (path, value) => {
    const pathArray = path.split('.');
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      let current = newData;
      for (let i = 0; i < pathArray.length - 1; i++) {
        if (!current[pathArray[i]]) current[pathArray[i]] = {};
        current = current[pathArray[i]];
      }
      current[pathArray[pathArray.length - 1]] = value;
      return newData;
    });
  };

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) || '';
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div data-testid="site-content-editor" className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Website Content</h1>
        <p className="text-muted-foreground mt-1">Edit all sections of your public website</p>
      </div>

      {/* Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SECTIONS.map(section => (
          <Card key={section.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <section.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{section.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    {content && content[section.id] ? 'Content configured' : 'Click to edit'}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleEdit(section.id)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingSection} onOpenChange={(open) => !open && setEditingSection(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Edit {SECTIONS.find(s => s.id === editingSection)?.label}
            </DialogTitle>
          </DialogHeader>

          {editingSection === 'hero' && (
            <HeroEditor formData={formData} updateField={updateField} getNestedValue={getNestedValue} />
          )}

          {editingSection === 'about' && (
            <AboutEditor formData={formData} updateField={updateField} getNestedValue={getNestedValue} />
          )}

          {(editingSection === 'services_section' || 
            editingSection === 'gallery_section' || 
            editingSection === 'products_section' ||
            editingSection === 'booking_section') && (
            <SimpleSectionEditor 
              formData={formData} 
              updateField={updateField} 
              getNestedValue={getNestedValue}
              sectionName={SECTIONS.find(s => s.id === editingSection)?.label}
            />
          )}

          {editingSection === 'contact' && (
            <ContactEditor formData={formData} updateField={updateField} getNestedValue={getNestedValue} />
          )}

          {editingSection === 'footer' && (
            <FooterEditor formData={formData} updateField={updateField} getNestedValue={getNestedValue} />
          )}

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setEditingSection(null)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Hero Section Editor
const HeroEditor = ({ formData, updateField, getNestedValue }) => (
  <Tabs defaultValue="en" className="space-y-4">
    <TabsList>
      <TabsTrigger value="en">English</TabsTrigger>
      <TabsTrigger value="kn">ಕನ್ನಡ</TabsTrigger>
      <TabsTrigger value="hi">हिंदी</TabsTrigger>
    </TabsList>

    {['en', 'kn', 'hi'].map(lang => (
      <TabsContent key={lang} value={lang} className="space-y-4">
        <div>
          <Label>Headline</Label>
          <Input
            value={getNestedValue(formData, `headline.${lang}`)}
            onChange={(e) => updateField(`headline.${lang}`, e.target.value)}
            placeholder="Main headline"
          />
        </div>
        <div>
          <Label>Sub-headline</Label>
          <Textarea
            value={getNestedValue(formData, `sub_headline.${lang}`)}
            onChange={(e) => updateField(`sub_headline.${lang}`, e.target.value)}
            placeholder="Supporting text"
            rows={2}
          />
        </div>
        <div>
          <Label>CTA Button Text</Label>
          <Input
            value={getNestedValue(formData, `cta_text.${lang}`)}
            onChange={(e) => updateField(`cta_text.${lang}`, e.target.value)}
            placeholder="e.g., Book Now"
          />
        </div>
      </TabsContent>
    ))}

    <div className="space-y-4 pt-4 border-t">
      <div>
        <Label>Background Image URL</Label>
        <Input
          value={formData.background_image || ''}
          onChange={(e) => updateField('background_image', e.target.value)}
          placeholder="https://..."
        />
      </div>
      <div>
        <Label>Logo URL</Label>
        <Input
          value={formData.logo_url || ''}
          onChange={(e) => updateField('logo_url', e.target.value)}
          placeholder="https://..."
        />
      </div>
      <div>
        <Label>CTA Button Link</Label>
        <Input
          value={formData.cta_link || ''}
          onChange={(e) => updateField('cta_link', e.target.value)}
          placeholder="#booking or /booking"
        />
      </div>
    </div>
  </Tabs>
);

// About Section Editor
const AboutEditor = ({ formData, updateField, getNestedValue }) => (
  <div className="space-y-4">
    <Tabs defaultValue="en">
      <TabsList>
        <TabsTrigger value="en">English</TabsTrigger>
        <TabsTrigger value="kn">ಕನ್ನಡ</TabsTrigger>
        <TabsTrigger value="hi">हिंदी</TabsTrigger>
      </TabsList>

      {['en', 'kn', 'hi'].map(lang => (
        <TabsContent key={lang} value={lang} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={getNestedValue(formData, `title.${lang}`)}
              onChange={(e) => updateField(`title.${lang}`, e.target.value)}
              placeholder="About Us"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={getNestedValue(formData, `description.${lang}`)}
              onChange={(e) => updateField(`description.${lang}`, e.target.value)}
              placeholder="About your business..."
              rows={4}
            />
          </div>
        </TabsContent>
      ))}
    </Tabs>

    <div>
      <Label>About Image URL</Label>
      <Input
        value={formData.image_url || ''}
        onChange={(e) => updateField('image_url', e.target.value)}
        placeholder="https://..."
      />
    </div>
  </div>
);

// Simple Section Editor (Services, Gallery, Products, Booking)
const SimpleSectionEditor = ({ formData, updateField, getNestedValue, sectionName }) => (
  <Tabs defaultValue="en" className="space-y-4">
    <TabsList>
      <TabsTrigger value="en">English</TabsTrigger>
      <TabsTrigger value="kn">ಕನ್ನಡ</TabsTrigger>
      <TabsTrigger value="hi">हिंदी</TabsTrigger>
    </TabsList>

    {['en', 'kn', 'hi'].map(lang => (
      <TabsContent key={lang} value={lang} className="space-y-4">
        <div>
          <Label>Section Title</Label>
          <Input
            value={getNestedValue(formData, `title.${lang}`)}
            onChange={(e) => updateField(`title.${lang}`, e.target.value)}
            placeholder={sectionName}
          />
        </div>
        <div>
          <Label>Subtitle</Label>
          <Textarea
            value={getNestedValue(formData, `subtitle.${lang}`)}
            onChange={(e) => updateField(`subtitle.${lang}`, e.target.value)}
            placeholder="Section description..."
            rows={2}
          />
        </div>
      </TabsContent>
    ))}
  </Tabs>
);

// Contact Section Editor
const ContactEditor = ({ formData, updateField, getNestedValue }) => (
  <div className="space-y-4">
    <Tabs defaultValue="en">
      <TabsList>
        <TabsTrigger value="en">English</TabsTrigger>
        <TabsTrigger value="kn">ಕನ್ನಡ</TabsTrigger>
        <TabsTrigger value="hi">हिंदी</TabsTrigger>
      </TabsList>

      {['en', 'kn', 'hi'].map(lang => (
        <TabsContent key={lang} value={lang} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={getNestedValue(formData, `title.${lang}`)}
              onChange={(e) => updateField(`title.${lang}`, e.target.value)}
              placeholder="Contact Us"
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={getNestedValue(formData, `subtitle.${lang}`)}
              onChange={(e) => updateField(`subtitle.${lang}`, e.target.value)}
              placeholder="Get in touch"
            />
          </div>
          <div>
            <Label>Address</Label>
            <Textarea
              value={getNestedValue(formData, `address.${lang}`)}
              onChange={(e) => updateField(`address.${lang}`, e.target.value)}
              placeholder="Your business address"
              rows={2}
            />
          </div>
        </TabsContent>
      ))}
    </Tabs>

    <div>
      <Label>Google Maps Embed URL</Label>
      <Input
        value={formData.map_embed_url || ''}
        onChange={(e) => updateField('map_embed_url', e.target.value)}
        placeholder="https://www.google.com/maps/embed?..."
      />
    </div>
  </div>
);

// Footer Editor
const FooterEditor = ({ formData, updateField, getNestedValue }) => (
  <div className="space-y-4">
    <Tabs defaultValue="en">
      <TabsList>
        <TabsTrigger value="en">English</TabsTrigger>
        <TabsTrigger value="kn">ಕನ್ನಡ</TabsTrigger>
        <TabsTrigger value="hi">हिंदी</TabsTrigger>
      </TabsList>

      {['en', 'kn', 'hi'].map(lang => (
        <TabsContent key={lang} value={lang} className="space-y-4">
          <div>
            <Label>Copyright Text</Label>
            <Input
              value={getNestedValue(formData, `copyright_text.${lang}`)}
              onChange={(e) => updateField(`copyright_text.${lang}`, e.target.value)}
              placeholder="© 2025 Your Business. All rights reserved."
            />
          </div>
        </TabsContent>
      ))}
    </Tabs>

    <div className="space-y-3 pt-4 border-t">
      <Label>Social Media Links</Label>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <Facebook className="h-5 w-5 text-blue-600" />
          <Input
            value={formData.social_links?.facebook || ''}
            onChange={(e) => updateField('social_links.facebook', e.target.value)}
            placeholder="Facebook URL"
          />
        </div>
        <div className="flex items-center gap-2">
          <Instagram className="h-5 w-5 text-pink-600" />
          <Input
            value={formData.social_links?.instagram || ''}
            onChange={(e) => updateField('social_links.instagram', e.target.value)}
            placeholder="Instagram URL"
          />
        </div>
        <div className="flex items-center gap-2">
          <Twitter className="h-5 w-5 text-sky-500" />
          <Input
            value={formData.social_links?.twitter || ''}
            onChange={(e) => updateField('social_links.twitter', e.target.value)}
            placeholder="Twitter/X URL"
          />
        </div>
        <div className="flex items-center gap-2">
          <Youtube className="h-5 w-5 text-red-600" />
          <Input
            value={formData.social_links?.youtube || ''}
            onChange={(e) => updateField('social_links.youtube', e.target.value)}
            placeholder="YouTube URL"
          />
        </div>
      </div>
    </div>
  </div>
);
