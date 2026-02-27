import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

export const PublicAbout = ({ content }) => {
  const { t } = useLanguage();

  if (!content) return null;

  return (
    <div className="py-24 px-6" data-testid="public-about">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-heading text-5xl sm:text-6xl font-bold mb-6" data-testid="about-page-title">
            {t(content.about?.title)}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="aspect-[4/5] relative"
          >
            <img
              src={content.about?.image_url || 'https://images.unsplash.com/photo-1764013003144-2e367f91c690?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBwaG90b2dyYXBoZXIlMjB0YWtpbmclMjBwaG90b3MlMjBpbiUyMHN0dWRpb3xlbnwwfHx8fDE3NzIxNjA1MTV8MA&ixlib=rb-4.1.0&q=85'}
              alt={t(content.about?.title)}
              className="w-full h-full object-cover border border-border"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <p className="font-body text-lg text-foreground leading-relaxed">
              {t(content.about?.description)}
            </p>
            <div className="border-l-4 border-primary pl-6 py-4">
              <p className="font-body text-muted-foreground italic">
                {t({ 
                  en: 'Our passion is to capture your most precious moments and turn them into timeless memories.',
                  kn: 'ನಿಮ್ಮ ಅತ್ಯಂತ ಅಮೂಲ್ಯವಾದ ಕ್ಷಣಗಳನ್ನು ಸೆರೆಹಿಡುವುದು ಮತ್ತು ಅವುಗಳನ್ನು ಪಾಲಿಸಲು ಕಾಲಹೀನ ಸ್ಮೃತಿಗಳಾಗಿ ಪರಿವರ್ತಿಸುವುದು.',
                  hi: 'हमारा जुनून आपके सबसे कीमती पलों को पकडना और उन्हें शाश्वत यादों में बदलना है।'
                })}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
