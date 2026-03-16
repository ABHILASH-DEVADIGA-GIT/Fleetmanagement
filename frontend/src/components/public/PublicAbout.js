import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../ui/badge';
import { Camera, Award, Users, Heart, CheckCircle, Star } from 'lucide-react';

export const PublicAbout = ({ content, siteContent, client }) => {
  const { t } = useLanguage();

  const aboutContent = siteContent?.about || content?.about || {};
  const primaryColor = client?.primary_color || '#1e40af';

  const values = [
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
  ];

  const features = [
    { en: 'Professional Equipment', kn: 'ವೃತ್ತಿಪರ ಸಲಕರಣೆ', hi: 'पेशेवर उपकरण' },
    { en: 'Experienced Team', kn: 'ಅನುಭವಿ ತಂಡ', hi: 'अनुभवी टीम' },
    { en: 'Creative Approach', kn: 'ಸೃಜನಾತ್ಮಕ ವಿಧಾನ', hi: 'रचनात्मक दृष्टिकोण' },
    { en: 'Timely Delivery', kn: 'ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ವಿತರಣೆ', hi: 'समय पर डिलीवरी' },
    { en: 'Affordable Pricing', kn: 'ಕೈಗೆಟುಕುವ ಬೆಲೆ', hi: 'किफायती मूल्य' },
    { en: 'Customer Support', kn: 'ಗ್ರಾಹಕ ಬೆಂಬಲ', hi: 'ग्राहक सहायता' },
  ];

  return (
    <div data-testid="public-about" className="bg-background">
      {/* Hero Section with Primary Color */}
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
              {t({ en: 'Know Us Better', kn: 'ನಮ್ಮನ್ನು ಚೆನ್ನಾಗಿ ತಿಳಿಯಿರಿ', hi: 'हमें बेहतर जानें' })}
            </Badge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white" data-testid="about-page-title">
              {t(aboutContent?.title) || t({ en: 'About Us', kn: 'ನಮ್ಮ ಬಗ್ಗೆ', hi: 'हमारे बारे में' })}
            </h1>
            <p className="text-white/90 max-w-2xl mx-auto text-lg">
              {t({ en: 'Dedicated to capturing your most precious moments with creativity and excellence', kn: 'ಸೃಜನಶೀಲತೆ ಮತ್ತು ಶ್ರೇಷ್ಠತೆಯೊಂದಿಗೆ ನಿಮ್ಮ ಅತ್ಯಮೂಲ್ಯ ಕ್ಷಣಗಳನ್ನು ಸೆರೆಹಿಡಿಯಲು ಸಮರ್ಪಿತ', hi: 'रचनात्मकता और उत्कृष्टता के साथ आपके सबसे कीमती पलों को कैद करने के लिए समर्पित' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-6 px-6 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { value: '10+', label: { en: 'Years Experience', kn: 'ವರ್ಷಗಳ ಅನುಭವ', hi: 'साल का अनुभव' } },
              { value: '500+', label: { en: 'Happy Clients', kn: 'ಸಂತೋಷ ಗ್ರಾಹಕರು', hi: 'खुश ग्राहक' } },
              { value: '1000+', label: { en: 'Projects Done', kn: 'ಮುಗಿದ ಯೋಜನೆಗಳು', hi: 'पूर्ण प्रोजेक्ट' } },
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

      {/* Main Content Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div 
                className="absolute -top-4 -left-4 w-full h-full rounded-lg"
                style={{ backgroundColor: `${primaryColor}20` }}
              ></div>
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl relative z-10">
                <img
                  src={aboutContent?.image_url || 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80'}
                  alt={t(aboutContent?.title) || 'About us'}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating Badge */}
              <div 
                className="absolute -bottom-6 -right-6 p-6 rounded-lg shadow-lg z-20 bg-white"
              >
                <div className="flex items-center gap-3">
                  <Star className="h-8 w-8" style={{ color: primaryColor, fill: primaryColor }} />
                  <div>
                    <p className="text-3xl font-bold" style={{ color: primaryColor }}>4.9</p>
                    <p className="text-xs text-muted-foreground">{t({ en: 'Customer Rating', kn: 'ಗ್ರಾಹಕ ರೇಟಿಂಗ್', hi: 'ग्राहक रेटिंग' })}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="font-heading text-3xl sm:text-4xl font-bold">
                {t({ en: 'Your Trusted Partner in Creating Memories', kn: 'ನೆನಪುಗಳನ್ನು ರಚಿಸುವಲ್ಲಿ ನಿಮ್ಮ ನಂಬಿಕಸ್ಥ ಪಾಲುದಾರ', hi: 'यादें बनाने में आपका विश्वसनीय साथी' })}
              </h2>
              
              <p className="font-body text-muted-foreground leading-relaxed">
                {t(aboutContent?.description) || t({ 
                  en: 'We are a team of passionate professionals dedicated to capturing life\'s most precious moments. With years of experience and a commitment to excellence, we transform your special occasions into timeless memories.',
                  kn: 'ಜೀವನದ ಅತ್ಯಂತ ಅಮೂಲ್ಯ ಕ್ಷಣಗಳನ್ನು ಸೆರೆಹಿಡಿಯಲು ಸಮರ್ಪಿತ ಉತ್ಸಾಹಿ ವೃತ್ತಿಪರರ ತಂಡ ನಾವು.',
                  hi: 'हम जुनूनी पेशेवरों की एक टीम हैं जो जीवन के सबसे कीमती पलों को कैद करने के लिए समर्पित हैं।'
                })}
              </p>

              {/* Feature List */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 flex-shrink-0" style={{ color: primaryColor }} />
                    <span className="text-sm">{t(feature)}</span>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <div 
                className="border-l-4 pl-6 py-4 rounded-r-lg mt-6"
                style={{ borderColor: primaryColor, backgroundColor: `${primaryColor}08` }}
              >
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

      {/* Values Section with Primary Color Background */}
      <section 
        className="py-20 px-6"
        style={{ backgroundColor: `${primaryColor}08` }}
      >
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
              {t({ en: 'Our Core Values', kn: 'ನಮ್ಮ ಮೂಲ ಮೌಲ್ಯಗಳು', hi: 'हमारे मुख्य मूल्य' })}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-lg border shadow-sm text-center hover:shadow-md transition-shadow"
              >
                <div 
                  className="inline-flex p-4 rounded-full mb-4"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <value.icon className="h-8 w-8" style={{ color: primaryColor }} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{t(value.title)}</h3>
                <p className="text-sm text-muted-foreground">{t(value.desc)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-10 px-6"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-2">
            {t({ en: 'Ready to Work Together?', kn: 'ಒಟ್ಟಿಗೆ ಕೆಲಸ ಮಾಡಲು ಸಿದ್ಧರಿದ್ದೀರಾ?', hi: 'साथ काम करने के लिए तैयार हैं?' })}
          </h2>
          <p className="text-base opacity-90 mb-5">
            {t({ en: "Let's create something beautiful together", kn: 'ಒಟ್ಟಿಗೆ ಏನಾದರೂ ಸುಂದರವಾದದ್ದನ್ನು ರಚಿಸೋಣ', hi: 'आइए साथ मिलकर कुछ खूबसूरत बनाएं' })}
          </p>
          <button className="bg-white font-ui uppercase tracking-wider px-6 py-2 rounded-md font-semibold hover:bg-white/90 transition-colors" style={{ color: primaryColor }}>
            {t({ en: 'Get In Touch', kn: 'ಸಂಪರ್ಕದಲ್ಲಿರಿ', hi: 'संपर्क में रहें' })}
          </button>
        </div>
      </section>
    </div>
  );
};
