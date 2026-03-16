import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Youtube, Send, MessageCircle } from 'lucide-react';

export const PublicContact = ({ client, siteContent, clientId }) => {
  const { t } = useLanguage();

  const contactContent = siteContent?.contact || {};
  const footerContent = siteContent?.footer || {};
  const socialLinks = footerContent?.social_links || {};
  const primaryColor = client?.primary_color || '#1e40af';

  const contactMethods = [
    { icon: Phone, key: 'phone', value: client?.phone, href: client?.phone ? `tel:${client.phone}` : null },
    { icon: Mail, key: 'email', value: client?.email, href: client?.email ? `mailto:${client.email}` : null },
  ];

  return (
    <div data-testid="public-contact" className="bg-background">
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
              {t({ en: 'Get In Touch', kn: 'ಸಂಪರ್ಕದಲ್ಲಿರಿ', hi: 'संपर्क में रहें' })}
            </Badge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white" data-testid="contact-page-title">
              {t(contactContent?.title) || t({ en: 'Contact Us', kn: 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ', hi: 'संपर्क करें' })}
            </h1>
            <p className="text-white/90 max-w-2xl mx-auto text-lg">
              {t(contactContent?.subtitle) || t({ en: "We'd love to hear from you. Reach out to us for any inquiries.", kn: 'ನಿಮ್ಮಿಂದ ಕೇಳಲು ನಾವು ಇಷ್ಟಪಡುತ್ತೇವೆ.', hi: 'हम आपसे सुनना पसंद करेंगे।' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Contact Stats */}
      <section className="py-5 px-6 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { value: '24/7', label: { en: 'Support', kn: 'ಬೆಂಬಲ', hi: 'सहायता' } },
              { value: '<1hr', label: { en: 'Response Time', kn: 'ಪ್ರತಿಕ್ರಿಯೆ ಸಮಯ', hi: 'प्रतिक्रिया समय' } },
              { value: '100%', label: { en: 'Satisfaction', kn: 'ತೃಪ್ತಿ', hi: 'संतुष्टि' } },
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

      {/* Contact Info + Map */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <Badge 
                  variant="outline" 
                  className="mb-4"
                  style={{ borderColor: primaryColor, color: primaryColor }}
                >
                  {t({ en: 'Reach Out', kn: 'ಸಂಪರ್ಕಿಸಿ', hi: 'संपर्क करें' })}
                </Badge>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-6">
                  {t({ en: 'Contact Information', kn: 'ಸಂಪರ್ಕ ಮಾಹಿತಿ', hi: 'संपर्क जानकारी' })}
                </h2>
                
                <div className="space-y-6">
                  {/* Phone */}
                  {client?.phone && (
                    <a href={`tel:${client.phone}`} className="flex items-start gap-4 group">
                      <div 
                        className="p-4 rounded-xl transition-colors"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <Phone className="h-6 w-6" style={{ color: primaryColor }} />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{t({ en: 'Phone', kn: 'ಫೋನ್', hi: 'फ़ोन' })}</p>
                        <p className="text-muted-foreground group-hover:text-primary transition-colors text-lg">
                          {client.phone}
                        </p>
                      </div>
                    </a>
                  )}

                  {/* Email */}
                  {client?.email && (
                    <a href={`mailto:${client.email}`} className="flex items-start gap-4 group">
                      <div 
                        className="p-4 rounded-xl transition-colors"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <Mail className="h-6 w-6" style={{ color: primaryColor }} />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{t({ en: 'Email', kn: 'ಇಮೇಲ್', hi: 'ईमेल' })}</p>
                        <p className="text-muted-foreground group-hover:text-primary transition-colors">
                          {client.email}
                        </p>
                      </div>
                    </a>
                  )}

                  {/* Address */}
                  {contactContent?.address && (
                    <div className="flex items-start gap-4">
                      <div 
                        className="p-4 rounded-xl"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <MapPin className="h-6 w-6" style={{ color: primaryColor }} />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{t({ en: 'Address', kn: 'ವಿಳಾಸ', hi: 'पता' })}</p>
                        <p className="text-muted-foreground">
                          {t(contactContent.address)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Business Hours */}
                  <div className="flex items-start gap-4">
                    <div 
                      className="p-4 rounded-xl"
                      style={{ backgroundColor: `${primaryColor}15` }}
                    >
                      <Clock className="h-6 w-6" style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{t({ en: 'Business Hours', kn: 'ವ್ಯಾಪಾರ ಸಮಯ', hi: 'व्यापार के घंटे' })}</p>
                      <p className="text-muted-foreground">
                        {t({ en: 'Mon - Sat: 9:00 AM - 7:00 PM', kn: 'ಸೋಮ - ಶನಿ: ಬೆಳಿಗ್ಗೆ 9:00 - ಸಂಜೆ 7:00', hi: 'सोम - शनि: सुबह 9:00 - शाम 7:00' })}
                      </p>
                      <p className="text-muted-foreground">
                        {t({ en: 'Sunday: By Appointment', kn: 'ಭಾನುವಾರ: ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಮೂಲಕ', hi: 'रविवार: अपॉइंटमेंट द्वारा' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              {(socialLinks.facebook || socialLinks.instagram || socialLinks.twitter || socialLinks.youtube) && (
                <div className="pt-4">
                  <h3 className="font-semibold text-lg mb-4">
                    {t({ en: 'Follow Us', kn: 'ನಮ್ಮನ್ನು ಅನುಸರಿಸಿ', hi: 'हमें फॉलो करें' })}
                  </h3>
                  <div className="flex gap-3">
                    {socialLinks.facebook && (
                      <a 
                        href={socialLinks.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-4 rounded-xl transition-all hover:scale-110 hover:shadow-lg"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <Facebook className="h-6 w-6" style={{ color: primaryColor }} />
                      </a>
                    )}
                    {socialLinks.instagram && (
                      <a 
                        href={socialLinks.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-4 rounded-xl transition-all hover:scale-110 hover:shadow-lg"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <Instagram className="h-6 w-6" style={{ color: primaryColor }} />
                      </a>
                    )}
                    {socialLinks.twitter && (
                      <a 
                        href={socialLinks.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-4 rounded-xl transition-all hover:scale-110 hover:shadow-lg"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <Twitter className="h-6 w-6" style={{ color: primaryColor }} />
                      </a>
                    )}
                    {socialLinks.youtube && (
                      <a 
                        href={socialLinks.youtube} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-4 rounded-xl transition-all hover:scale-110 hover:shadow-lg"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <Youtube className="h-6 w-6" style={{ color: primaryColor }} />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Contact Card */}
              <Card 
                className="p-6 border-2 rounded-xl"
                style={{ borderColor: `${primaryColor}30`, backgroundColor: `${primaryColor}05` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="p-3 rounded-full"
                    style={{ backgroundColor: `${primaryColor}15` }}
                  >
                    <MessageCircle className="h-6 w-6" style={{ color: primaryColor }} />
                  </div>
                  <h3 className="font-semibold text-lg" style={{ color: primaryColor }}>
                    {t({ en: 'Quick Inquiry', kn: 'ತ್ವರಿತ ವಿಚಾರಣೆ', hi: 'त्वरित पूछताछ' })}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-5">
                  {t({ en: 'For immediate assistance, call us or send an email.', kn: 'ತಕ್ಷಣದ ಸಹಾಯಕ್ಕಾಗಿ, ನಮಗೆ ಕರೆ ಮಾಡಿ ಅಥವಾ ಇಮೇಲ್ ಕಳುಹಿಸಿ.', hi: 'तत्काल सहायता के लिए, हमें कॉल करें या ईमेल भेजें।' })}
                </p>
                <div className="flex gap-3">
                  {client?.phone && (
                    <a href={`tel:${client.phone}`}>
                      <Button className="text-white" style={{ backgroundColor: primaryColor }}>
                        <Phone className="h-4 w-4 mr-2" />
                        {t({ en: 'Call Now', kn: 'ಈಗ ಕರೆ ಮಾಡಿ', hi: 'अभी कॉल करें' })}
                      </Button>
                    </a>
                  )}
                  {client?.email && (
                    <a href={`mailto:${client.email}`}>
                      <Button variant="outline" style={{ borderColor: primaryColor, color: primaryColor }}>
                        <Send className="h-4 w-4 mr-2" />
                        {t({ en: 'Email', kn: 'ಇಮೇಲ್', hi: 'ईमेल' })}
                      </Button>
                    </a>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Map Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="overflow-hidden h-full min-h-[400px] rounded-xl shadow-lg border-0">
                {contactContent?.map_embed_url ? (
                  <iframe
                    src={contactContent.map_embed_url}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '550px' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Location Map"
                  />
                ) : (
                  <div 
                    className="h-full min-h-[550px] flex flex-col items-center justify-center p-8 text-center"
                    style={{ backgroundColor: `${primaryColor}08` }}
                  >
                    <div 
                      className="p-6 rounded-full mb-6"
                      style={{ backgroundColor: `${primaryColor}15` }}
                    >
                      <MapPin className="h-12 w-12" style={{ color: primaryColor }} />
                    </div>
                    <h3 className="font-semibold text-xl mb-2">
                      {t({ en: 'Map Coming Soon', kn: 'ನಕ್ಷೆ ಶೀಘ್ರದಲ್ಲೇ', hi: 'मानचित्र जल्द आ रहा है' })}
                    </h3>
                    <p className="text-muted-foreground">
                      {t({ en: 'Contact us for directions to our location', kn: 'ನಮ್ಮ ಸ್ಥಳಕ್ಕೆ ದಿಕ್ಕುಗಳಿಗಾಗಿ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ', hi: 'हमारे स्थान के लिए दिशाओं के लिए संपर्क करें' })}
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-6" style={{ backgroundColor: primaryColor }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-2">
            {t({ en: 'Ready to Book Your Session?', kn: 'ನಿಮ್ಮ ಸೆಷನ್ ಬುಕ್ ಮಾಡಲು ಸಿದ್ಧರಿದ್ದೀರಾ?', hi: 'अपना सेशन बुक करने के लिए तैयार हैं?' })}
          </h2>
          <p className="text-base opacity-90 mb-6">
            {t({ en: "Let's create beautiful memories together", kn: 'ಒಟ್ಟಿಗೆ ಸುಂದರ ನೆನಪುಗಳನ್ನು ರಚಿಸೋಣ', hi: 'आइए साथ मिलकर खूबसूरत यादें बनाएं' })}
          </p>
          <Link to={`/site/${clientId}/booking`}>
            <Button size="default" className="font-ui uppercase tracking-wider px-6 bg-white hover:bg-white/90" style={{ color: primaryColor }}>
              {t({ en: 'Book Appointment', kn: 'ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ', hi: 'अपॉइंटमेंट बुक करें' })}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
