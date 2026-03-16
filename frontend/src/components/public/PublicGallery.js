import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Image, Camera } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Link } from 'react-router-dom';

export const PublicGallery = ({ gallery, siteContent, client, clientId }) => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const primaryColor = client?.primary_color || '#1e40af';

  if (!gallery || gallery.length === 0) {
    return (
      <div data-testid="public-gallery" className="bg-background">
        {/* Header */}
        <section 
          className="py-20 px-6 relative overflow-hidden"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              {t({ en: 'Our Work', kn: 'ನಮ್ಮ ಕೆಲಸ', hi: 'हमारा काम' })}
            </Badge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white">
              {t(siteContent?.gallery_section?.title) || t({ en: 'Our Gallery', kn: 'ನಮ್ಮ ಗ್ಯಾಲರಿ', hi: 'हमारी गैलरी' })}
            </h1>
          </div>
        </section>
        
        <div className="py-24 px-6 text-center">
          <Image className="h-16 w-16 mx-auto mb-4" style={{ color: `${primaryColor}30` }} />
          <p className="text-muted-foreground text-lg">
            {t({ en: 'No images in gallery yet', kn: 'ಗ್ಯಾಲರಿಯಲ್ಲಿ ಇನ್ನೂ ಚಿತ್ರಗಳಿಲ್ಲ', hi: 'गैलरी में अभी तक कोई चित्र नहीं' })}
          </p>
        </div>
      </div>
    );
  }

  const categories = ['all', ...new Set(gallery.map(img => img.category).filter(Boolean))];
  const filteredImages = selectedCategory === 'all' 
    ? gallery 
    : gallery.filter(img => img.category === selectedCategory);

  const currentIndex = selectedImage ? filteredImages.findIndex(img => img.image_id === selectedImage.image_id) : -1;

  const goToNext = () => {
    if (currentIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[currentIndex + 1]);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setSelectedImage(filteredImages[currentIndex - 1]);
    }
  };

  return (
    <div data-testid="public-gallery" className="min-h-screen bg-background">
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
              {t({ en: 'Our Work', kn: 'ನಮ್ಮ ಕೆಲಸ', hi: 'हमारा काम' })}
            </Badge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white">
              {t(siteContent?.gallery_section?.title) || t({ en: 'Our Gallery', kn: 'ನಮ್ಮ ಗ್ಯಾಲರಿ', hi: 'हमारी गैलरी' })}
            </h1>
            <p className="text-white/90 max-w-2xl mx-auto text-lg">
              {t(siteContent?.gallery_section?.subtitle) || t({ en: 'Explore our portfolio of beautiful moments captured', kn: 'ಸೆರೆಹಿಡಿದ ಸುಂದರ ಕ್ಷಣಗಳ ನಮ್ಮ ಪೋರ್ಟ್‌ಫೋಲಿಯೊ ಅನ್ವೇಷಿಸಿ', hi: 'कैप्चर किए गए सुंदर पलों का हमारा पोर्टफोलियो देखें' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 px-6 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { value: gallery.length, label: { en: 'Photos', kn: 'ಫೋಟೋಗಳು', hi: 'तस्वीरें' } },
              { value: categories.length - 1 || 1, label: { en: 'Categories', kn: 'ವರ್ಗಗಳು', hi: 'श्रेणियां' } },
              { value: gallery.filter(g => g.is_featured).length || '5+', label: { en: 'Featured', kn: 'ವೈಶಿಷ್ಟ್ಯ', hi: 'विशेष' } },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <p className="text-3xl sm:text-4xl font-bold" style={{ color: primaryColor }}>{stat.value}</p>
                <p className="text-muted-foreground text-sm mt-1">{t(stat.label)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      {categories.length > 1 && (
        <section className="py-6 px-6" style={{ backgroundColor: `${primaryColor}05` }}>
          <div className="max-w-7xl mx-auto flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="capitalize"
                style={selectedCategory === cat ? { backgroundColor: primaryColor } : { borderColor: `${primaryColor}50`, color: primaryColor }}
              >
                {cat === 'all' ? t({ en: 'All', kn: 'ಎಲ್ಲಾ', hi: 'सभी' }) : cat}
              </Button>
            ))}
          </div>
        </section>
      )}

      {/* Gallery Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.image_id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="aspect-square cursor-pointer group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow"
                onClick={() => setSelectedImage(image)}
              >
                <img 
                  src={image.image_url} 
                  alt={image.title || 'Gallery image'} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  {image.title && (
                    <p className="text-white font-semibold">{image.title}</p>
                  )}
                </div>
                {image.is_featured && (
                  <Badge 
                    className="absolute top-3 right-3 text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Featured
                  </Badge>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6" style={{ backgroundColor: primaryColor }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            {t({ en: 'Want to Be Part of Our Gallery?', kn: 'ನಮ್ಮ ಗ್ಯಾಲರಿಯ ಭಾಗವಾಗಲು ಬಯಸುವಿರಾ?', hi: 'हमारी गैलरी का हिस्सा बनना चाहते हैं?' })}
          </h2>
          <p className="text-lg opacity-90 mb-8">
            {t({ en: "Book your session and let's create beautiful memories together", kn: 'ನಿಮ್ಮ ಸೆಷನ್ ಬುಕ್ ಮಾಡಿ ಮತ್ತು ಒಟ್ಟಿಗೆ ಸುಂದರ ನೆನಪುಗಳನ್ನು ರಚಿಸೋಣ', hi: 'अपना सेशन बुक करें और साथ मिलकर सुंदर यादें बनाएं' })}
          </p>
          <Link to={`/site/${clientId}/booking`}>
            <Button size="lg" className="font-ui uppercase tracking-wider bg-white hover:bg-white/90" style={{ color: primaryColor }}>
              {t({ en: 'Book Now', kn: 'ಈಗ ಬುಕ್ ಮಾಡಿ', hi: 'अभी बुक करें' })}
            </Button>
          </Link>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-50"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Previous Button */}
            {currentIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 text-white hover:bg-white/20"
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
              >
                <ChevronLeft className="h-10 w-10" />
              </Button>
            )}

            {/* Image */}
            <motion.img
              key={selectedImage.image_id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage.image_url}
              alt={selectedImage.title || 'Gallery image'}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next Button */}
            {currentIndex < filteredImages.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 text-white hover:bg-white/20"
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
              >
                <ChevronRight className="h-10 w-10" />
              </Button>
            )}

            {/* Image Info */}
            {(selectedImage.title || selectedImage.description) && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white max-w-lg bg-black/50 px-6 py-4 rounded-xl backdrop-blur-sm">
                {selectedImage.title && <h3 className="font-semibold text-lg">{selectedImage.title}</h3>}
                {selectedImage.description && <p className="text-sm text-white/80 mt-1">{selectedImage.description}</p>}
              </div>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 right-4 text-white/70 text-sm bg-black/50 px-3 py-1 rounded-full">
              {currentIndex + 1} / {filteredImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
