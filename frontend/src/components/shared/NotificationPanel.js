import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, CheckCheck, Trash2, Bell, Calendar, User, CreditCard, Info, AlertTriangle, Sparkles } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const NotificationIcon = ({ type }) => {
  const iconProps = { className: "h-4 w-4" };
  switch (type) {
    case 'booking':
      return <Calendar {...iconProps} />;
    case 'lead':
      return <User {...iconProps} />;
    case 'payment':
      return <CreditCard {...iconProps} />;
    case 'warning':
      return <AlertTriangle {...iconProps} />;
    case 'success':
      return <Sparkles {...iconProps} />;
    default:
      return <Info {...iconProps} />;
  }
};

const getTypeStyles = (type) => {
  switch (type) {
    case 'booking':
      return { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' };
    case 'lead':
      return { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' };
    case 'payment':
      return { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' };
    case 'warning':
      return { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' };
    case 'success':
      return { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };
  }
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

export const NotificationPanel = ({ onClose }) => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification.notification_id);
    }
    if (notification.link) {
      window.location.href = notification.link;
      onClose();
    }
  };

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="absolute right-0 top-12 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
      data-testid="notification-panel"
    >
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Badge className="bg-primary text-primary-foreground text-xs px-1.5 py-0">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-2"
            >
              <CheckCheck className="h-3.5 w-3.5 mr-1" />
              Read all
            </Button>
          )}
          <Button onClick={onClose} variant="ghost" size="icon" className="h-7 w-7">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Notification List */}
      <div className="max-h-[400px] overflow-y-auto">
        {loading && notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-10 text-center">
            <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground/20" />
            <p className="text-muted-foreground text-sm">No notifications yet</p>
            <p className="text-muted-foreground/70 text-xs mt-1">We'll notify you when something happens</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            <AnimatePresence>
              {notifications.map((notif) => {
                const styles = getTypeStyles(notif.notification_type);
                return (
                  <motion.div
                    key={notif.notification_id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`p-3 hover:bg-muted/50 cursor-pointer transition-all group ${
                      !notif.is_read ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => handleNotificationClick(notif)}
                    data-testid="notification-item"
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className={`p-2 rounded-lg flex-shrink-0 ${styles.bg} ${styles.text}`}>
                        <NotificationIcon type={notif.notification_type} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-medium line-clamp-1 ${!notif.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notif.title}
                          </p>
                          {!notif.is_read && (
                            <span className="h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-1.5 animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1.5">
                          {formatTime(notif.created_at)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notif.is_read && (
                          <Button
                            onClick={(e) => { e.stopPropagation(); markAsRead(notif.notification_id); }}
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-primary/10 hover:text-primary"
                            title="Mark as read"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          onClick={(e) => { e.stopPropagation(); deleteNotification(notif.notification_id); }}
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-2 border-t border-border bg-muted/20">
          <p className="text-center text-xs text-muted-foreground">
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </motion.div>
  );
};
