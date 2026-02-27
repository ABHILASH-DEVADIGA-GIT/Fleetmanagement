import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, X, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

export const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState({});
  const [walkins, setWalkins] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [walkinDialogOpen, setWalkinDialogOpen] = useState(false);
  const [walkinForm, setWalkinForm] = useState({
    title: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    notes: ''
  });

  useEffect(() => {
    fetchCalendarData();
    fetchWalkins();
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

  const fetchWalkins = async () => {
    try {
      const response = await api.get('/admin/walkin-appointments');
      setWalkins(response.data);
    } catch (error) {
      console.error('Failed to fetch walk-ins:', error);
    }
  };

  const handleDateClick = (date, events) => {
    setSelectedDate(date);
    setSelectedEvents(events || []);
    setDialogOpen(true);
  };

  const handleCreateWalkin = async () => {
    if (!walkinForm.title || !walkinForm.start_date || !walkinForm.end_date) {
      toast.error('Please fill required fields');
      return;
    }
    try {
      await api.post('/admin/walkin-appointments', walkinForm);
      toast.success('Walk-in appointment created');
      setWalkinDialogOpen(false);
      resetWalkinForm();
      fetchWalkins();
    } catch (error) {
      toast.error('Failed to create walk-in appointment');
    }
  };

  const handleDeleteWalkin = async (walkinId) => {
    if (!window.confirm('Delete this blocked time?')) return;
    try {
      await api.delete(`/admin/walkin-appointments/${walkinId}`);
      toast.success('Walk-in deleted');
      fetchWalkins();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const resetWalkinForm = () => {
    setWalkinForm({
      title: '',
      start_date: '',
      end_date: '',
      start_time: '',
      end_time: '',
      notes: ''
    });
  };

  const openWalkinWithDate = (date) => {
    setWalkinForm({
      ...walkinForm,
      start_date: date,
      end_date: date
    });
    setWalkinDialogOpen(true);
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

  const isDateBlocked = (dateStr) => {
    return walkins.some(w => {
      const start = new Date(w.start_date);
      const end = new Date(w.end_date);
      const check = new Date(dateStr);
      return check >= start && check <= end;
    });
  };

  const getWalkinsForDate = (dateStr) => {
    return walkins.filter(w => {
      const start = new Date(w.start_date);
      const end = new Date(w.end_date);
      const check = new Date(dateStr);
      return check >= start && check <= end;
    });
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const days = getDaysInMonth();

  return (
    <div data-testid="calendar-view" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground mt-1">Manage your events and block time</p>
        </div>
        <Button onClick={() => { resetWalkinForm(); setWalkinDialogOpen(true); }} data-testid="add-walkin-btn">
          <Plus className="mr-2 h-4 w-4" />
          Block Time / Walk-in
        </Button>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-center gap-4">
        <Button onClick={prevMonth} variant="outline" size="icon">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="font-semibold text-xl min-w-[200px] text-center">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <Button onClick={nextMonth} variant="outline" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <Card className="p-6">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="font-semibold text-center text-sm text-muted-foreground py-2">
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
            const blocked = isDateBlocked(dateStr);
            const dateWalkins = getWalkinsForDate(dateStr);

            return (
              <button
                key={day}
                onClick={() => handleDateClick(dateStr, events)}
                className={`aspect-square border rounded-lg p-2 hover:bg-muted transition-colors relative ${
                  isToday ? 'border-primary border-2' : ''
                } ${blocked ? 'bg-orange-50 border-orange-300' : ''}`}
              >
                <div className="font-semibold text-sm mb-1">{day}</div>
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
                {blocked && (
                  <div className="absolute bottom-1 right-1">
                    <Clock className="h-3 w-3 text-orange-500" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-6 pt-6 border-t flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-sm">Inquiry</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-sm">Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-sm">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-sm">Cancelled</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-500" />
            <span className="text-sm">Blocked/Walk-in</span>
          </div>
        </div>
      </Card>

      {/* Upcoming Blocked Times */}
      {walkins.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Blocked Times / Walk-in Appointments</h3>
          <div className="space-y-3">
            {walkins.map(walkin => (
              <div key={walkin.walkin_id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <p className="font-semibold">{walkin.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(walkin.start_date).toLocaleDateString()} 
                    {walkin.start_date !== walkin.end_date && ` - ${new Date(walkin.end_date).toLocaleDateString()}`}
                    {walkin.start_time && ` • ${walkin.start_time}`}
                    {walkin.end_time && ` - ${walkin.end_time}`}
                  </p>
                  {walkin.notes && <p className="text-sm text-muted-foreground">{walkin.notes}</p>}
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteWalkin(walkin.walkin_id)} className="text-destructive">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Date Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Blocked times for this date */}
            {selectedDate && getWalkinsForDate(selectedDate).length > 0 && (
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p className="font-semibold text-orange-700 mb-2">Blocked Time</p>
                {getWalkinsForDate(selectedDate).map(w => (
                  <div key={w.walkin_id} className="text-sm">
                    <span className="font-medium">{w.title}</span>
                    {w.start_time && <span className="text-muted-foreground"> • {w.start_time} - {w.end_time}</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Events for this date */}
            {selectedEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No events scheduled for this date</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedEvents.map((event) => (
                  <Card key={event.event_id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{event.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{event.event_type}</p>
                        {event.event_time && (
                          <p className="text-sm text-muted-foreground mt-1">Time: {event.event_time}</p>
                        )}
                        {event.location && (
                          <p className="text-sm text-muted-foreground">Location: {event.location}</p>
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

            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => { setDialogOpen(false); openWalkinWithDate(selectedDate); }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Block This Date
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Walk-in Dialog */}
      <Dialog open={walkinDialogOpen} onOpenChange={(value) => { setWalkinDialogOpen(value); if (!value) resetWalkinForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block Time / Walk-in Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={walkinForm.title}
                onChange={(e) => setWalkinForm({ ...walkinForm, title: e.target.value })}
                placeholder="e.g., Personal Work, Out of Office, Walk-in Client"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  value={walkinForm.start_date}
                  onChange={(e) => setWalkinForm({ ...walkinForm, start_date: e.target.value })}
                />
              </div>
              <div>
                <Label>End Date *</Label>
                <Input
                  type="date"
                  value={walkinForm.end_date}
                  onChange={(e) => setWalkinForm({ ...walkinForm, end_date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time (Optional)</Label>
                <Input
                  type="time"
                  value={walkinForm.start_time}
                  onChange={(e) => setWalkinForm({ ...walkinForm, start_time: e.target.value })}
                />
              </div>
              <div>
                <Label>End Time (Optional)</Label>
                <Input
                  type="time"
                  value={walkinForm.end_time}
                  onChange={(e) => setWalkinForm({ ...walkinForm, end_time: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={walkinForm.notes}
                onChange={(e) => setWalkinForm({ ...walkinForm, notes: e.target.value })}
                placeholder="Additional details..."
                rows={2}
              />
            </div>
            <Button onClick={handleCreateWalkin} className="w-full" data-testid="save-walkin-btn">
              Block Time
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
