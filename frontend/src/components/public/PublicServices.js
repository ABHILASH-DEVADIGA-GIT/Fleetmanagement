import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const PublicServices = ({ services, offers }) => {
  const { t } = useLanguage();

  return (
    <div className="py-24 px-6" data-testid="public-services">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-heading text-5xl sm:text-6xl font-bold mb-6" data-testid="services-page-title">
            {t({ en: 'Our Services', kn: 'ನಮ್ಮ ಸೇವೆಗಳು', hi: 'हमारी सेवाएं' })}
          </h1>
          <p className="font-body text-lg text-muted-foreground">
            {t({ en: 'Professional photography services tailored to your needs', kn: 'ನಿಮ್ಮ ಅಗತ್ಯಗಳಿಗೆ ತಕ್ಕಂತೆ ವೃತ್ತಿಪರ ಛಾಯಾಗ್ರಹಣ ಸೇವೆಗಳು', hi: 'आपकी आवश्यकताओं के अनुरूप पेशेवर फोटोग्राफी सेवाएं' })}
          </p>
        </motion.div>

        {offers && offers.length > 0 && (
          <div className="mb-12">
            {offers.map((offer) => (
              <motion.div
                key={offer.offer_id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-primary/10 border-2 border-primary p-6 rounded-sm mb-6"
                data-testid="service-offer"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <Badge className="mb-2 bg-primary text-primary-foreground">
                      {t({ en: 'Limited Offer', kn: 'ಸೀಮಿತ ಆಫರ್', hi: 'सीमित प्रस्ताव' })}
                    </Badge>
                    <h3 className="font-heading text-2xl font-bold mb-1">{t(offer.title)}</h3>
                    <p className="font-body text-muted-foreground">{t(offer.description)}</p>
                  </div>
                  {offer.discount_percentage && (
                    <div className="text-center">
                      <p className="font-heading text-4xl font-bold text-primary">{offer.discount_percentage}%</p>
                      <p className="font-ui text-sm uppercase tracking-wider">OFF</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const activeOffer = offers.find(o => o.status === 'active');
            const discountedPrice = service.price && activeOffer?.discount_percentage 
              ? service.price - (service.price * activeOffer.discount_percentage / 100)
              : service.price;

            return (
              <motion.div
                key={service.service_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                data-testid="service-card"
              >
                <Card className="overflow-hidden h-full flex flex-col">
                  {service.image_url && (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={service.image_url} 
                        alt={t(service.name)} 
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                      {activeOffer && (
                        <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground">
                          {activeOffer.discount_percentage}% OFF
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-heading text-2xl font-bold mb-3">{t(service.name)}</h3>
                    <p className="font-body text-muted-foreground mb-4 flex-1">{t(service.description)}</p>
                    
                    {service.price && (
                      <div className="mb-4">
                        {activeOffer ? (
                          <div className="flex items-center gap-3">
                            <p className="font-ui text-2xl font-bold text-primary">₹{discountedPrice.toFixed(0)}</p>
                            <p className="font-ui text-lg text-muted-foreground line-through">₹{service.price}</p>
                          </div>
                        ) : (
                          <p className="font-ui text-2xl font-bold text-primary">₹{service.price}</p>
                        )}
                      </div>
                    )}

                    <Link to="../booking" className="w-full">
                      <Button className="w-full font-ui uppercase tracking-wider" data-testid="book-service-button">
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
      </div>
    </div>
  );
};
