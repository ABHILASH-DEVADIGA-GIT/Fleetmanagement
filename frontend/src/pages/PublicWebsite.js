import React, { useState, useEffect } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import { PublicHome } from '../components/public/PublicHome';
import { PublicAbout } from '../components/public/PublicAbout';
import { PublicServices } from '../components/public/PublicServices';
import { PublicBooking } from '../components/public/PublicBooking';
import { PublicHeader } from '../components/public/PublicHeader';
import { PublicFooter } from '../components/public/PublicFooter';
import { Loader2 } from 'lucide-react';

export const PublicWebsite = () => {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [content, setContent] = useState(null);
  const [services, setServices] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { changeLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientRes, contentRes, servicesRes, offersRes] = await Promise.all([
          api.get(`/public/clients/${clientId}`),
          api.get(`/public/content/${clientId}`),
          api.get(`/public/services/${clientId}`),
          api.get(`/public/offers/${clientId}`),
        ]);
        
        setClient(clientRes.data);
        setContent(contentRes.data);
        setServices(servicesRes.data);
        setOffers(offersRes.data);
        
        if (clientRes.data.theme !== theme) {
          toggleTheme();
        }
      } catch (error) {
        console.error('Failed to fetch website data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchData();
    }
  }, [clientId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold mb-4">Website Not Found</h1>
          <p className="font-body text-muted-foreground">The requested website does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="public-website">
      <PublicHeader client={client} enabledLanguages={client.enabled_languages} />
      
      <Routes>
        <Route path="/" element={<PublicHome content={content} offers={offers} services={services} clientId={clientId} />} />
        <Route path="/about" element={<PublicAbout content={content} />} />
        <Route path="/services" element={<PublicServices services={services} offers={offers} />} />
        <Route path="/pricing" element={<PublicPricing clientId={clientId} />} />
        <Route path="/booking" element={<PublicBooking clientId={clientId} />} />
      </Routes>
      
      <PublicFooter client={client} content={content} />
    </div>
  );
};
