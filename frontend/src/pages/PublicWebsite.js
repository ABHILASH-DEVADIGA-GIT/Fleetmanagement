import React, { useState, useEffect } from 'react';
import { Routes, Route, useParams, Navigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import { PublicHome } from '../components/public/PublicHome';
import { PublicAbout } from '../components/public/PublicAbout';
import { PublicServices } from '../components/public/PublicServices';
import { PublicPricing } from '../components/public/PublicPricing';
import { PublicBooking } from '../components/public/PublicBooking';
import { PublicHeader } from '../components/public/PublicHeader';
import { PublicFooter } from '../components/public/PublicFooter';
import { PublicGallery } from '../components/public/PublicGallery';
import { PublicProducts } from '../components/public/PublicProducts';
import { PublicContact } from '../components/public/PublicContact';
import { Loader2 } from 'lucide-react';

export const PublicWebsite = () => {
  const { clientId } = useParams();
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { changeLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use the new consolidated API
        const response = await api.get(`/public/site/${clientId}`);
        setSiteData(response.data);
        
        // Apply client theme
        if (response.data.client?.theme && response.data.client.theme !== theme) {
          toggleTheme();
        }
        
        // Apply primary color as CSS variable
        if (response.data.client?.primary_color) {
          document.documentElement.style.setProperty('--primary-color', response.data.client.primary_color);
        }
      } catch (error) {
        console.error('Failed to fetch website data:', error);
        setError('Website not found');
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

  if (error || !siteData || !siteData.client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold mb-4">Website Not Found</h1>
          <p className="font-body text-muted-foreground">The requested website does not exist.</p>
        </div>
      </div>
    );
  }

  const { client, site_content, services, gallery, products, product_categories, offers, packages, addons } = siteData;
  const enabledModules = client.enabled_modules || ['about', 'services', 'gallery', 'booking', 'offers', 'contact'];

  // Create content object for backward compatibility
  const content = site_content || {
    banner: site_content?.hero || {},
    featured: site_content?.services_section || {},
    about: site_content?.about || {}
  };

  // Map hero to banner for backward compatibility
  if (site_content?.hero) {
    content.banner = site_content.hero;
  }

  return (
    <div className="min-h-screen bg-background" data-testid="public-website">
      <PublicHeader 
        client={client} 
        enabledLanguages={client.enabled_languages} 
        enabledModules={enabledModules}
      />
      
      <Routes>
        <Route 
          path="/" 
          element={
            <PublicHome 
              content={content} 
              siteContent={site_content}
              offers={enabledModules.includes('offers') ? offers : []} 
              services={enabledModules.includes('services') ? services : []} 
              clientId={clientId} 
            />
          } 
        />
        
        {enabledModules.includes('about') && (
          <Route path="/about" element={<PublicAbout content={content} siteContent={site_content} client={client} />} />
        )}
        
        {enabledModules.includes('services') && (
          <Route path="/services" element={<PublicServices services={services} offers={offers} siteContent={site_content} />} />
        )}
        
        {enabledModules.includes('gallery') && (
          <Route path="/gallery" element={<PublicGallery gallery={gallery} siteContent={site_content} />} />
        )}
        
        {enabledModules.includes('products') && (
          <Route 
            path="/products" 
            element={
              <PublicProducts 
                products={products} 
                categories={product_categories} 
                clientId={clientId}
                client={client}
              />
            } 
          />
        )}
        
        {enabledModules.includes('contact') && (
          <Route path="/contact" element={<PublicContact client={client} siteContent={site_content} />} />
        )}
        
        {enabledModules.includes('booking') && (
          <>
            <Route path="/pricing" element={<PublicPricing clientId={clientId} packages={packages} addons={addons} />} />
            <Route path="/booking" element={<PublicBooking clientId={clientId} packages={packages} addons={addons} />} />
          </>
        )}
        
        {/* Redirect disabled modules to home */}
        <Route path="*" element={<Navigate to={`/site/${clientId}`} replace />} />
      </Routes>
      
      <PublicFooter client={client} content={content} siteContent={site_content} />
    </div>
  );
};
