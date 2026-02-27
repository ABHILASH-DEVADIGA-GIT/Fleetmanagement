import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';

export const ContentManagement = () => {
  const [content, setContent] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await api.get('/admin/content');
      setContent(response.data);
      setFormData(response.data);
    } catch (error) {
      toast.error('Failed to fetch content');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/admin/content', formData);
      toast.success('Content updated successfully');
      fetchContent();
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

  if (!content) {
    return <div>Loading...</div>;
  }

  return (
    <div data-testid="content-management">
      <h1 className="font-heading text-4xl font-bold mb-8">Content Management</h1>

      <form onSubmit={handleSubmit} className="space-y-8" data-testid="content-form">
        <Tabs defaultValue="banner" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="banner">Banner</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="banner" className="space-y-6 mt-6">
            <div className="bg-card border border-border p-6">
              <h2 className="font-heading text-2xl font-bold mb-4">Banner Section</h2>
              <div className="space-y-4">
                <div>
                  <Label>Image URL</Label>
                  <Input
                    value={formData.banner?.image_url || ''}
                    onChange={(e) => updateNestedField('banner.image_url', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    data-testid="banner-image-url"
                  />
                </div>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Sub-headline (English)</Label>
                    <Input
                      value={formData.banner?.sub_headline?.en || ''}
                      onChange={(e) => updateNestedField('banner.sub_headline.en', e.target.value)}
                      data-testid="banner-sub-headline-en"
                    />
                  </div>
                  <div>
                    <Label>Sub-headline (Kannada)</Label>
                    <Input
                      value={formData.banner?.sub_headline?.kn || ''}
                      onChange={(e) => updateNestedField('banner.sub_headline.kn', e.target.value)}
                      data-testid="banner-sub-headline-kn"
                    />
                  </div>
                  <div>
                    <Label>Sub-headline (Hindi)</Label>
                    <Input
                      value={formData.banner?.sub_headline?.hi || ''}
                      onChange={(e) => updateNestedField('banner.sub_headline.hi', e.target.value)}
                      data-testid="banner-sub-headline-hi"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>CTA Text (English)</Label>
                    <Input
                      value={formData.banner?.cta_text?.en || ''}
                      onChange={(e) => updateNestedField('banner.cta_text.en', e.target.value)}
                      data-testid="banner-cta-en"
                    />
                  </div>
                  <div>
                    <Label>CTA Text (Kannada)</Label>
                    <Input
                      value={formData.banner?.cta_text?.kn || ''}
                      onChange={(e) => updateNestedField('banner.cta_text.kn', e.target.value)}
                      data-testid="banner-cta-kn"
                    />
                  </div>
                  <div>
                    <Label>CTA Text (Hindi)</Label>
                    <Input
                      value={formData.banner?.cta_text?.hi || ''}
                      onChange={(e) => updateNestedField('banner.cta_text.hi', e.target.value)}
                      data-testid="banner-cta-hi"
                    />
                  </div>
                </div>
                <div>
                  <Label>CTA Link</Label>
                  <Input
                    value={formData.banner?.cta_link || ''}
                    onChange={(e) => updateNestedField('banner.cta_link', e.target.value)}
                    placeholder="/booking"
                    data-testid="banner-cta-link"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="featured" className="space-y-6 mt-6">
            <div className="bg-card border border-border p-6">
              <h2 className="font-heading text-2xl font-bold mb-4">Featured Section</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Title (English)</Label>
                    <Input
                      value={formData.featured?.title?.en || ''}
                      onChange={(e) => updateNestedField('featured.title.en', e.target.value)}
                      data-testid="featured-title-en"
                    />
                  </div>
                  <div>
                    <Label>Title (Kannada)</Label>
                    <Input
                      value={formData.featured?.title?.kn || ''}
                      onChange={(e) => updateNestedField('featured.title.kn', e.target.value)}
                      data-testid="featured-title-kn"
                    />
                  </div>
                  <div>
                    <Label>Title (Hindi)</Label>
                    <Input
                      value={formData.featured?.title?.hi || ''}
                      onChange={(e) => updateNestedField('featured.title.hi', e.target.value)}
                      data-testid="featured-title-hi"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="about" className="space-y-6 mt-6">
            <div className="bg-card border border-border p-6">
              <h2 className="font-heading text-2xl font-bold mb-4">About Section</h2>
              <div className="space-y-4">
                <div>
                  <Label>Image URL</Label>
                  <Input
                    value={formData.about?.image_url || ''}
                    onChange={(e) => updateNestedField('about.image_url', e.target.value)}
                    placeholder="https://example.com/about.jpg"
                    data-testid="about-image-url"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Title (English)</Label>
                    <Input
                      value={formData.about?.title?.en || ''}
                      onChange={(e) => updateNestedField('about.title.en', e.target.value)}
                      data-testid="about-title-en"
                    />
                  </div>
                  <div>
                    <Label>Title (Kannada)</Label>
                    <Input
                      value={formData.about?.title?.kn || ''}
                      onChange={(e) => updateNestedField('about.title.kn', e.target.value)}
                      data-testid="about-title-kn"
                    />
                  </div>
                  <div>
                    <Label>Title (Hindi)</Label>
                    <Input
                      value={formData.about?.title?.hi || ''}
                      onChange={(e) => updateNestedField('about.title.hi', e.target.value)}
                      data-testid="about-title-hi"
                    />
                  </div>
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
                <div>
                  <Label>Description (Kannada)</Label>
                  <Textarea
                    value={formData.about?.description?.kn || ''}
                    onChange={(e) => updateNestedField('about.description.kn', e.target.value)}
                    rows={4}
                    data-testid="about-description-kn"
                  />
                </div>
                <div>
                  <Label>Description (Hindi)</Label>
                  <Textarea
                    value={formData.about?.description?.hi || ''}
                    onChange={(e) => updateNestedField('about.description.hi', e.target.value)}
                    rows={4}
                    data-testid="about-description-hi"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Button type="submit" className="font-ui uppercase tracking-wider" data-testid="submit-content-button">
          Update Content
        </Button>
      </form>
    </div>
  );
};
