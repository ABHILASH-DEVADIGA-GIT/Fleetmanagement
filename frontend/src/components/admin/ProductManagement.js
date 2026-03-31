import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Edit, Trash2, Package, Image, Tag, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';
import { MultiImageUpload } from '../shared/ImageUpload';
import { getImageUrl } from '../../utils/imageUrl';

export const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: { en: '', kn: '', hi: '' },
    description: { en: '', kn: '', hi: '' },
    images: [],
    base_price: 0,
    discount_percentage: 0,
    category: '',
    is_active: true
  });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCategoryName, setNewCategoryName] = useState({ en: '', kn: '', hi: '' });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const [productLimit, setProductLimit] = useState(100);
  const [productCount, setProductCount] = useState(0);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/admin/products');
      // Handle both array response and object with {products, count, limit}
      if (Array.isArray(response.data)) {
        setProducts(response.data);
        setProductCount(response.data.length);
      } else if (response.data && response.data.products) {
        setProducts(response.data.products);
        setProductCount(response.data.count || response.data.products.length);
        setProductLimit(response.data.limit || 100);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Failed to fetch products');
      setProducts([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/product-categories');
      // Handle both array response and object with categories
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else if (response.data && response.data.categories) {
        setCategories(response.data.categories);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Failed to fetch categories');
      setCategories([]);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.en || !formData.base_price) {
      toast.error('Please fill in product name and price');
      return;
    }

    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.product_id}`, formData);
        toast.success('Product updated');
      } else {
        await api.post('/admin/products', formData);
        toast.success('Product created');
      }
      setDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/admin/products/${productId}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || { en: '', kn: '', hi: '' },
      description: product.description || { en: '', kn: '', hi: '' },
      images: product.images || [],
      base_price: product.base_price || 0,
      discount_percentage: product.discount_percentage || 0,
      category: product.category || '',
      is_active: product.is_active !== false
    });
    setDialogOpen(true);
  };

  const toggleActive = async (product) => {
    try {
      await api.put(`/admin/products/${product.product_id}`, { is_active: !product.is_active });
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const addImage = () => {
    if (!newImageUrl) return;
    setFormData(prev => ({ ...prev, images: [...prev.images, newImageUrl] }));
    setNewImageUrl('');
  };

  const removeImage = (index) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.en) {
      toast.error('Please enter category name');
      return;
    }
    try {
      await api.post('/admin/product-categories', { name: newCategoryName });
      toast.success('Category created');
      setCategoryDialogOpen(false);
      setNewCategoryName({ en: '', kn: '', hi: '' });
      fetchCategories();
    } catch (error) {
      toast.error('Failed to create category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/admin/product-categories/${categoryId}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: { en: '', kn: '', hi: '' },
      description: { en: '', kn: '', hi: '' },
      images: [],
      base_price: 0,
      discount_percentage: 0,
      category: '',
      is_active: true
    });
    setNewImageUrl('');
  };

  const calculateFinalPrice = () => {
    return formData.base_price * (1 - formData.discount_percentage / 100);
  };

  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.category_id === categoryId);
    return cat?.name?.en || categoryId || 'Uncategorized';
  };

  return (
    <div data-testid="product-management" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Product Catalog</h1>
          <p className="text-muted-foreground mt-1">Manage your products for display</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCategoryDialogOpen(true)}>
            <Tag className="mr-2 h-4 w-4" />
            Categories
          </Button>
          <Button onClick={() => { resetForm(); setDialogOpen(true); }} data-testid="add-product-btn">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase">Total Products</p>
          <p className="text-2xl font-bold">{productCount} / {productLimit}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase">Active</p>
          <p className="text-2xl font-bold text-green-600">{Array.isArray(products) ? products.filter(p => p.is_active).length : 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase">With Discount</p>
          <p className="text-2xl font-bold text-blue-600">{Array.isArray(products) ? products.filter(p => p.discount_percentage > 0).length : 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase">Categories</p>
          <p className="text-2xl font-bold">{Array.isArray(categories) ? categories.length : 0}</p>
        </Card>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!Array.isArray(products) || products.length === 0 ? (
          <Card className="col-span-full p-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Products Yet</h3>
            <p className="text-muted-foreground mb-4">Add your first product to the catalog</p>
            <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Card>
        ) : (
          products.map(product => (
            <Card key={product.product_id} className="overflow-hidden" data-testid={`product-${product.product_id}`}>
              {/* Product Image */}
              <div className="aspect-video bg-muted relative">
                {product.images && product.images[0] ? (
                  <img 
                    src={getImageUrl(product.images[0])} 
                    alt={product.name?.en} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                {product.discount_percentage > 0 && (
                  <Badge className="absolute top-2 right-2 bg-red-500">
                    {product.discount_percentage}% OFF
                  </Badge>
                )}
                {!product.is_active && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="secondary">Inactive</Badge>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{product.name?.en || 'Unnamed'}</h3>
                    {product.category && (
                      <Badge variant="outline" className="text-xs mt-1">{getCategoryName(product.category)}</Badge>
                    )}
                  </div>
                  <Switch
                    checked={product.is_active}
                    onCheckedChange={() => toggleActive(product)}
                  />
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {product.description?.en || 'No description'}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  {product.discount_percentage > 0 ? (
                    <>
                      <span className="text-lg font-bold text-primary">₹{product.final_price?.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground line-through">₹{product.base_price?.toLocaleString()}</span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-primary">₹{product.base_price?.toLocaleString()}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(product)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(product.product_id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(value) => { setDialogOpen(value); if (!value) resetForm(); }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="en" className="mt-4">
            <TabsList>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="kn">ಕನ್ನಡ</TabsTrigger>
              <TabsTrigger value="hi">हिंदी</TabsTrigger>
            </TabsList>

            {['en', 'kn', 'hi'].map(lang => (
              <TabsContent key={lang} value={lang} className="space-y-4">
                <div>
                  <Label>Product Name {lang === 'en' && '*'}</Label>
                  <Input
                    value={formData.name[lang]}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      name: { ...prev.name, [lang]: e.target.value }
                    }))}
                    placeholder={`Product name in ${lang === 'en' ? 'English' : lang === 'kn' ? 'Kannada' : 'Hindi'}`}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description[lang]}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      description: { ...prev.description, [lang]: e.target.value }
                    }))}
                    placeholder="Product description..."
                    rows={3}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Images */}
          <MultiImageUpload
            label="Product Images"
            values={formData.images}
            onChange={(urls) => setFormData(prev => ({ ...prev, images: urls }))}
            category="products"
            maxFiles={5}
          />

          {/* Pricing & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Base Price (₹) *</Label>
              <Input
                type="number"
                value={formData.base_price}
                onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })}
                min={0}
              />
            </div>
            <div>
              <Label>Discount (%)</Label>
              <Input
                type="number"
                value={formData.discount_percentage}
                onChange={(e) => setFormData({ ...formData, discount_percentage: parseFloat(e.target.value) || 0 })}
                min={0}
                max={100}
              />
            </div>
          </div>

          {/* Final Price Preview */}
          {formData.base_price > 0 && (
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-baseline gap-3">
                <span className="text-sm text-muted-foreground">Final Price:</span>
                <span className="text-2xl font-bold text-primary">₹{calculateFinalPrice().toLocaleString()}</span>
                {formData.discount_percentage > 0 && (
                  <span className="text-sm line-through text-muted-foreground">₹{formData.base_price.toLocaleString()}</span>
                )}
              </div>
            </div>
          )}

          {/* Category */}
          <div>
            <Label>Category</Label>
            <Select value={formData.category || 'none'} onValueChange={(value) => setFormData({ ...formData, category: value === 'none' ? '' : value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Category</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.category_id} value={cat.category_id}>
                    {cat.name?.en || cat.category_id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label>Product is Active</Label>
          </div>

          <Button onClick={handleSubmit} className="w-full" data-testid="save-product-btn">
            {editingProduct ? 'Update Product' : 'Create Product'}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Categories Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Add New Category */}
            <div className="space-y-2">
              <Label>Add New Category</Label>
              <div className="flex gap-2">
                <Input
                  value={newCategoryName.en}
                  onChange={(e) => setNewCategoryName({ ...newCategoryName, en: e.target.value })}
                  placeholder="Category name (English)"
                />
                <Button onClick={handleCreateCategory}>Add</Button>
              </div>
            </div>

            {/* Existing Categories */}
            <div className="space-y-2">
              <Label>Existing Categories</Label>
              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground">No categories yet</p>
              ) : (
                <div className="space-y-2">
                  {categories.map(cat => (
                    <div key={cat.category_id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <span>{cat.name?.en || cat.category_id}</span>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteCategory(cat.category_id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
