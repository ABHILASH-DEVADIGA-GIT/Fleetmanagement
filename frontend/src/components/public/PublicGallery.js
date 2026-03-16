import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export const PublicGallery = ({ gallery, siteContent }) => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!gallery || gallery.length === 0) {
    return (
      <div data-testid="public-gallery" className="py-24 px-6 text-center">
        <p className="text-muted-foreground">
          {t({ en: 'No images in gallery yet', kn: 'ಗ್ಯಾಲರಿಯಲ್ಲಿ ಇನ್ನೂ ಚಿತ್ರಗಳಿಲ್ಲ', hi: 'गैलरी में अभी तक कोई चित्र नहीं' })}
        </p>
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
      {/* Header */}
      <section className="bg-primary/5 py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
            {t(siteContent?.gallery_section?.title) || t({ en: 'Our Gallery', kn: 'ನಮ್ಮ ಗ್ಯಾಲರಿ', hi: 'हमारी गैलरी' })}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t(siteContent?.gallery_section?.subtitle) || t({ en: 'Explore our work', kn: 'ನಮ್ಮ ಕೆಲಸ ಅನ್ವೇಷಿಸಿ', hi: 'हमारा काम देखें' })}
          </p>
        </div>
      </section>

      {/* Category Filter */}
      {categories.length > 1 && (
        <section className="py-6 px-6 border-b">
          <div className="max-w-7xl mx-auto flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="capitalize"
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
                className="aspect-square cursor-pointer group relative overflow-hidden rounded-lg"
                onClick={() => setSelectedImage(image)}
              >
                <img 
                  src={image.image_url} 
                  alt={image.title || 'Gallery image'} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-4 opacity-0 group-hover:opacity-100">
                  {image.title && (
                    <p className="text-white font-semibold">{image.title}</p>
                  )}
                </div>
                {image.is_featured && (
                  <Badge className="absolute top-2 right-2 bg-yellow-500">Featured</Badge>
                )}
              </motion.div>
            ))}
          </div>
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
              className="absolute top-4 right-4 text-white hover:bg-white/20"
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
                <ChevronLeft className="h-8 w-8" />
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
              className="max-w-[90vw] max-h-[90vh] object-contain"
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
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}

            {/* Image Info */}
            {(selectedImage.title || selectedImage.description) && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-white max-w-lg">
                {selectedImage.title && <h3 className="font-semibold text-lg">{selectedImage.title}</h3>}
                {selectedImage.description && <p className="text-sm text-white/80 mt-1">{selectedImage.description}</p>}
              </div>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 right-4 text-white/60 text-sm">
              {currentIndex + 1} / {filteredImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
