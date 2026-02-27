import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Mail, MapPin, MessageSquare, Phone, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';

export const PublicBooking = ({ clientId }) => {
  const { t } = useLanguage();
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    event_type: '',
    event_date: '',
    event_time: '',
    location: '',
    message: '',
  });

  useEffect(() => {
    fetchBlockedDates();
  }, []);

  const fetchBlockedDates = async () => {
    try {
      const response = await api.get(`/public/blocked-dates/${clientId}`);
      setBlockedDates(response.data);
    } catch (error) {
      console.error('Failed to fetch blocked dates:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (blockedDates.includes(formData.event_date)) {
      toast.error(t({ en: 'Selected date is not available', kn: 'ಆಯ್ಕೆ ಮಾಡಿದ ದಿನಾಂಕ ಲಭ್ಯವಿಲ್ಲ', hi: 'चयनित तिथि उपलब्ध नहीं है' }));
      setLoading(false);
      return;
    }

    const eventDate = new Date(formData.event_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (eventDate < today) {
      toast.error(t({ en: 'Event date must be in the future', kn: 'ಈವೆಂಟ್ ದಿನಾಂಕ ಭವಿಷ್ಯದಲ್ಲಿ ಇರಬೇಕು', hi: 'इवेंट की तारीख भविष्य में होनी चाहिए' }));
      setLoading(false);
      return;
    }

    try {
      await api.post('/public/bookings', { ...formData, client_id: clientId });
      toast.success(t({ en: 'Booking submitted successfully! We will contact you soon.', kn: 'ಬುಕಿಂಗ್ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ! ನಾವು ಶೀಘ್ರದಲ್ಲೇ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತೇವೆ.', hi: 'बुकिंग सफलतापूर्वक सबमिट की गई! हम जल्द ही आपसे संपर्क करेंगे।' }));
      setFormData({
        name: '',
        phone: '',
        email: '',
        event_type: '',
        event_date: '',
        event_time: '',
        location: '',
        message: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || t({ en: 'Booking failed. Please try again.', kn: 'ಬುಕಿಂಗ್ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.', hi: 'बुकिंग विफल रही। कृपया पुनः प्रयास करें।' }));
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="py-24 px-6" data-testid="public-booking">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-heading text-5xl sm:text-6xl font-bold mb-6" data-testid="booking-page-title">
            {t({ en: 'Book an Appointment', kn: 'ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ', hi: 'अपॉइंटमेंट बुक करें' })}
          </h1>
          <p className="font-body text-lg text-muted-foreground">
            {t({ en: 'Fill out the form below and we will get back to you shortly', kn: 'ಕೆಳಗಿನ ಫಾರ್ಮ್ ಅನ್ನು ಭರ್ತಿ ಮಾಡಿ ಮತ್ತು ನಾವು ಶೀಘ್ರದಲ್ಲೇ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತೇವೆ', hi: 'नीचे दिया गया फॉर्म भरें और हम जल्द ही आपसे संपर्क करेंगे' })}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border p-8 md:p-12"
        >
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="booking-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="uppercase text-xs tracking-widest text-muted-foreground mb-2 block">
                  {t({ en: 'Name', kn: 'ಹೆಸರು', hi: 'नाम' })} *
                </Label>
                <div className="relative">
                  <User className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-8 bg-transparent border-b border-input focus:border-primary rounded-none px-0 py-3"
                    required
                    data-testid="name-input"
                  />
                </div>
              </div>

              <div>
                <Label className="uppercase text-xs tracking-widest text-muted-foreground mb-2 block">
                  {t({ en: 'Phone', kn: 'ದೂರವಾಣಿ', hi: 'फोन' })} *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-8 bg-transparent border-b border-input focus:border-primary rounded-none px-0 py-3"
                    required
                    data-testid="phone-input"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="uppercase text-xs tracking-widest text-muted-foreground mb-2 block">
                {t({ en: 'Email', kn: 'ಇಮೇಲ್', hi: 'ईमेल' })}
              </Label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-8 bg-transparent border-b border-input focus:border-primary rounded-none px-0 py-3"
                  data-testid="email-input"
                />
              </div>
            </div>

            <div>
              <Label className="uppercase text-xs tracking-widest text-muted-foreground mb-2 block">
                {t({ en: 'Event Type', kn: 'ಈವೆಂಟ್ ಪ್ರಕಾರ', hi: 'इवेंट का प्रकार' })} *
              </Label>
              <Select value={formData.event_type} onValueChange={(value) => setFormData({ ...formData, event_type: value })} required>
                <SelectTrigger className="bg-transparent border-b border-input focus:border-primary rounded-none" data-testid="event-type-select">
                  <SelectValue placeholder={t({ en: 'Select event type', kn: 'ಈವೆಂಟ್ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ', hi: 'इवेंट प्रकार चुनें' })} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wedding">{t({ en: 'Wedding', kn: 'ಮದುವೆ', hi: 'शादी' })}</SelectItem>
                  <SelectItem value="portrait">{t({ en: 'Portrait', kn: 'ಭಾವಚಿತ್ರ', hi: 'पोर्ट्रेट' })}</SelectItem>
                  <SelectItem value="corporate">{t({ en: 'Corporate', kn: 'ಕಾರ್ಪೋರೇಟ್', hi: 'कॉर्पोरेट' })}</SelectItem>
                  <SelectItem value="family">{t({ en: 'Family', kn: 'ಕುಟುಂಬ', hi: 'परिवार' })}</SelectItem>
                  <SelectItem value="other">{t({ en: 'Other', kn: 'ಇತರೆ', hi: 'अन्य' })}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="uppercase text-xs tracking-widest text-muted-foreground mb-2 block">
                  {t({ en: 'Event Date', kn: 'ಈವೆಂಟ್ ದಿನಾಂಕ', hi: 'इवेंट की तारीख' })} *
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    min={getTomorrowDate()}
                    className="pl-8 bg-transparent border-b border-input focus:border-primary rounded-none px-0 py-3"
                    required
                    data-testid="event-date-input"
                  />
                </div>
              </div>

              <div>
                <Label className="uppercase text-xs tracking-widest text-muted-foreground mb-2 block">
                  {t({ en: 'Event Time', kn: 'ಈವೆಂಟ್ ಸಮಯ', hi: 'इवेंट का समय' })}
                </Label>
                <div className="relative">
                  <Clock className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="time"
                    value={formData.event_time}
                    onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                    className="pl-8 bg-transparent border-b border-input focus:border-primary rounded-none px-0 py-3"
                    data-testid="event-time-input"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="uppercase text-xs tracking-widest text-muted-foreground mb-2 block">
                {t({ en: 'Location', kn: 'ಸ್ಥಳ', hi: 'स्थान' })}
              </Label>
              <div className="relative">
                <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="pl-8 bg-transparent border-b border-input focus:border-primary rounded-none px-0 py-3"
                  data-testid="location-input"
                />
              </div>
            </div>

            <div>
              <Label className="uppercase text-xs tracking-widest text-muted-foreground mb-2 block">
                {t({ en: 'Message', kn: 'ಸಂದೇಶ', hi: 'संदेश' })}
              </Label>
              <div className="relative">
                <MessageSquare className="absolute left-0 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="pl-8 bg-transparent border border-input focus:border-primary rounded-sm"
                  data-testid="message-input"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm font-ui uppercase tracking-wider py-6 text-lg"
              data-testid="submit-booking-button"
            >
              {loading ? t({ en: 'Submitting...', kn: 'ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...', hi: 'सबमिट किया जा रहा है...' }) : t({ en: 'Submit Booking', kn: 'ಬುಕಿಂಗ್ ಸಲ್ಲಿಸಿ', hi: 'बुकिंग सबमिट करें' })}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
