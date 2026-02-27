import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export const PublicHome = ({ content, offers, services, clientId }) => {
  const { t } = useLanguage();

  if (!content) return null;

  return (
    <div data-testid="public-home">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: `url(${content.banner?.image_url || 'https://images.unsplash.com/photo-1749800541964-11bd2ea60259?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjV8MHwxfHNlYXJjaHwzfHxhcnRpc3RpYyUyMGZhc2hpb24lMjBwb3J0cmFpdCUyMHdvbWFuJTIwb3V0ZG9vciUyMGdvbGRlbiUyMGhvdXJ8ZW58MHx8fHwxNzcyMTYwNTQwfDA&ixlib=rb-4.1.0&q=85'})` 
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight" data-testid="hero-headline">
            {t(content.banner?.headline)}
          </h1>
          <p className="font-body text-xl sm:text-2xl text-white/90 mb-8" data-testid="hero-subheadline">
            {t(content.banner?.sub_headline)}
          </p>
          <Link to="booking">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm font-ui uppercase tracking-wider px-12 py-6 text-lg" data-testid="hero-cta-button">
              {t(content.banner?.cta_text)}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {offers && offers.length > 0 && (
        <section className="py-16 px-6 bg-primary/5">
          <div className="max-w-7xl mx-auto">
            {offers.map((offer) => (
              <motion.div
                key={offer.offer_id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card border-2 border-primary p-8 rounded-sm"
                data-testid="offer-banner"
              >
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <Badge className="mb-3 bg-primary text-primary-foreground">
                      {t({ en: 'Special Offer', kn: 'ವಿಶೇಷ ಆಫರ್', hi: 'विशेष प्रस्ताव' })}
                    </Badge>
                    <h2 className="font-heading text-3xl font-bold mb-2">{t(offer.title)}</h2>
                    <p className="font-body text-muted-foreground mb-4">{t(offer.description)}</p>
                    {offer.discount_percentage && (
                      <p className="font-ui text-2xl font-bold text-primary">{offer.discount_percentage}% OFF</p>
                    )}
                    {offer.flat_discount && (
                      <p className="font-ui text-2xl font-bold text-primary">FLAT ₹{offer.flat_discount} OFF</p>
                    )}
                  </div>
                  <Link to="booking">
                    <Button className="font-ui uppercase tracking-wider" data-testid="offer-cta-button">
                      {t({ en: 'Book Now', kn: 'ಈಗ ಬುಕ್ ಮಾಡಿ', hi: 'अभी बुक करें' })}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4" data-testid="featured-title">
              {t(content.featured?.title)}
            </h2>
            <p className="font-body text-lg text-muted-foreground">
              {t(content.featured?.description)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.slice(0, 3).map((service, index) => (
              <motion.div
                key={service.service_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-[3/4] overflow-hidden bg-card border border-border"
                data-testid="featured-service"
              >
                {service.image_url && (
                  <img 
                    src={service.image_url} 
                    alt={t(service.name)} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="font-heading text-2xl font-bold mb-2">{t(service.name)}</h3>
                    <p className="font-body text-sm text-white/80">{t(service.description)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="services">
              <Button variant="outline" size="lg" className="font-ui uppercase tracking-wider" data-testid="view-all-services-button">
                {t({ en: 'View All Services', kn: 'ಎಲ್ಲಾ ಸೇವೆಗಳನ್ನು ಹಿಡಿರಿಸಿ', hi: 'सभी सेवाएं देखें' })}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-6" data-testid="about-title">
                {t(content.about?.title)}
              </h2>
              <p className="font-body text-lg text-muted-foreground mb-8">
                {t(content.about?.description)}
              </p>
              <Link to="about">
                <Button variant="outline" className="font-ui uppercase tracking-wider" data-testid="learn-more-button">
                  {t({ en: 'Learn More', kn: 'ಹೆಚ್ಚು ತಿಳಿಯಿರಿ', hi: 'और जानें' })}
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/5]"
            >
              <img
                src={content.about?.image_url || 'https://images.unsplash.com/photo-1764013003144-2e367f91c690?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBwaG90b2dyYXBoZXIlMjB0YWtpbmclMjBwaG90b3MlMjBpbiUyMHN0dWRpb3xlbnwwfHx8fDE3NzIxNjA1MTV8MA&ixlib=rb-4.1.0&q=85'}
                alt={t(content.about?.title)}
                className="w-full h-full object-cover border border-border"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
