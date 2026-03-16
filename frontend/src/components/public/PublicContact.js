import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Youtube, Send } from 'lucide-react';

export const PublicContact = ({ client, siteContent }) => {
  const { t } = useLanguage();

  const contactContent = siteContent?.contact || {};
  const footerContent = siteContent?.footer || {};
  const socialLinks = footerContent?.social_links || {};
  const primaryColor = client?.primary_color || '#1e40af';

  return (
    <div data-testid="public-contact" className="bg-background">
      {/* Header Section with Primary Color */}
      <section 
        className="py-16 px-6"
        style={{ backgroundColor: `${primaryColor}15` }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <Badge 
            variant="outline" 
            className="mb-4"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            {t({ en: 'Get In Touch', kn: 'ಸಂಪರ್ಕದಲ್ಲಿರಿ', hi: 'संपर्क में रहें' })}
          </Badge>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4" data-testid="contact-page-title">
            {t(contactContent?.title) || t({ en: 'Contact Us', kn: 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ', hi: 'संपर्क करें' })}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t(contactContent?.subtitle) || t({ en: "We'd love to hear from you. Reach out to us for any inquiries.", kn: 'ನಿಮ್ಮಿಂದ ಕೇಳಲು ನಾವು ಇಷ್ಟಪಡುತ್ತೇವೆ.', hi: 'हम आपसे सुनना पसंद करेंगे।' })}
          </p>
        </div>
      </section>

      {/* Contact Info + Map */}
      <section className="py-16 px-6">
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
                <h2 className="font-heading text-2xl font-bold mb-6">
                  {t({ en: 'Contact Information', kn: 'ಸಂಪರ್ಕ ಮಾಹಿತಿ', hi: 'संपर्क जानकारी' })}
                </h2>
                
                <div className="space-y-6">
                  {/* Phone */}
                  {client?.phone && (
                    <a href={`tel:${client.phone}`} className="flex items-start gap-4 group">
                      <div 
                        className="p-3 rounded-lg transition-colors"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <Phone className="h-6 w-6" style={{ color: primaryColor }} />
                      </div>
                      <div>
                        <p className="font-semibold">{t({ en: 'Phone', kn: 'ಫೋನ್', hi: 'फ़ोन' })}</p>
                        <p className="text-muted-foreground group-hover:text-primary transition-colors">
                          {client.phone}
                        </p>
                      </div>
                    </a>
                  )}

                  {/* Email */}
                  {client?.email && (
                    <a href={`mailto:${client.email}`} className="flex items-start gap-4 group">
                      <div 
                        className="p-3 rounded-lg transition-colors"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <Mail className="h-6 w-6" style={{ color: primaryColor }} />
                      </div>
                      <div>
                        <p className="font-semibold">{t({ en: 'Email', kn: 'ಇಮೇಲ್', hi: 'ईमेल' })}</p>
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
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <MapPin className="h-6 w-6" style={{ color: primaryColor }} />
                      </div>
                      <div>
                        <p className="font-semibold">{t({ en: 'Address', kn: 'ವಿಳಾಸ', hi: 'पता' })}</p>
                        <p className="text-muted-foreground">
                          {t(contactContent.address)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Business Hours */}
                  <div className="flex items-start gap-4">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: `${primaryColor}15` }}
                    >
                      <Clock className="h-6 w-6" style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <p className="font-semibold">{t({ en: 'Business Hours', kn: 'ವ್ಯಾಪಾರ ಸಮಯ', hi: 'व्यापार के घंटे' })}</p>
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
                <div>
                  <h3 className="font-semibold mb-4">
                    {t({ en: 'Follow Us', kn: 'ನಮ್ಮನ್ನು ಅನುಸರಿಸಿ', hi: 'हमें फॉलो करें' })}
                  </h3>
                  <div className="flex gap-3">
                    {socialLinks.facebook && (
                      <a 
                        href={socialLinks.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg transition-all hover:scale-110"
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
                        className="p-3 rounded-lg transition-all hover:scale-110"
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
                        className="p-3 rounded-lg transition-all hover:scale-110"
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
                        className="p-3 rounded-lg transition-all hover:scale-110"
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
                className="p-6 border-2"
                style={{ borderColor: `${primaryColor}30`, backgroundColor: `${primaryColor}05` }}
              >
                <h3 className="font-semibold mb-2" style={{ color: primaryColor }}>
                  {t({ en: 'Quick Inquiry', kn: 'ತ್ವರಿತ ವಿಚಾರಣೆ', hi: 'त्वरित पूछताछ' })}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t({ en: 'For immediate assistance, call us or send an email.', kn: 'ತಕ್ಷಣದ ಸಹಾಯಕ್ಕಾಗಿ, ನಮಗೆ ಕರೆ ಮಾಡಿ ಅಥವಾ ಇಮೇಲ್ ಕಳುಹಿಸಿ.', hi: 'तत्काल सहायता के लिए, हमें कॉल करें या ईमेल भेजें।' })}
                </p>
                <div className="flex gap-3">
                  {client?.phone && (
                    <a href={`tel:${client.phone}`}>
                      <Button style={{ backgroundColor: primaryColor }}>
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
              <Card className="overflow-hidden h-full min-h-[400px]">
                {contactContent?.map_embed_url ? (
                  <iframe
                    src={contactContent.map_embed_url}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '500px' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Location Map"
                  />
                ) : (
                  <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-muted p-8 text-center">
                    <MapPin className="h-16 w-16 text-muted-foreground/30 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">
                      {t({ en: 'Map Coming Soon', kn: 'ನಕ್ಷೆ ಶೀಘ್ರದಲ್ಲೇ', hi: 'मानचित्र जल्द आ रहा है' })}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {t({ en: 'Contact us for directions', kn: 'ದಿಕ್ಕುಗಳಿಗಾಗಿ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ', hi: 'दिशाओं के लिए संपर्क करें' })}
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-16 px-6"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            {t({ en: 'Ready to Book Your Session?', kn: 'ನಿಮ್ಮ ಸೆಷನ್ ಬುಕ್ ಮಾಡಲು ಸಿದ್ಧರಿದ್ದೀರಾ?', hi: 'अपना सेशन बुक करने के लिए तैयार हैं?' })}
          </h2>
          <p className="text-lg opacity-90 mb-8">
            {t({ en: "Let's create beautiful memories together", kn: 'ಒಟ್ಟಿಗೆ ಸುಂದರ ನೆನಪುಗಳನ್ನು ರಚಿಸೋಣ', hi: 'आइए साथ मिलकर खूबसूरत यादें बनाएं' })}
          </p>
          <Button size="lg" variant="secondary" className="font-ui uppercase tracking-wider px-8">
            {t({ en: 'Book Appointment', kn: 'ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ', hi: 'अपॉइंटमेंट बुक करें' })}
          </Button>
        </div>
      </section>
    </div>
  );
};
