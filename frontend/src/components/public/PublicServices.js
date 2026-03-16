import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, Star, CheckCircle } from 'lucide-react';

export const PublicServices = ({ services, offers, siteContent, client, clientId }) => {
  const { t } = useLanguage();

  const servicesSection = siteContent?.services_section || {};
  const primaryColor = client?.primary_color || '#1e40af';

  const whyChooseUs = [
    { en: 'Professional Equipment', kn: 'ವೃತ್ತಿಪರ ಸಲಕರಣೆ', hi: 'पेशेवर उपकरण' },
    { en: 'Experienced Team', kn: 'ಅನುಭವಿ ತಂಡ', hi: 'अनुभवी टीम' },
    { en: 'Creative Approach', kn: 'ಸೃಜನಾತ್ಮಕ ವಿಧಾನ', hi: 'रचनात्मक दृष्टिकोण' },
    { en: 'Timely Delivery', kn: 'ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ವಿತರಣೆ', hi: 'समय पर डिलीवरी' },
    { en: 'Affordable Pricing', kn: 'ಕೈಗೆಟುಕುವ ಬೆಲೆ', hi: 'किफायती मूल्य' },
    { en: 'Customer Support', kn: 'ಗ್ರಾಹಕ ಬೆಂಬಲ', hi: 'ग्राहक सहायता' },
  ];

  return (
    <div data-testid="public-services" className="bg-background">
      {/* Hero Header Section */}
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
              {t({ en: 'What We Offer', kn: 'ನಾವು ಏನು ನೀಡುತ್ತೇವೆ', hi: 'हम क्या प्रदान करते हैं' })}
            </Badge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white" data-testid="services-page-title">
              {t(servicesSection?.title) || t({ en: 'Our Services', kn: 'ನಮ್ಮ ಸೇವೆಗಳು', hi: 'हमारी सेवाएं' })}
            </h1>
            <p className="text-white/90 max-w-2xl mx-auto text-lg">
              {t(servicesSection?.subtitle) || t({ en: 'Professional services tailored to your needs', kn: 'ನಿಮ್ಮ ಅವಶ್ಯಕತೆಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ವೃತ್ತಿಪರ ಸೇವೆಗಳು', hi: 'आपकी जरूरतों के अनुसार पेशेवर सेवाएं' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-6 px-6 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { value: '500+', label: { en: 'Projects Done', kn: 'ಮುಗಿದ ಯೋಜನೆಗಳು', hi: 'पूर्ण प्रोजेक्ट' } },
              { value: '300+', label: { en: 'Happy Clients', kn: 'ಸಂತೋಷ ಗ್ರಾಹಕರು', hi: 'खुश ग्राहक' } },
              { value: '10+', label: { en: 'Services', kn: 'ಸೇವೆಗಳು', hi: 'सेवाएं' } },
              { value: '4.9', label: { en: 'Average Rating', kn: 'ಸರಾಸರಿ ರೇಟಿಂಗ್', hi: 'औसत रेटिंग' } },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <p className="text-3xl sm:text-4xl font-bold" style={{ color: primaryColor }}>{stat.value}</p>
                <p className="text-muted-foreground text-xs mt-1">{t(stat.label)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      {offers && offers.length > 0 && (
        <section className="py-8 px-6" style={{ backgroundColor: `${primaryColor}08` }}>
          <div className="max-w-7xl mx-auto">
            {offers.slice(0, 1).map((offer) => (
              <motion.div
                key={offer.offer_id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white border-2 rounded-xl"
                style={{ borderColor: `${primaryColor}30` }}
                data-testid="service-offer"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="p-3 rounded-full"
                    style={{ backgroundColor: `${primaryColor}15` }}
                  >
                    <Star className="h-6 w-6" style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <Badge 
                      className="mb-2 text-xs border-0"
                      style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                    >
                      {t({ en: 'Limited Offer', kn: 'ಸೀಮಿತ ಆಫರ್', hi: 'सीमित प्रस्ताव' })}
                    </Badge>
                    <p className="font-heading font-bold text-lg">{t(offer.title)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {offer.discount_percentage && (
                    <span className="text-3xl font-bold" style={{ color: primaryColor }}>{offer.discount_percentage}% OFF</span>
                  )}
                  <Link to={`/site/${clientId}/booking`}>
                    <Button 
                      className="text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {t({ en: 'Claim Now', kn: 'ಈಗ ಪಡೆಯಿರಿ', hi: 'अभी प्राप्त करें' })}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Services Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {services && services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const activeOffer = offers?.find(o => o.status === 'active' || o.is_active);
                const discountedPrice = service.price && activeOffer?.discount_percentage 
                  ? service.price - (service.price * activeOffer.discount_percentage / 100)
                  : service.price;

                return (
                  <motion.div
                    key={service.service_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    data-testid="service-card"
                  >
                    <Card className="overflow-hidden h-full flex flex-col group hover:shadow-xl transition-shadow border-0 shadow-md">
                      <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                        {service.image_url ? (
                          <img 
                            src={service.image_url} 
                            alt={t(service.name)} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}10` }}>
                            <Camera className="h-12 w-12" style={{ color: `${primaryColor}40` }} />
                          </div>
                        )}
                        {activeOffer && service.price && (
                          <Badge className="absolute top-3 right-3 bg-red-500 text-white">
                            {activeOffer.discount_percentage}% OFF
                          </Badge>
                        )}
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="font-heading text-xl font-bold mb-2">{t(service.name)}</h3>
                        <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-3">{t(service.description)}</p>
                        
                        {service.price && (
                          <div className="mb-5">
                            {activeOffer ? (
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold" style={{ color: primaryColor }}>₹{discountedPrice.toLocaleString()}</span>
                                <span className="text-sm text-muted-foreground line-through">₹{service.price.toLocaleString()}</span>
                              </div>
                            ) : (
                              <span className="text-2xl font-bold" style={{ color: primaryColor }}>₹{service.price.toLocaleString()}</span>
                            )}
                          </div>
                        )}

                        <Link to={`/site/${clientId}/booking`} className="w-full mt-auto">
                          <Button 
                            className="w-full text-white" 
                            data-testid="book-service-button"
                            style={{ backgroundColor: primaryColor }}
                          >
                            {t({ en: 'Book Now', kn: 'ಈಗ ಬುಕ್ ಮಾಡಿ', hi: 'अभी बुक करें' })}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Camera className="h-16 w-16 mx-auto mb-4" style={{ color: `${primaryColor}30` }} />
              <h3 className="font-semibold text-xl mb-2">
                {t({ en: 'Services Coming Soon', kn: 'ಸೇವೆಗಳು ಶೀಘ್ರದಲ್ಲೇ', hi: 'सेवाएं जल्द आ रही हैं' })}
              </h3>
              <p className="text-muted-foreground">
                {t({ en: 'We are preparing our service offerings. Please check back soon!', kn: 'ನಾವು ನಮ್ಮ ಸೇವಾ ಕೊಡುಗೆಗಳನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತಿದ್ದೇವೆ.', hi: 'हम अपनी सेवाएं तैयार कर रहे हैं।' })}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-6" style={{ backgroundColor: `${primaryColor}08` }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge 
              variant="outline" 
              className="mb-4"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              {t({ en: 'Why Choose Us', kn: 'ನಮ್ಮನ್ನು ಏಕೆ ಆಯ್ಕೆ ಮಾಡಬೇಕು', hi: 'हमें क्यों चुनें' })}
            </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              {t({ en: 'What Sets Us Apart', kn: 'ನಮ್ಮನ್ನು ಏನು ಭಿನ್ನವಾಗಿಸುತ್ತದೆ', hi: 'हमें क्या अलग करता है' })}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div 
                  className="p-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <CheckCircle className="h-6 w-6" style={{ color: primaryColor }} />
                </div>
                <span className="font-semibold">{t(feature)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 px-6" style={{ backgroundColor: primaryColor }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-2">
            {t({ en: "Can't find what you're looking for?", kn: 'ನೀವು ಹುಡುಕುತ್ತಿರುವುದು ಸಿಗುತ್ತಿಲ್ಲವೇ?', hi: 'जो आप खोज रहे हैं वह नहीं मिल रहा?' })}
          </h2>
          <p className="text-base opacity-90 mb-5">
            {t({ en: 'Contact us for custom packages tailored to your specific needs', kn: 'ನಿಮ್ಮ ನಿರ್ದಿಷ್ಟ ಅವಶ್ಯಕತೆಗಳಿಗೆ ಕಸ್ಟಮ್ ಪ್ಯಾಕೇಜ್‌ಗಳಿಗಾಗಿ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ', hi: 'अपनी विशिष्ट आवश्यकताओं के लिए कस्टम पैकेज के लिए संपर्क करें' })}
          </p>
          <Link to={`/site/${clientId}/contact`}>
            <Button size="default" className="font-ui uppercase tracking-wider bg-white hover:bg-white/90" style={{ color: primaryColor }}>
              {t({ en: 'Contact Us', kn: 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ', hi: 'संपर्क करें' })}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
