import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, Star } from 'lucide-react';

export const PublicServices = ({ services, offers, siteContent }) => {
  const { t } = useLanguage();

  const servicesSection = siteContent?.services_section || {};

  return (
    <div data-testid="public-services" className="bg-background">
      {/* Header Section */}
      <section className="bg-primary/5 py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            {t({ en: 'What We Offer', kn: 'ನಾವು ಏನು ನೀಡುತ್ತೇವೆ', hi: 'हम क्या प्रदान करते हैं' })}
          </Badge>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4" data-testid="services-page-title">
            {t(servicesSection?.title) || t({ en: 'Our Services', kn: 'ನಮ್ಮ ಸೇವೆಗಳು', hi: 'हमारी सेवाएं' })}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t(servicesSection?.subtitle) || t({ en: 'Professional services tailored to your needs', kn: 'ನಿಮ್ಮ ಅವಶ್ಯಕತೆಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ವೃತ್ತಿಪರ ಸೇವೆಗಳು', hi: 'आपकी जरूरतों के अनुसार पेशेवर सेवाएं' })}
          </p>
        </div>
      </section>

      {/* Special Offer Banner */}
      {offers && offers.length > 0 && (
        <section className="py-6 px-6 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="max-w-7xl mx-auto">
            {offers.slice(0, 1).map((offer) => (
              <motion.div
                key={offer.offer_id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-card border border-primary/20 rounded-lg"
                data-testid="service-offer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Badge className="mb-1 bg-primary/10 text-primary border-0 text-xs">
                      {t({ en: 'Limited Offer', kn: 'ಸೀಮಿತ ಆಫರ್', hi: 'सीमित प्रस्ताव' })}
                    </Badge>
                    <p className="font-semibold">{t(offer.title)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {offer.discount_percentage && (
                    <span className="text-2xl font-bold text-primary">{offer.discount_percentage}% OFF</span>
                  )}
                  <Link to="../booking">
                    <Button size="sm">
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
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {services && services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <Card className="overflow-hidden h-full flex flex-col group">
                      <div className="aspect-[4/3] overflow-hidden bg-muted relative">
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
                        {activeOffer && service.price && (
                          <Badge className="absolute top-3 right-3 bg-red-500 text-white">
                            {activeOffer.discount_percentage}% OFF
                          </Badge>
                        )}
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-heading text-xl font-bold mb-2">{t(service.name)}</h3>
                        <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-3">{t(service.description)}</p>
                        
                        {service.price && (
                          <div className="mb-4">
                            {activeOffer ? (
                              <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold text-primary">₹{discountedPrice.toLocaleString()}</span>
                                <span className="text-sm text-muted-foreground line-through">₹{service.price.toLocaleString()}</span>
                              </div>
                            ) : (
                              <span className="text-xl font-bold text-primary">₹{service.price.toLocaleString()}</span>
                            )}
                          </div>
                        )}

                        <Link to="../booking" className="w-full mt-auto">
                          <Button className="w-full" data-testid="book-service-button">
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
              <Camera className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
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

      {/* CTA Section */}
      <section className="py-12 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">
            {t({ en: "Can't find what you're looking for?", kn: 'ನೀವು ಹುಡುಕುತ್ತಿರುವುದು ಸಿಗುತ್ತಿಲ್ಲವೇ?', hi: 'जो आप खोज रहे हैं वह नहीं मिल रहा?' })}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t({ en: 'Contact us for custom packages tailored to your specific needs', kn: 'ನಿಮ್ಮ ನಿರ್ದಿಷ್ಟ ಅವಶ್ಯಕತೆಗಳಿಗೆ ಕಸ್ಟಮ್ ಪ್ಯಾಕೇಜ್‌ಗಳಿಗಾಗಿ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ', hi: 'अपनी विशिष्ट आवश्यकताओं के लिए कस्टम पैकेज के लिए संपर्क करें' })}
          </p>
          <Link to="../booking">
            <Button size="lg" variant="outline">
              {t({ en: 'Contact Us', kn: 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ', hi: 'संपर्क करें' })}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
