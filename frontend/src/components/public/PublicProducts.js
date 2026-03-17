import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SortAsc, X, Phone, ShoppingBag, Package, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Dialog, DialogContent } from '../ui/dialog';
import { getImageUrl } from '../../utils/imageUrl';

export const PublicProducts = ({ products: initialProducts, categories: initialCategories, clientId, client }) => {
  const { t } = useLanguage();
  const [products, setProducts] = useState(initialProducts || []);
  const [categories, setCategories] = useState(initialCategories || []);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [loading, setLoading] = useState(false);
  const primaryColor = client?.primary_color || '#1e40af';

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
      {/* Hero Header */}
      <section 
        className="py-20 px-6 relative overflow-hidden"
        style={{ backgroundColor: primaryColor }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
              {t({ en: 'Our Catalog', kn: 'ನಮ್ಮ ಕ್ಯಾಟಲಾಗ್', hi: 'हमारी सूची' })}
            </Badge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white">
              {t({ en: 'Our Products', kn: 'ನಮ್ಮ ಉತ್ಪನ್ನಗಳು', hi: 'हमारे उत्पाद' })}
            </h1>
            <p className="text-white/90 max-w-2xl mx-auto text-lg">
              {t({ en: 'Browse our collection of quality products', kn: 'ಗುಣಮಟ್ಟದ ಉತ್ಪನ್ನಗಳ ನಮ್ಮ ಸಂಗ್ರಹ ಬ್ರೌಸ್ ಮಾಡಿ', hi: 'गुणवत्ता वाले उत्पादों का हमारा संग्रह ब्राउज़ करें' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-5 px-6 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { value: products.length || '50+', label: { en: 'Products', kn: 'ಉತ್ಪನ್ನಗಳು', hi: 'उत्पाद' } },
              { value: categories.length || '5+', label: { en: 'Categories', kn: 'ವರ್ಗಗಳು', hi: 'श्रेणियां' } },
              { value: '100%', label: { en: 'Quality', kn: 'ಗುಣಮಟ್ಟ', hi: 'गुणवत्ता' } },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <p className="text-2xl sm:text-3xl font-bold" style={{ color: primaryColor }}>{stat.value}</p>
                <p className="text-muted-foreground text-xs mt-1">{t(stat.label)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 px-6 border-b sticky top-0 bg-white z-10 shadow-sm">
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
            <SelectTrigger className="w-48" style={{ borderColor: `${primaryColor}30` }}>
              <Filter className="h-4 w-4 mr-2" style={{ color: primaryColor }} />
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
            <SelectTrigger className="w-48" style={{ borderColor: `${primaryColor}30` }}>
              <SortAsc className="h-4 w-4 mr-2" style={{ color: primaryColor }} />
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
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => { setSelectedCategory(''); setSortBy(''); setSearchQuery(''); }}
              style={{ color: primaryColor }}
            >
              <X className="h-4 w-4 mr-1" />
              {t({ en: 'Clear', kn: 'ತೆರವುಗೊಳಿಸಿ', hi: 'साफ करें' })}
            </Button>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-6" style={{ backgroundColor: `${primaryColor}05` }}>
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Package className="h-16 w-16 mx-auto mb-4" style={{ color: `${primaryColor}30` }} />
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
                    className="overflow-hidden cursor-pointer group hover:shadow-xl transition-all bg-white border-0 shadow-md"
                    onClick={() => setSelectedProduct(product)}
                    data-testid={`product-card-${product.product_id}`}
                  >
                    {/* Product Image */}
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      {product.images && product.images[0] ? (
                        <img 
                          src={getImageUrl(product.images[0])} 
                          alt={t(product.name)} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}10` }}>
                          <ShoppingBag className="h-12 w-12" style={{ color: `${primaryColor}30` }} />
                        </div>
                      )}
                      {product.discount_percentage > 0 && (
                        <Badge className="absolute top-3 right-3 bg-red-500 text-white">
                          {product.discount_percentage}% OFF
                        </Badge>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      {product.category && (
                        <Badge 
                          variant="outline" 
                          className="text-xs mb-2"
                          style={{ borderColor: `${primaryColor}30`, color: primaryColor }}
                        >
                          {getCategoryName(product.category)}
                        </Badge>
                      )}
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                        {t(product.name)}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {t(product.description)}
                      </p>

                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold" style={{ color: primaryColor }}>
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

      {/* CTA Section */}
      <section className="py-10 px-6" style={{ backgroundColor: primaryColor }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-2">
            {t({ en: 'Interested in Our Products?', kn: 'ನಮ್ಮ ಉತ್ಪನ್ನಗಳಲ್ಲಿ ಆಸಕ್ತಿ ಇದೆಯೇ?', hi: 'हमारे उत्पादों में रुचि है?' })}
          </h2>
          <p className="text-base opacity-90 mb-5">
            {t({ en: 'Contact us for inquiries and orders', kn: 'ವಿಚಾರಣೆ ಮತ್ತು ಆದೇಶಗಳಿಗಾಗಿ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ', hi: 'पूछताछ और ऑर्डर के लिए संपर्क करें' })}
          </p>
          <Link to={`/site/${clientId}/contact`}>
            <Button size="default" className="font-ui uppercase tracking-wider bg-white hover:bg-white/90" style={{ color: primaryColor }}>
              {t({ en: 'Contact Us', kn: 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ', hi: 'संपर्क करें' })}
            </Button>
          </Link>
        </div>
      </section>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => { if (!open) { setSelectedProduct(null); setSelectedImageIndex(0); } }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Image Gallery */}
              <div style={{ backgroundColor: `${primaryColor}08` }}>
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  <div className="aspect-square relative group">
                    <img 
                      src={getImageUrl(selectedProduct.images[selectedImageIndex])} 
                      alt={t(selectedProduct.name)} 
                      className="w-full h-full object-contain p-4"
                    />
                    {/* View Large Button */}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      onClick={() => setShowLightbox(true)}
                    >
                      <ZoomIn className="h-4 w-4 mr-1" />
                      {t({ en: 'View Large', kn: 'ದೊಡ್ಡದಾಗಿ ನೋಡಿ', hi: 'बड़ा देखें' })}
                    </Button>
                    {/* Navigation Arrows */}
                    {selectedProduct.images.length > 1 && (
                      <>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : selectedProduct.images.length - 1)}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          onClick={() => setSelectedImageIndex(prev => prev < selectedProduct.images.length - 1 ? prev + 1 : 0)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="aspect-square flex items-center justify-center" style={{ backgroundColor: `${primaryColor}10` }}>
                    <ShoppingBag className="h-16 w-16" style={{ color: `${primaryColor}30` }} />
                  </div>
                )}
                {/* Thumbnail Gallery */}
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="flex gap-2 p-4 justify-center">
                    {selectedProduct.images.map((img, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === selectedImageIndex 
                            ? 'ring-2 ring-offset-2' 
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{ 
                          borderColor: idx === selectedImageIndex ? primaryColor : `${primaryColor}30`,
                          ringColor: primaryColor
                        }}
                      >
                        <img 
                          src={getImageUrl(img)} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-8">
                {selectedProduct.category && (
                  <Badge 
                    variant="outline" 
                    className="mb-4"
                    style={{ borderColor: primaryColor, color: primaryColor }}
                  >
                    {getCategoryName(selectedProduct.category)}
                  </Badge>
                )}
                <h2 className="font-heading text-2xl font-bold mb-4">
                  {t(selectedProduct.name)}
                </h2>
                
                {/* Price */}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-bold" style={{ color: primaryColor }}>
                    ₹{selectedProduct.final_price?.toLocaleString()}
                  </span>
                  {selectedProduct.discount_percentage > 0 && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">
                        ₹{selectedProduct.base_price?.toLocaleString()}
                      </span>
                      <Badge className="bg-red-500 text-white">
                        {selectedProduct.discount_percentage}% OFF
                      </Badge>
                    </>
                  )}
                </div>

                <div className="mb-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {t(selectedProduct.description)}
                  </p>
                </div>

                {/* Contact Button - Only Phone */}
                {client && client.phone && (
                  <div className="pt-6 border-t">
                    <p className="text-sm text-muted-foreground font-medium mb-3">
                      {t({ en: 'Interested? Contact us:', kn: 'ಆಸಕ್ತಿ ಇದೆಯೇ? ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ:', hi: 'रुचि है? संपर्क करें:' })}
                    </p>
                    <a href={`tel:${client.phone}`}>
                      <Button className="w-full text-white" size="lg" style={{ backgroundColor: primaryColor }}>
                        <Phone className="h-4 w-4 mr-2" />
                        {t({ en: 'Call', kn: 'ಕರೆ', hi: 'कॉल करें' })} {client.phone}
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {showLightbox && selectedProduct && selectedProduct.images && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center"
            onClick={() => setShowLightbox(false)}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-50"
              onClick={() => setShowLightbox(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Previous Button */}
            {selectedProduct.images.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 text-white hover:bg-white/20 h-12 w-12"
                onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(prev => prev > 0 ? prev - 1 : selectedProduct.images.length - 1); }}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}

            {/* Image */}
            <motion.img
              key={selectedImageIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={getImageUrl(selectedProduct.images[selectedImageIndex])}
              alt={t(selectedProduct.name)}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next Button */}
            {selectedProduct.images.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 text-white hover:bg-white/20 h-12 w-12"
                onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(prev => prev < selectedProduct.images.length - 1 ? prev + 1 : 0); }}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/50 px-4 py-2 rounded-full">
              {selectedImageIndex + 1} / {selectedProduct.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
