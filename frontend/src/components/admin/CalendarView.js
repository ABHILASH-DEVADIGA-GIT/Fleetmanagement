import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

export const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchCalendarData();
  }, [currentDate]);

  const fetchCalendarData = async () => {
    try {
      const month = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      const response = await api.get(`/admin/calendar?month=${month}`);
      setCalendarData(response.data);
    } catch (error) {
      console.error('Failed to fetch calendar:', error);
    }
  };

  const handleDateClick = (date, events) => {
    setSelectedDate(date);
    setSelectedEvents(events || []);
    setDialogOpen(true);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'inquiry': return 'bg-yellow-500';
      case 'confirmed': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const days = getDaysInMonth();

  return (
    <div data-testid="calendar-view">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-4xl font-bold">Calendar</h1>
        <div className="flex items-center gap-4">
          <Button onClick={prevMonth} variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-ui text-xl font-semibold min-w-[200px] text-center">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <Button onClick={nextMonth} variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="p-6 bg-card border border-border">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="font-ui font-semibold text-center text-sm text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (!day) return <div key={`empty-${index}`} className="aspect-square" />;
            
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const events = calendarData[dateStr] || [];
            const isToday = dateStr === new Date().toISOString().split('T')[0];

            return (
              <button
                key={day}
                onClick={() => handleDateClick(dateStr, events)}
                className={`aspect-square border border-border rounded-sm p-2 hover:bg-muted transition-colors ${
                  isToday ? 'border-primary border-2' : ''
                }`}
              >
                <div className="font-ui text-sm font-semibold mb-1">{day}</div>
                {events.length > 0 && (
                  <div className="space-y-1">
                    {events.slice(0, 2).map((event) => (
                      <div
                        key={event.event_id}
                        className={`h-1.5 rounded-full ${getStatusColor(event.status)}`}
                      />
                    ))}
                    {events.length > 2 && (
                      <div className="text-xs text-muted-foreground">+{events.length - 2}</div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="font-ui text-sm">Inquiry</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="font-ui text-sm">Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="font-ui text-sm">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="font-ui text-sm">Cancelled</span>
          </div>
        </div>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">
              Events on {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No events scheduled for this date</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedEvents.map((event) => (
                <Card key={event.event_id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-ui font-semibold text-lg">{event.name}</h3>
                      <p className="font-body text-sm text-muted-foreground capitalize">{event.event_type}</p>
                      {event.event_time && (
                        <p className="font-body text-sm text-muted-foreground mt-1">Time: {event.event_time}</p>
                      )}
                      {event.location && (
                        <p className="font-body text-sm text-muted-foreground">Location: {event.location}</p>
                      )}
                    </div>
                    <Badge variant={event.status === 'confirmed' ? 'default' : 'secondary'}>
                      {event.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};