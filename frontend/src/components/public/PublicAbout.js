import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../ui/badge';
import { Camera, Award, Users, Heart } from 'lucide-react';

export const PublicAbout = ({ content, siteContent }) => {
  const { t } = useLanguage();

  const aboutContent = siteContent?.about || content?.about || {};

  return (
    <div data-testid="public-about" className="bg-background">
      {/* Header Section */}
      <section className="bg-primary/5 py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            {t({ en: 'Know Us Better', kn: 'ನಮ್ಮನ್ನು ಚೆನ್ನಾಗಿ ತಿಳಿಯಿರಿ', hi: 'हमें बेहतर जानें' })}
          </Badge>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4" data-testid="about-page-title">
            {t(aboutContent?.title) || t({ en: 'About Us', kn: 'ನಮ್ಮ ಬಗ್ಗೆ', hi: 'हमारे बारे में' })}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t({ en: 'Dedicated to capturing your most precious moments', kn: 'ನಿಮ್ಮ ಅತ್ಯಮೂಲ್ಯ ಕ್ಷಣಗಳನ್ನು ಸೆರೆಹಿಡಿಯಲು ಸಮರ್ಪಿತ', hi: 'आपके सबसे कीमती पलों को कैद करने के लिए समर्पित' })}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                <img
                  src={aboutContent?.image_url || 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80'}
                  alt={t(aboutContent?.title) || 'About us'}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <p className="font-body text-lg text-foreground leading-relaxed">
                {t(aboutContent?.description) || t({ 
                  en: 'We are a team of passionate professionals dedicated to capturing life\'s most precious moments with creativity, precision, and care. Our commitment to excellence has made us a trusted name in the industry.',
                  kn: 'ಸೃಜನಶೀಲತೆ, ನಿಖರತೆ ಮತ್ತು ಕಾಳಜಿಯೊಂದಿಗೆ ಜೀವನದ ಅತ್ಯಂತ ಅಮೂಲ್ಯ ಕ್ಷಣಗಳನ್ನು ಸೆರೆಹಿಡಿಯಲು ಸಮರ್ಪಿತ ಉತ್ಸಾಹಿ ವೃತ್ತಿಪರರ ತಂಡ ನಾವು.',
                  hi: 'हम जुनूनी पेशेवरों की एक टीम हैं जो रचनात्मकता, सटीकता और देखभाल के साथ जीवन के सबसे कीमती पलों को कैद करने के लिए समर्पित हैं।'
                })}
              </p>
              
              <div className="border-l-4 border-primary pl-6 py-4 bg-primary/5 rounded-r-lg">
                <p className="font-body text-muted-foreground italic">
                  {t({ 
                    en: '"Our passion is to turn your special moments into timeless memories that you can cherish forever."',
                    kn: '"ನಿಮ್ಮ ವಿಶೇಷ ಕ್ಷಣಗಳನ್ನು ಶಾಶ್ವತ ನೆನಪುಗಳಾಗಿ ಪರಿವರ್ತಿಸುವುದು ನಮ್ಮ ಉತ್ಸಾಹ."',
                    hi: '"आपके खास पलों को कालातीत यादों में बदलना हमारा जुनून है।"'
                  })}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">
              {t({ en: 'Our Values', kn: 'ನಮ್ಮ ಮೌಲ್ಯಗಳು', hi: 'हमारे मूल्य' })}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: Camera, 
                title: { en: 'Quality', kn: 'ಗುಣಮಟ್ಟ', hi: 'गुणवत्ता' },
                desc: { en: 'We deliver nothing but the best', kn: 'ನಾವು ಅತ್ಯುತ್ತಮವನ್ನು ಮಾತ್ರ ನೀಡುತ್ತೇವೆ', hi: 'हम केवल सर्वश्रेष्ठ प्रदान करते हैं' }
              },
              { 
                icon: Heart, 
                title: { en: 'Passion', kn: 'ಉತ್ಸಾಹ', hi: 'जुनून' },
                desc: { en: 'Love for what we do', kn: 'ನಾವು ಏನು ಮಾಡುತ್ತೇವೆ ಎಂಬುದಕ್ಕೆ ಪ್ರೀತಿ', hi: 'जो हम करते हैं उसके लिए प्यार' }
              },
              { 
                icon: Users, 
                title: { en: 'Customer Focus', kn: 'ಗ್ರಾಹಕ ಗಮನ', hi: 'ग्राहक फोकस' },
                desc: { en: 'Your satisfaction is our priority', kn: 'ನಿಮ್ಮ ತೃಪ್ತಿ ನಮ್ಮ ಆದ್ಯತೆ', hi: 'आपकी संतुष्टि हमारी प्राथमिकता है' }
              },
              { 
                icon: Award, 
                title: { en: 'Excellence', kn: 'ಶ್ರೇಷ್ಠತೆ', hi: 'उत्कृष्टता' },
                desc: { en: 'Striving to be the best', kn: 'ಅತ್ಯುತ್ತಮರಾಗಲು ಶ್ರಮಿಸುತ್ತಿದ್ದೇವೆ', hi: 'सर्वश्रेष्ठ होने का प्रयास' }
              }
            ].map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card p-6 rounded-lg border text-center"
              >
                <div className="inline-flex p-3 bg-primary/10 rounded-full mb-4">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{t(value.title)}</h3>
                <p className="text-sm text-muted-foreground">{t(value.desc)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
