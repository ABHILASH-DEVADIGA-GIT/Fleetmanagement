import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Minus, ShoppingCart, FileText, X } from 'lucide-react';
import api from '../../utils/api';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { useLanguage } from '../../context/LanguageContext';

export const PublicPricing = ({ clientId }) => {
  const { t } = useLanguage();
  const [packages, setPackages] = useState([]);
  const [addons, setAddons] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState({});
  const [panelOpen, setPanelOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPackages();
    fetchAddons();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await api.get('/admin/packages');
      setPackages(response.data.filter(p => p.is_active));
    } catch (error) {
      console.error('Failed to fetch packages');
    }
  };

  const fetchAddons = async () => {
    try {
      const response = await api.get('/admin/addons');
      setAddons(response.data.filter(a => a.is_active));
    } catch (error) {
      console.error('Failed to fetch add-ons');
    }
  };

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setSelectedAddons({});
    setPanelOpen(true);
  };

  const handleAddonToggle = (addonId) => {
    setSelectedAddons(prev => ({
      ...prev,
      [addonId]: prev[addonId] ? { ...prev[addonId], quantity: prev[addonId].quantity + 1 } : { quantity: 1 }
    }));
  };

  const updateAddonQuantity = (addonId, delta) => {
    setSelectedAddons(prev => {
      const newQty = (prev[addonId]?.quantity || 0) + delta;
      if (newQty <= 0) {
        const { [addonId]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [addonId]: { quantity: newQty } };
    });
  };

  const calculateTotal = () => {
    const basePrice = selectedPackage?.base_price || 0;
    const addonsTotal = Object.entries(selectedAddons).reduce((sum, [addonId, data]) => {
      const addon = addons.find(a => a.addon_id === addonId);
      return sum + (addon?.price || 0) * data.quantity;
    }, 0);
    const subtotal = basePrice + addonsTotal;
    const discount = (subtotal * (selectedPackage?.default_discount || 0)) / 100;
    const total = subtotal - discount;
    return { basePrice, addonsTotal, subtotal, discount, total };
  };

  const handleRequestQuotation = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      toast.error('Please provide name and phone');
      return;
    }
    setLoading(true);
    try {
      const leadData = {
        client_id: clientId,
        name: customerInfo.name,
        phone: customerInfo.phone,
        email: customerInfo.email,
        source: 'website',
        notes: `Interested in ${selectedPackage.name}`,
      };
      await api.post('/public/bookings', { ...leadData, event_type: 'inquiry', event_date: new Date().toISOString().split('T')[0] });
      toast.success('Quotation request submitted! We will contact you soon.');
      setPanelOpen(false);
      setCustomerInfo({ name: '', phone: '', email: '' });
    } catch (error) {
      toast.error('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const pricing = calculateTotal();

  return (
    <div className="py-24 px-6" data-testid="public-pricing">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-heading text-5xl sm:text-6xl font-bold mb-6">Pricing Packages</h1>
          <p className="font-body text-lg text-muted-foreground">
            Choose the perfect package for your special moments
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.package_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-8 h-full flex flex-col hover:shadow-xl transition-shadow">
                <h3 className="font-heading text-2xl font-bold mb-2">{pkg.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="font-heading text-4xl font-bold text-primary">₹{pkg.base_price.toLocaleString()}</span>
                  {pkg.default_discount > 0 && (
                    <Badge className="ml-3">{pkg.default_discount}% OFF</Badge>
                  )}
                </div>
                <p className="font-body text-sm text-muted-foreground mb-6">{pkg.description}</p>
                <div className="space-y-3 mb-8 flex-1">
                  {pkg.included_services.map((service, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="font-body text-sm">{service}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={() => handleSelectPackage(pkg)}
                  className="w-full font-ui uppercase tracking-wider"
                >
                  Select Package
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {panelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setPanelOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 h-full w-full max-w-2xl bg-background z-50 overflow-y-auto shadow-2xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-heading text-3xl font-bold">Customize Your Package</h2>
                  <Button onClick={() => setPanelOpen(false)} variant="ghost" size="icon">
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                {selectedPackage && (
                  <div className="space-y-8">
                    <Card className="p-6 bg-primary/5">
                      <h3 className="font-heading text-xl font-bold mb-2">{selectedPackage.name}</h3>
                      <p className="font-ui text-2xl font-bold text-primary">₹{selectedPackage.base_price.toLocaleString()}</p>
                      <div className="mt-4 space-y-2">
                        {selectedPackage.included_services.map((service, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span className="font-body text-sm">{service}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {addons.length > 0 && (
                      <div>
                        <h3 className="font-heading text-xl font-bold mb-4">Add Extra Services</h3>
                        <div className="space-y-4">
                          {addons.map((addon) => {
                            const qty = selectedAddons[addon.addon_id]?.quantity || 0;
                            return (
                              <Card key={addon.addon_id} className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-ui font-semibold">{addon.name}</h4>
                                    <p className="font-body text-sm text-muted-foreground">{addon.description}</p>
                                    <p className="font-ui text-lg font-bold text-primary mt-2">₹{addon.price}</p>
                                  </div>
                                  {qty === 0 ? (
                                    <Button onClick={() => handleAddonToggle(addon.addon_id)} size="sm">
                                      <Plus className="h-4 w-4 mr-1" /> Add
                                    </Button>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <Button onClick={() => updateAddonQuantity(addon.addon_id, -1)} variant="outline" size="icon" className="h-8 w-8">
                                        <Minus className="h-3 w-3" />
                                      </Button>
                                      <span className="font-ui font-semibold w-8 text-center">{qty}</span>
                                      <Button onClick={() => updateAddonQuantity(addon.addon_id, 1)} variant="outline" size="icon" className="h-8 w-8">
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <Card className="p-6 bg-muted/50">
                      <h3 className="font-heading text-xl font-bold mb-4">Price Breakdown</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between font-body">
                          <span>Package Base Price</span>
                          <span>₹{pricing.basePrice.toLocaleString()}</span>
                        </div>
                        {pricing.addonsTotal > 0 && (
                          <div className="flex justify-between font-body">
                            <span>Add-ons Total</span>
                            <span>₹{pricing.addonsTotal.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-body pt-3 border-t border-border">
                          <span>Subtotal</span>
                          <span>₹{pricing.subtotal.toLocaleString()}</span>
                        </div>
                        {pricing.discount > 0 && (
                          <div className="flex justify-between font-body text-green-600">
                            <span>Discount ({selectedPackage.default_discount}%)</span>
                            <span>-₹{pricing.discount.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-heading text-2xl font-bold pt-3 border-t-2 border-border">
                          <span>Grand Total</span>
                          <span className="text-primary">₹{pricing.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </Card>

                    <div className="space-y-4">
                      <h3 className="font-heading text-xl font-bold">Your Information</h3>
                      <div>
                        <Label>Name *</Label>
                        <Input
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <Label>Phone *</Label>
                        <Input
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                          placeholder="Your phone number"
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                          placeholder="Your email (optional)"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={handleRequestQuotation}
                        disabled={loading}
                        className="flex-1 py-6 font-ui uppercase tracking-wider"
                        variant="outline"
                      >
                        <FileText className="mr-2 h-5 w-5" />
                        Request Quotation
                      </Button>
                      <Button
                        onClick={handleRequestQuotation}
                        disabled={loading}
                        className="flex-1 py-6 font-ui uppercase tracking-wider"
                      >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Book Now
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
