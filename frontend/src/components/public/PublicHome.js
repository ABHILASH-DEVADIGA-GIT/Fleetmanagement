import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Camera, Users, Award, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

export const PublicHome = ({ content, siteContent, offers, services, clientId }) => {
  const { t } = useLanguage();

  if (!content && !siteContent) return null;

  // Use siteContent if available, fallback to content
  const heroContent = siteContent?.hero || content?.banner || {};
  const aboutContent = siteContent?.about || content?.about || {};
  const servicesSection = siteContent?.services_section || content?.featured || {};

  return (
    <div data-testid="public-home" className="bg-background">
      {/* Hero Section - Compact & Clean */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Background with gradient overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: `url(${heroContent?.background_image || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1920&q=80'})` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <Badge className="mb-4 bg-primary/90 text-primary-foreground">
              {t({ en: 'Professional Services', kn: 'ವೃತ್ತಿಪರ ಸೇವೆಗಳು', hi: 'पेशेवर सेवाएं' })}
            </Badge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" data-testid="hero-headline">
              {t(heroContent?.headline) || 'Capture Your Special Moments'}
            </h1>
            <p className="font-body text-lg sm:text-xl text-white/85 mb-8 leading-relaxed" data-testid="hero-subheadline">
              {t(heroContent?.sub_headline) || 'Professional photography and videography services for all your special occasions'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="booking">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-ui uppercase tracking-wider px-8" data-testid="hero-cta-button">
                  {t(heroContent?.cta_text) || 'Book Now'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="services">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-ui uppercase tracking-wider px-8">
                  {t({ en: 'Our Services', kn: 'ನಮ್ಮ ಸೇವೆಗಳು', hi: 'हमारी सेवाएं' })}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary text-primary-foreground py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Camera, value: '500+', label: { en: 'Projects', kn: 'ಯೋಜನೆಗಳು', hi: 'प्रोजेक्ट्स' } },
              { icon: Users, value: '300+', label: { en: 'Happy Clients', kn: 'ಸಂತೋಷ ಗ್ರಾಹಕರು', hi: 'खुश ग्राहक' } },
              { icon: Award, value: '10+', label: { en: 'Years Experience', kn: 'ವರ್ಷಗಳ ಅನುಭವ', hi: 'साल का अनुभव' } },
              { icon: Star, value: '4.9', label: { en: 'Rating', kn: 'ರೇಟಿಂಗ್', hi: 'रेटिंग' } },
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center"
              >
                <stat.icon className="h-6 w-6 mb-2 opacity-80" />
                <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                <p className="text-sm opacity-80">{t(stat.label)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      {offers && offers.length > 0 && (
        <section className="py-12 px-6 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="max-w-7xl mx-auto">
            {offers.slice(0, 1).map((offer) => (
              <motion.div
                key={offer.offer_id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card border border-primary/30 p-6 sm:p-8 rounded-lg shadow-sm"
                data-testid="offer-banner"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <Badge className="mb-2 bg-primary/10 text-primary border-0">
                        {t({ en: 'Limited Time Offer', kn: 'ಸೀಮಿತ ಸಮಯದ ಆಫರ್', hi: 'सीमित समय का ऑफर' })}
                      </Badge>
                      <h3 className="font-heading text-xl font-bold">{t(offer.title)}</h3>
                      <p className="text-muted-foreground text-sm">{t(offer.description)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {offer.discount_percentage && (
                      <span className="text-3xl font-bold text-primary">{offer.discount_percentage}% OFF</span>
                    )}
                    <Link to="booking">
                      <Button className="font-ui uppercase tracking-wider">
                        {t({ en: 'Claim Offer', kn: 'ಆಫರ್ ಪಡೆಯಿರಿ', hi: 'ऑफर प्राप्त करें' })}
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="py-16 sm:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              {t({ en: 'What We Offer', kn: 'ನಾವು ಏನು ನೀಡುತ್ತೇವೆ', hi: 'हम क्या प्रदान करते हैं' })}
            </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4" data-testid="featured-title">
              {t(servicesSection?.title) || t({ en: 'Our Services', kn: 'ನಮ್ಮ ಸೇವೆಗಳು', hi: 'हमारी सेवाएं' })}
            </h2>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto">
              {t(servicesSection?.subtitle || servicesSection?.description) || t({ en: 'Professional services tailored to your needs', kn: 'ನಿಮ್ಮ ಅವಶ್ಯಕತೆಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ವೃತ್ತಿಪರ ಸೇವೆಗಳು', hi: 'आपकी जरूरतों के अनुसार पेशेवर सेवाएं' })}
            </p>
          </div>

          {services && services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.slice(0, 6).map((service, index) => (
                <motion.div
                  key={service.service_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden group h-full" data-testid="featured-service">
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      {service.image_url ? (
                        <img 
                          src={service.image_url} 
                          alt={t(service.name)} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5">
                          <Camera className="h-12 w-12 text-primary/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading text-lg font-bold mb-2">{t(service.name)}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">{t(service.description)}</p>
                      {service.price && (
                        <p className="mt-3 text-primary font-bold">
                          {t({ en: 'Starting from', kn: 'ಪ್ರಾರಂಭ', hi: 'शुरू' })} ₹{service.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {t({ en: 'Services coming soon', kn: 'ಸೇವೆಗಳು ಶೀಘ್ರದಲ್ಲೇ', hi: 'सेवाएं जल्द आ रही हैं' })}
            </div>
          )}

          {services && services.length > 0 && (
            <div className="text-center mt-10">
              <Link to="services">
                <Button variant="outline" size="lg" className="font-ui uppercase tracking-wider">
                  {t({ en: 'View All Services', kn: 'ಎಲ್ಲಾ ಸೇವೆಗಳನ್ನು ನೋಡಿ', hi: 'सभी सेवाएं देखें' })}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 sm:py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <Badge variant="outline" className="mb-4">
                {t({ en: 'About Us', kn: 'ನಮ್ಮ ಬಗ್ಗೆ', hi: 'हमारे बारे में' })}
              </Badge>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-6" data-testid="about-title">
                {t(aboutContent?.title) || t({ en: 'Your Trusted Partner', kn: 'ನಿಮ್ಮ ನಂಬಿಕಸ್ಥ ಪಾಲುದಾರ', hi: 'आपका विश्वसनीय साथी' })}
              </h2>
              <p className="font-body text-muted-foreground mb-6 leading-relaxed">
                {t(aboutContent?.description) || t({ en: 'We are dedicated professionals committed to capturing your most precious moments with creativity and excellence.', kn: 'ನಿಮ್ಮ ಅತ್ಯಮೂಲ್ಯ ಕ್ಷಣಗಳನ್ನು ಸೃಜನಶೀಲತೆ ಮತ್ತು ಶ್ರೇಷ್ಠತೆಯೊಂದಿಗೆ ಸೆರೆಹಿಡಿಯಲು ಬದ್ಧರಾದ ಸಮರ್ಪಿತ ವೃತ್ತಿಪರರು ನಾವು.', hi: 'हम समर्पित पेशेवर हैं जो रचनात्मकता और उत्कृष्टता के साथ आपके सबसे कीमती पलों को कैद करने के लिए प्रतिबद्ध हैं।' })}
              </p>
              
              {/* Stats from about content */}
              {aboutContent?.stats && aboutContent.stats.length > 0 && (
                <div className="flex gap-8 mb-8">
                  {aboutContent.stats.map((stat, idx) => (
                    <div key={idx}>
                      <p className="text-3xl font-bold text-primary">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
              
              <Link to="about">
                <Button variant="outline" className="font-ui uppercase tracking-wider" data-testid="learn-more-button">
                  {t({ en: 'Learn More', kn: 'ಹೆಚ್ಚು ತಿಳಿಯಿರಿ', hi: 'और जानें' })}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                <img
                  src={aboutContent?.image_url || 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80'}
                  alt={t(aboutContent?.title) || 'About us'}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            {t({ en: 'Ready to Get Started?', kn: 'ಪ್ರಾರಂಭಿಸಲು ಸಿದ್ಧರಿದ್ದೀರಾ?', hi: 'शुरू करने के लिए तैयार हैं?' })}
          </h2>
          <p className="text-lg opacity-90 mb-8">
            {t({ en: 'Book your session today and let us capture your special moments', kn: 'ಇಂದೇ ನಿಮ್ಮ ಸೆಷನ್ ಬುಕ್ ಮಾಡಿ ಮತ್ತು ನಿಮ್ಮ ವಿಶೇಷ ಕ್ಷಣಗಳನ್ನು ಸೆರೆಹಿಡಿಯಲು ನಮಗೆ ಅನುಮತಿಸಿ', hi: 'आज ही अपना सेशन बुक करें और हमें अपने खास पलों को कैद करने दें' })}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="booking">
              <Button size="lg" variant="secondary" className="font-ui uppercase tracking-wider px-8">
                {t({ en: 'Book Appointment', kn: 'ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ', hi: 'अपॉइंटमेंट बुक करें' })}
              </Button>
            </Link>
            <Link to="pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-ui uppercase tracking-wider px-8">
                {t({ en: 'View Pricing', kn: 'ಬೆಲೆ ನೋಡಿ', hi: 'मूल्य देखें' })}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
