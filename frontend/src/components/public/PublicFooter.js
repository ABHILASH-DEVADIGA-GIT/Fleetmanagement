import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const PublicFooter = ({ client, content }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t border-border mt-24" data-testid="public-footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading text-2xl font-bold mb-4">{client.business_name}</h3>
            <p className="font-body text-muted-foreground">
              {t({ en: 'Professional Photography Services', kn: 'ವೃತ್ತಿಪರ ಛಾಯಾಗ್ರಹಣ ಸೇವೆಗಳು', hi: 'पेशेवर फोटोग्राफी सेवाएं' })}
            </p>
          </div>

          <div>
            <h4 className="font-ui font-semibold uppercase tracking-wider mb-4">
              {t({ en: 'Contact', kn: 'ಸಂಪರ್ಕಿಸಿ', hi: 'संपर्क' })}
            </h4>
            <div className="space-y-2">
              {client.email && (
                <div className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${client.email}`} className="hover:text-primary transition-colors">
                    {client.email}
                  </a>
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${client.phone}`} className="hover:text-primary transition-colors">
                    {client.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-ui font-semibold uppercase tracking-wider mb-4">
              {t({ en: 'Quick Links', kn: 'ದ್ರುತ ಲಿಂಕ್ಗಳು', hi: 'त्वरित लिंक' })}
            </h4>
            <nav className="flex flex-col gap-2 font-body text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                {t({ en: 'About Us', kn: 'ನಮ್ಮ ಬಗ್ಗೆ', hi: 'हमारे बारे में' })}
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                {t({ en: 'Services', kn: 'ಸೇವೆಗಳು', hi: 'सेवाएं' })}
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                {t({ en: 'Book Appointment', kn: 'ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ', hi: 'अपॉइंटमेंट बुक करें' })}
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center font-body text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {client.business_name}. {t({ en: 'All rights reserved.', kn: 'ಎಲ್ಲಾ ಹಕ್ಕುಗಳೂ ರಕ್ಷಿತ', hi: 'सर्वाधिकार सुरक्षित' })}</p>
        </div>
      </div>
    </footer>
  );
};
