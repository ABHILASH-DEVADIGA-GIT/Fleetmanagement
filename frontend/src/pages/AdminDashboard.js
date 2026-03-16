import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, FileText, Briefcase, Tag, Calendar, Users, LogOut, Menu, X, Bell, Package, Image, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { AdminOverview } from '../components/admin/AdminOverview';
import { ContentManagement } from '../components/admin/ContentManagement';
import { ServiceManagement } from '../components/admin/ServiceManagement';
import { OfferManagement } from '../components/admin/OfferManagement';
import { BookingManagement } from '../components/admin/BookingManagement';
import { AdminUserManagement } from '../components/admin/AdminUserManagement';
import { NotificationPanel } from '../components/shared/NotificationPanel';
import { CalendarView } from '../components/admin/CalendarView';
import { LeadManagement } from '../components/admin/LeadManagement';
import { PackageManagement } from '../components/admin/PackageManagement';
import { QuotationManagement } from '../components/admin/QuotationManagement';
import { InvoiceManagement } from '../components/admin/InvoiceManagement';
import { ExpenseManagement } from '../components/admin/ExpenseManagement';
import { ReportsView } from '../components/admin/ReportsView';
import { ProductManagement } from '../components/admin/ProductManagement';
import { GalleryManagement } from '../components/admin/GalleryManagement';
import { SiteContentEditor } from '../components/admin/SiteContentEditor';

export const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: Home },
    { path: '/admin/calendar', label: 'Calendar', icon: Calendar },
    { path: '/admin/leads', label: 'Leads', icon: Users },
    { path: '/admin/packages', label: 'Packages', icon: Briefcase },
    { path: '/admin/quotations', label: 'Quotations', icon: FileText },
    { path: '/admin/invoices', label: 'Invoices', icon: FileText },
    { path: '/admin/expenses', label: 'Expenses', icon: Tag },
    { path: '/admin/reports', label: 'Reports', icon: FileText },
    { divider: true, label: 'Website' },
    { path: '/admin/site-content', label: 'Site Content', icon: Globe },
    { path: '/admin/services', label: 'Services', icon: Briefcase },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/gallery', label: 'Gallery', icon: Image },
    { path: '/admin/offers', label: 'Offers', icon: Tag },
    { path: '/admin/bookings', label: 'Bookings', icon: Calendar },
    { path: '/admin/users', label: 'Users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="admin-dashboard">
      <div className="flex">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed lg:sticky top-0 left-0 h-screen w-70 bg-card border-r border-border z-50"
            >
              <div className="flex flex-col h-full p-6">
                <div className="mb-8">
                  <h1 className="font-heading text-2xl font-bold text-foreground" data-testid="dashboard-title">FrameBook Pro</h1>
                  <p className="font-ui text-xs text-muted-foreground uppercase tracking-wider mt-1">Admin Panel</p>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto">
                  {menuItems.map((item, idx) => (
                    item.divider ? (
                      <div key={idx} className="pt-4 pb-2">
                        <p className="px-4 text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
                      </div>
                    ) : (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-sm hover:bg-muted transition-colors font-ui text-sm"
                        data-testid={`nav-${item.label.toLowerCase()}`}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    )
                  ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-ui font-bold">
                      {user?.full_name?.[0] || 'A'}
                    </div>
                    <div>
                      <p className="font-ui text-sm font-semibold">{user?.full_name}</p>
                      <p className="font-body text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full font-ui uppercase tracking-wider"
                    data-testid="logout-button"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <main className="flex-1 min-h-screen">
          <header className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-40">
            <Button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              variant="ghost"
              size="icon"
              data-testid="sidebar-toggle"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <div className="relative">
              <Button
                onClick={() => setNotificationOpen(!notificationOpen)}
                variant="ghost"
                size="icon"
                className="relative"
                data-testid="notification-button"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
              {notificationOpen && <NotificationPanel onClose={() => setNotificationOpen(false)} />}
            </div>
          </header>

          <div className="p-6 lg:p-12">
            <Routes>
              <Route path="/" element={<AdminOverview />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/leads" element={<LeadManagement />} />
              <Route path="/packages" element={<PackageManagement />} />
              <Route path="/quotations" element={<QuotationManagement />} />
              <Route path="/invoices" element={<InvoiceManagement />} />
              <Route path="/expenses" element={<ExpenseManagement />} />
              <Route path="/reports" element={<ReportsView />} />
              <Route path="/site-content" element={<SiteContentEditor />} />
              <Route path="/content" element={<ContentManagement />} />
              <Route path="/services" element={<ServiceManagement />} />
              <Route path="/products" element={<ProductManagement />} />
              <Route path="/gallery" element={<GalleryManagement />} />
              <Route path="/offers" element={<OfferManagement />} />
              <Route path="/bookings" element={<BookingManagement />} />
              <Route path="/users" element={<AdminUserManagement />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};
