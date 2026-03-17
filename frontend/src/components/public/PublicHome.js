import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Camera, Users, Award, Clock, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { getImageUrl } from '../../utils/imageUrl';

export const PublicHome = ({ content, siteContent, offers, services, clientId, client }) => {
  const { t } = useLanguage();

  if (!content && !siteContent) return null;

  const heroContent = siteContent?.hero || content?.banner || {};
  const aboutContent = siteContent?.about || content?.about || {};
  const servicesSection = siteContent?.services_section || content?.featured || {};
  const primaryColor = client?.primary_color || '#1e40af';

  const features = [
    { en: 'Professional Equipment', kn: 'ವೃತ್ತಿಪರ ಸಲಕರಣೆ', hi: 'पेशेवर उपकरण' },
    { en: 'Experienced Team', kn: 'ಅನುಭವಿ ತಂಡ', hi: 'अनुभवी टीम' },
    { en: 'Creative Approach', kn: 'ಸೃಜನಾತ್ಮಕ ವಿಧಾನ', hi: 'रचनात्मक दृष्टिकोण' },
    { en: 'Timely Delivery', kn: 'ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ವಿತರಣೆ', hi: 'समय पर डिलीवरी' },
  ];

  return (
    <div data-testid="public-home" className="bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: `url(${getImageUrl(heroContent?.background_image) || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1920&q=80'})` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <Badge 
              className="mb-4 text-white border-white/40"
              style={{ backgroundColor: `${primaryColor}cc` }}
            >
              {t({ en: 'Professional Services', kn: 'ವೃತ್ತಿಪರ ಸೇವೆಗಳು', hi: 'पेशेवर सेवाएं' })}
            </Badge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" data-testid="hero-headline">
              {t(heroContent?.headline) || 'Capture Your Special Moments'}
            </h1>
            <p className="font-body text-lg sm:text-xl text-white/90 mb-8 leading-relaxed" data-testid="hero-subheadline">
              {t(heroContent?.sub_headline) || 'Professional photography and videography services for all your special occasions'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to={`/site/${clientId}/booking`}>
                <Button 
                  size="lg" 
                  className="font-ui uppercase tracking-wider px-8 text-white"
                  style={{ backgroundColor: primaryColor }}
                  data-testid="hero-cta-button"
                >
                  {t(heroContent?.cta_text) || 'Book Now'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to={`/site/${clientId}/services`}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-ui uppercase tracking-wider px-8">
                  {t({ en: 'Our Services', kn: 'ನಮ್ಮ ಸೇವೆಗಳು', hi: 'हमारी सेवाएं' })}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-6 text-white" style={{ backgroundColor: primaryColor }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
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
                <stat.icon className="h-5 w-5 mb-1 opacity-90" />
                <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                <p className="text-xs opacity-85">{t(stat.label)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      {offers && offers.length > 0 && (
        <section className="py-10 px-6" style={{ backgroundColor: `${primaryColor}08` }}>
          <div className="max-w-7xl mx-auto">
            {offers.slice(0, 1).map((offer) => (
              <motion.div
                key={offer.offer_id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-2 p-6 sm:p-8 rounded-xl shadow-sm"
                style={{ borderColor: `${primaryColor}30` }}
                data-testid="offer-banner"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="p-4 rounded-full"
                      style={{ backgroundColor: `${primaryColor}15` }}
                    >
                      <Star className="h-7 w-7" style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <Badge 
                        className="mb-2 border-0"
                        style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                      >
                        {t({ en: 'Limited Time Offer', kn: 'ಸೀಮಿತ ಸಮಯದ ಆಫರ್', hi: 'सीमित समय का ऑफर' })}
                      </Badge>
                      <h3 className="font-heading text-xl font-bold">{t(offer.title)}</h3>
                      <p className="text-muted-foreground text-sm">{t(offer.description)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {offer.discount_percentage && (
                      <span className="text-3xl font-bold" style={{ color: primaryColor }}>{offer.discount_percentage}% OFF</span>
                    )}
                    <Link to={`/site/${clientId}/booking`}>
                      <Button 
                        className="font-ui uppercase tracking-wider text-white"
                        style={{ backgroundColor: primaryColor }}
                      >
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
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <Badge 
              variant="outline" 
              className="mb-4"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.slice(0, 6).map((service, index) => (
                <motion.div
                  key={service.service_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden group h-full hover:shadow-xl transition-shadow border-0 shadow-md" data-testid="featured-service">
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      {service.image_url ? (
                        <img 
                          src={getImageUrl(service.image_url)} 
                          alt={t(service.name)} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}10` }}>
                          <Camera className="h-12 w-12" style={{ color: `${primaryColor}40` }} />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-heading text-lg font-bold mb-2">{t(service.name)}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{t(service.description)}</p>
                      {service.price && (
                        <p className="font-bold text-lg" style={{ color: primaryColor }}>
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
            <div className="text-center mt-12">
              <Link to={`/site/${clientId}/services`}>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="font-ui uppercase tracking-wider"
                  style={{ borderColor: primaryColor, color: primaryColor }}
                >
                  {t({ en: 'View All Services', kn: 'ಎಲ್ಲಾ ಸೇವೆಗಳನ್ನು ನೋಡಿ', hi: 'सभी सेवाएं देखें' })}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6" style={{ backgroundColor: `${primaryColor}08` }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1 space-y-6"
            >
              <Badge 
                variant="outline" 
                className="mb-2"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                {t({ en: 'About Us', kn: 'ನಮ್ಮ ಬಗ್ಗೆ', hi: 'हमारे बारे में' })}
              </Badge>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold" data-testid="about-title">
                {t(aboutContent?.title) || t({ en: 'Your Trusted Partner', kn: 'ನಿಮ್ಮ ನಂಬಿಕಸ್ಥ ಪಾಲುದಾರ', hi: 'आपका विश्वसनीय साथी' })}
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                {t(aboutContent?.description) || t({ en: 'We are dedicated professionals committed to capturing your most precious moments with creativity and excellence.', kn: 'ನಿಮ್ಮ ಅತ್ಯಮೂಲ್ಯ ಕ್ಷಣಗಳನ್ನು ಸೃಜನಶೀಲತೆ ಮತ್ತು ಶ್ರೇಷ್ಠತೆಯೊಂದಿಗೆ ಸೆರೆಹಿಡಿಯಲು ಬದ್ಧರಾದ ಸಮರ್ಪಿತ ವೃತ್ತಿಪರರು ನಾವು.', hi: 'हम समर्पित पेशेवर हैं जो रचनात्मकता और उत्कृष्टता के साथ आपके सबसे कीमती पलों को कैद करने के लिए प्रतिबद्ध हैं।' })}
              </p>
              
              {/* Feature List */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 flex-shrink-0" style={{ color: primaryColor }} />
                    <span className="text-sm">{t(feature)}</span>
                  </div>
                ))}
              </div>
              
              <Link to={`/site/${clientId}/about`}>
                <Button 
                  variant="outline" 
                  className="font-ui uppercase tracking-wider mt-4" 
                  data-testid="learn-more-button"
                  style={{ borderColor: primaryColor, color: primaryColor }}
                >
                  {t({ en: 'Learn More', kn: 'ಹೆಚ್ಚು ತಿಳಿಯಿರಿ', hi: 'और जानें' })}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2 relative"
            >
              <div 
                className="absolute -top-4 -left-4 w-full h-full rounded-xl"
                style={{ backgroundColor: `${primaryColor}20` }}
              ></div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-2xl relative z-10">
                <img
                  src={getImageUrl(aboutContent?.image_url) || 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80'}
                  alt={t(aboutContent?.title) || 'About us'}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 p-5 rounded-xl shadow-lg z-20 bg-white">
                <div className="flex items-center gap-3">
                  <Star className="h-8 w-8" style={{ color: primaryColor, fill: primaryColor }} />
                  <div>
                    <p className="text-3xl font-bold" style={{ color: primaryColor }}>4.9</p>
                    <p className="text-xs text-muted-foreground">{t({ en: 'Customer Rating', kn: 'ಗ್ರಾಹಕ ರೇಟಿಂಗ್', hi: 'ग्राहक रेटिंग' })}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-6 text-white" style={{ backgroundColor: primaryColor }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-3">
            {t({ en: 'Ready to Get Started?', kn: 'ಪ್ರಾರಂಭಿಸಲು ಸಿದ್ಧರಿದ್ದೀರಾ?', hi: 'शुरू करने के लिए तैयार हैं?' })}
          </h2>
          <p className="text-base opacity-90 mb-6">
            {t({ en: 'Book your session today and let us capture your special moments', kn: 'ಇಂದೇ ನಿಮ್ಮ ಸೆಷನ್ ಬುಕ್ ಮಾಡಿ ಮತ್ತು ನಿಮ್ಮ ವಿಶೇಷ ಕ್ಷಣಗಳನ್ನು ಸೆರೆಹಿಡಿಯಲು ನಮಗೆ ಅನುಮತಿಸಿ', hi: 'आज ही अपना सेशन बुक करें और हमें अपने खास पलों को कैद करने दें' })}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to={`/site/${clientId}/booking`}>
              <Button size="default" className="font-ui uppercase tracking-wider px-6 bg-white hover:bg-white/90" style={{ color: primaryColor }}>
                {t({ en: 'Book Appointment', kn: 'ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ', hi: 'अपॉइंटमेंट बुक करें' })}
              </Button>
            </Link>
            <Link to={`/site/${clientId}/contact`}>
              <Button size="default" variant="outline" className="border-white text-white hover:bg-white/10 font-ui uppercase tracking-wider px-6">
                {t({ en: 'Contact Us', kn: 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ', hi: 'संपर्क करें' })}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
