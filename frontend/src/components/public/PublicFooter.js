import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getImageUrl } from '../../utils/imageUrl';

export const PublicFooter = ({ client, content, siteContent }) => {
  const { t } = useLanguage();

  const footerContent = siteContent?.footer || {};
  const contactContent = siteContent?.contact || {};
  const socialLinks = footerContent?.social_links || {};

  return (
    <footer className="bg-card border-t border-border" data-testid="public-footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {client?.logo_url && (
                <img src={getImageUrl(client.logo_url)} alt={client.business_name} className="h-8 w-auto" />
              )}
              <h3 className="font-heading text-xl font-bold">{client?.business_name}</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              {t({ en: 'Professional services with dedication and excellence.', kn: 'ಸಮರ್ಪಣೆ ಮತ್ತು ಶ್ರೇಷ್ಠತೆಯೊಂದಿಗೆ ವೃತ್ತಿಪರ ಸೇವೆಗಳು.', hi: 'समर्पण और उत्कृष्टता के साथ पेशेवर सेवाएं।' })}
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3 mt-4">
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {socialLinks.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                  <Youtube className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">
              {t({ en: 'Quick Links', kn: 'ದ್ರುತ ಲಿಂಕ್‌ಗಳು', hi: 'त्वरित लिंक' })}
            </h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="" className="hover:text-primary transition-colors">
                {t({ en: 'Home', kn: 'ಮುಖಪುಟ', hi: 'होम' })}
              </Link>
              <Link to="about" className="hover:text-primary transition-colors">
                {t({ en: 'About Us', kn: 'ನಮ್ಮ ಬಗ್ಗೆ', hi: 'हमारे बारे में' })}
              </Link>
              <Link to="services" className="hover:text-primary transition-colors">
                {t({ en: 'Services', kn: 'ಸೇವೆಗಳು', hi: 'सेवाएं' })}
              </Link>
              <Link to="gallery" className="hover:text-primary transition-colors">
                {t({ en: 'Gallery', kn: 'ಗ್ಯಾಲರಿ', hi: 'गैलरी' })}
              </Link>
            </nav>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">
              {t({ en: 'Services', kn: 'ಸೇವೆಗಳು', hi: 'सेवाएं' })}
            </h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="pricing" className="hover:text-primary transition-colors">
                {t({ en: 'Pricing', kn: 'ಬೆಲೆ', hi: 'मूल्य' })}
              </Link>
              <Link to="products" className="hover:text-primary transition-colors">
                {t({ en: 'Products', kn: 'ಉತ್ಪನ್ನಗಳು', hi: 'उत्पाद' })}
              </Link>
              <Link to="booking" className="hover:text-primary transition-colors">
                {t({ en: 'Book Appointment', kn: 'ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ', hi: 'अपॉइंटमेंट बुक करें' })}
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">
              {t({ en: 'Contact', kn: 'ಸಂಪರ್ಕ', hi: 'संपर्क' })}
            </h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              {client?.email && (
                <a href={`mailto:${client.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Mail className="h-4 w-4" />
                  {client.email}
                </a>
              )}
              {client?.phone && (
                <a href={`tel:${client.phone}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Phone className="h-4 w-4" />
                  {client.phone}
                </a>
              )}
              {contactContent?.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{t(contactContent.address)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-4 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            {t(footerContent?.copyright_text) || `© ${new Date().getFullYear()} ${client?.business_name}. ${t({ en: 'All rights reserved.', kn: 'ಎಲ್ಲಾ ಹಕ್ಕುಗಳು ರಕ್ಷಿತ.', hi: 'सर्वाधिकार सुरक्षित।' })}`}
          </p>
        </div>
      </div>
    </footer>
  );
};
