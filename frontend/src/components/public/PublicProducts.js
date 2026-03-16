import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, SortAsc, X, ArrowLeft, Phone, Mail } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Dialog, DialogContent } from '../ui/dialog';

export const PublicProducts = ({ products: initialProducts, categories: initialCategories, clientId, client }) => {
  const { t } = useLanguage();
  const [products, setProducts] = useState(initialProducts || []);
  const [categories, setCategories] = useState(initialCategories || []);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialProducts) {
      setProducts(initialProducts);
    }
    if (initialCategories) {
      setCategories(initialCategories);
    }
  }, [initialProducts, initialCategories]);

  const fetchProducts = async () => {
    if (!clientId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (sortBy) params.append('sort', sortBy);
      
      const response = await api.get(`/public/products/${clientId}?${params.toString()}`);
      setProducts(response.data.products);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory || sortBy) {
      fetchProducts();
    }
  }, [selectedCategory, sortBy]);

  // Filter products by search query
  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true;
    const name = t(product.name)?.toLowerCase() || '';
    const desc = t(product.description)?.toLowerCase() || '';
    return name.includes(searchQuery.toLowerCase()) || desc.includes(searchQuery.toLowerCase());
  });

  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.category_id === categoryId);
    return cat ? t(cat.name) : categoryId;
  };

  return (
    <div data-testid="public-products" className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary/5 py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
            {t({ en: 'Our Products', kn: 'ನಮ್ಮ ಉತ್ಪನ್ನಗಳು', hi: 'हमारे उत्पाद' })}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t({ en: 'Browse our catalog', kn: 'ನಮ್ಮ ಕ್ಯಾಟಲಾಗ್ ಬ್ರೌಸ್ ಮಾಡಿ', hi: 'हमारी सूची ब्राउज़ करें' })}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 px-6 border-b sticky top-0 bg-background z-10">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t({ en: 'Search products...', kn: 'ಉತ್ಪನ್ನಗಳನ್ನು ಹುಡುಕಿ...', hi: 'उत्पाद खोजें...' })}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory || 'all'} onValueChange={(v) => setSelectedCategory(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t({ en: 'All Categories', kn: 'ಎಲ್ಲಾ ವರ್ಗಗಳು', hi: 'सभी श्रेणियां' })} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t({ en: 'All Categories', kn: 'ಎಲ್ಲಾ ವರ್ಗಗಳು', hi: 'सभी श्रेणियां' })}</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.category_id} value={cat.category_id}>
                  {t(cat.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy || 'default'} onValueChange={(v) => setSortBy(v === 'default' ? '' : v)}>
            <SelectTrigger className="w-48">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t({ en: 'Sort by', kn: 'ಮೂಲಕ ವಿಂಗಡಿಸಿ', hi: 'इसके द्वारा क्रमबद्ध करें' })} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">{t({ en: 'Default', kn: 'ಡೀಫಾಲ್ಟ್', hi: 'डिफ़ॉल्ट' })}</SelectItem>
              <SelectItem value="price_asc">{t({ en: 'Price: Low to High', kn: 'ಬೆಲೆ: ಕಡಿಮೆಯಿಂದ ಹೆಚ್ಚು', hi: 'मूल्य: कम से उच्च' })}</SelectItem>
              <SelectItem value="price_desc">{t({ en: 'Price: High to Low', kn: 'ಬೆಲೆ: ಹೆಚ್ಚಿನಿಂದ ಕಡಿಮೆ', hi: 'मूल्य: उच्च से कम' })}</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {(selectedCategory || sortBy || searchQuery) && (
            <Button variant="ghost" size="sm" onClick={() => { setSelectedCategory(''); setSortBy(''); setSearchQuery(''); }}>
              <X className="h-4 w-4 mr-1" />
              {t({ en: 'Clear', kn: 'ತೆರವುಗೊಳಿಸಿ', hi: 'साफ करें' })}
            </Button>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                {t({ en: 'No products found', kn: 'ಯಾವುದೇ ಉತ್ಪನ್ನಗಳು ಕಂಡುಬಂದಿಲ್ಲ', hi: 'कोई उत्पाद नहीं मिला' })}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.product_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className="overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedProduct(product)}
                    data-testid={`product-card-${product.product_id}`}
                  >
                    {/* Product Image */}
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      {product.images && product.images[0] ? (
                        <img 
                          src={product.images[0]} 
                          alt={t(product.name)} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No Image
                        </div>
                      )}
                      {product.discount_percentage > 0 && (
                        <Badge className="absolute top-3 right-3 bg-red-500 text-white">
                          {product.discount_percentage}% OFF
                        </Badge>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      {product.category && (
                        <Badge variant="outline" className="text-xs mb-2">
                          {getCategoryName(product.category)}
                        </Badge>
                      )}
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                        {t(product.name)}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {t(product.description)}
                      </p>

                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-primary">
                          ₹{product.final_price?.toLocaleString()}
                        </span>
                        {product.discount_percentage > 0 && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{product.base_price?.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Image Gallery */}
              <div className="bg-muted">
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  <div className="aspect-square">
                    <img 
                      src={selectedProduct.images[0]} 
                      alt={t(selectedProduct.name)} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="aspect-square flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
                {/* Thumbnail Gallery */}
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="flex gap-2 p-4">
                    {selectedProduct.images.slice(0, 4).map((img, idx) => (
                      <img 
                        key={idx} 
                        src={img} 
                        alt="" 
                        className="w-16 h-16 object-cover rounded border cursor-pointer hover:border-primary"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-6">
                {selectedProduct.category && (
                  <Badge variant="outline" className="mb-3">
                    {getCategoryName(selectedProduct.category)}
                  </Badge>
                )}
                <h2 className="font-heading text-2xl font-bold mb-3">
                  {t(selectedProduct.name)}
                </h2>
                
                {/* Price */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-bold text-primary">
                    ₹{selectedProduct.final_price?.toLocaleString()}
                  </span>
                  {selectedProduct.discount_percentage > 0 && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">
                        ₹{selectedProduct.base_price?.toLocaleString()}
                      </span>
                      <Badge className="bg-red-500">
                        {selectedProduct.discount_percentage}% OFF
                      </Badge>
                    </>
                  )}
                </div>

                <div className="prose prose-sm mb-6">
                  <p className="text-muted-foreground">
                    {t(selectedProduct.description)}
                  </p>
                </div>

                {/* Contact Buttons */}
                {client && (
                  <div className="space-y-3 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      {t({ en: 'Interested? Contact us:', kn: 'ಆಸಕ್ತಿ ಇದೆಯೇ? ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ:', hi: 'रुचि है? संपर्क करें:' })}
                    </p>
                    {client.phone && (
                      <a href={`tel:${client.phone}`}>
                        <Button className="w-full" size="lg">
                          <Phone className="h-4 w-4 mr-2" />
                          {t({ en: 'Call', kn: 'ಕರೆ', hi: 'कॉल करें' })} {client.phone}
                        </Button>
                      </a>
                    )}
                    {client.email && (
                      <a href={`mailto:${client.email}?subject=Inquiry about ${t(selectedProduct.name)}`}>
                        <Button variant="outline" className="w-full" size="lg">
                          <Mail className="h-4 w-4 mr-2" />
                          {t({ en: 'Email Inquiry', kn: 'ಇಮೇಲ್ ವಿಚಾರಣೆ', hi: 'ईमेल पूछताछ' })}
                        </Button>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
