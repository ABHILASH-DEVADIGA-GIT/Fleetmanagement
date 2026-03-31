import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Edit, Trash2, Image, Star, X, GripVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { ImageUpload } from '../shared/ImageUpload';
import { getImageUrl } from '../../utils/imageUrl';

export const GalleryManagement = () => {
  const [images, setImages] = useState([]);
  const [galleryLimit, setGalleryLimit] = useState(50);
  const [galleryCount, setGalleryCount] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [formData, setFormData] = useState({
    image_url: '',
    title: '',
    description: '',
    category: '',
    is_featured: false
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await api.get('/admin/gallery');
      // Handle both array response and object with {images, count, limit}
      if (Array.isArray(response.data)) {
        setImages(response.data);
        setGalleryCount(response.data.length);
      } else if (response.data && response.data.images) {
        setImages(response.data.images);
        setGalleryCount(response.data.count || response.data.images.length);
        setGalleryLimit(response.data.limit || 50);
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error('Failed to fetch gallery');
      setImages([]);
    }
  };

  const handleSubmit = async () => {
    if (!formData.image_url) {
      toast.error('Please enter an image URL');
      return;
    }

    try {
      if (editingImage) {
        await api.put(`/admin/gallery/${editingImage.image_id}`, formData);
        toast.success('Image updated');
      } else {
        await api.post('/admin/gallery', formData);
        toast.success('Image added to gallery');
      }
      setDialogOpen(false);
      resetForm();
      fetchImages();
    } catch (error) {
      toast.error('Failed to save image');
    }
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm('Remove this image from gallery?')) return;
    try {
      await api.delete(`/admin/gallery/${imageId}`);
      toast.success('Image removed');
      fetchImages();
    } catch (error) {
      toast.error('Failed to remove image');
    }
  };

  const handleEdit = (image) => {
    setEditingImage(image);
    setFormData({
      image_url: image.image_url,
      title: image.title || '',
      description: image.description || '',
      category: image.category || '',
      is_featured: image.is_featured || false
    });
    setDialogOpen(true);
  };

  const toggleFeatured = async (image) => {
    try {
      await api.put(`/admin/gallery/${image.image_id}`, { is_featured: !image.is_featured });
      fetchImages();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const resetForm = () => {
    setEditingImage(null);
    setFormData({
      image_url: '',
      title: '',
      description: '',
      category: '',
      is_featured: false
    });
  };

  const categories = [...new Set((Array.isArray(images) ? images : []).map(img => img.category).filter(Boolean))];

  return (
    <div data-testid="gallery-management" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Gallery</h1>
          <p className="text-muted-foreground mt-1">Manage your photo gallery</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }} data-testid="add-gallery-btn">
          <Plus className="mr-2 h-4 w-4" />
          Add Image
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase">Total Images</p>
          <p className="text-2xl font-bold">{images.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase">Featured</p>
          <p className="text-2xl font-bold text-yellow-600">{images.filter(i => i.is_featured).length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase">Categories</p>
          <p className="text-2xl font-bold">{categories.length}</p>
        </Card>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.length === 0 ? (
          <Card className="col-span-full p-12 text-center">
            <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Images Yet</h3>
            <p className="text-muted-foreground mb-4">Add images to your gallery</p>
            <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Image
            </Button>
          </Card>
        ) : (
          images.map(image => (
            <Card key={image.image_id} className="overflow-hidden group relative">
              <div className="aspect-square">
                <img 
                  src={getImageUrl(image.image_url)} 
                  alt={image.title || 'Gallery image'} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Featured Badge */}
              {image.is_featured && (
                <Badge className="absolute top-2 left-2 bg-yellow-500">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}

              {/* Category Badge */}
              {image.category && (
                <Badge variant="secondary" className="absolute top-2 right-2">
                  {image.category}
                </Badge>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                {image.title && <p className="text-white font-semibold text-center">{image.title}</p>}
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => toggleFeatured(image)}>
                    <Star className={`h-4 w-4 ${image.is_featured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(image)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(image.image_id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(value) => { setDialogOpen(value); if (!value) resetForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingImage ? 'Edit Image' : 'Add Image to Gallery'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <ImageUpload
              label="Gallery Image *"
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              category="gallery"
              previewSize="lg"
            />

            <div>
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Image title"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Image description..."
                rows={2}
              />
            </div>

            <div>
              <Label>Category</Label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Wedding, Portrait, Event"
                list="categories"
              />
              <datalist id="categories">
                {categories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
              <Label>Featured Image</Label>
            </div>

            <Button onClick={handleSubmit} className="w-full">
              {editingImage ? 'Update Image' : 'Add to Gallery'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
