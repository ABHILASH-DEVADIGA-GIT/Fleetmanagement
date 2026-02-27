import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Trash2, Bell } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

export const NotificationPanel = ({ onClose }) => {
  const { notifications, markAsRead, deleteNotification } = useNotifications();
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

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="absolute right-0 top-12 w-96 bg-card border border-border shadow-lg z-50"
      data-testid="notification-panel"
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-ui font-semibold uppercase tracking-wider text-sm">Notifications</h3>
        <Button onClick={onClose} variant="ghost" size="icon">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-96">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
            <p className="font-body text-muted-foreground">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notif) => (
              <motion.div
                key={notif.notification_id}
                layout
                className={`p-4 hover:bg-muted/50 transition-colors ${
                  !notif.is_read ? 'bg-muted/30' : ''
                }`}
                data-testid="notification-item"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-ui font-semibold text-sm mb-1">{notif.title}</h4>
                    <p className="font-body text-xs text-muted-foreground mb-2">{notif.message}</p>
                    <p className="font-body text-xs text-muted-foreground">
                      {new Date(notif.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {!notif.is_read && (
                      <Button
                        onClick={() => markAsRead(notif.notification_id)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        data-testid="mark-read-button"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      onClick={() => deleteNotification(notif.notification_id)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      data-testid="delete-notification-button"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </ScrollArea>
    </motion.div>
  );
};
