import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Calendar, Plus, Trash2, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';

export const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [openBlockDate, setOpenBlockDate] = useState(false);
  const [blockDateInput, setBlockDateInput] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchBookings();
    fetchBlockedDates();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/admin/bookings');
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    }
  };

  const fetchBlockedDates = async () => {
    try {
      const response = await api.get('/admin/blocked-dates');
      setBlockedDates(response.data);
    } catch (error) {
      toast.error('Failed to fetch blocked dates');
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await api.put(`/admin/bookings/${bookingId}`, { status: newStatus });
      toast.success('Booking status updated');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update booking');
    }
  };

  const handleBlockDate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/blocked-dates', { date: blockDateInput });
      toast.success('Date blocked successfully');
      setOpenBlockDate(false);
      setBlockDateInput('');
      fetchBlockedDates();
    } catch (error) {
      toast.error('Failed to block date');
    }
  };

  const handleUnblockDate = async (blockedId) => {
    try {
      await api.delete(`/admin/blocked-dates/${blockedId}`);
      toast.success('Date unblocked successfully');
      fetchBlockedDates();
    } catch (error) {
      toast.error('Failed to unblock date');
    }
  };

  const filteredBookings = filterStatus === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filterStatus);

  return (
    <div data-testid="booking-management">
      <h1 className="font-heading text-4xl font-bold mb-8">Booking Management</h1>

      <Tabs defaultValue="bookings" className="w-full">
        <TabsList>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="blocked-dates">Blocked Dates</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-6 mt-6">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48" data-testid="status-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-card border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-ui uppercase">Name</TableHead>
                  <TableHead className="font-ui uppercase">Contact</TableHead>
                  <TableHead className="font-ui uppercase">Event Type</TableHead>
                  <TableHead className="font-ui uppercase">Event Date</TableHead>
                  <TableHead className="font-ui uppercase">Status</TableHead>
                  <TableHead className="font-ui uppercase">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.booking_id} data-testid="booking-row">
                    <TableCell className="font-body font-semibold">{booking.name}</TableCell>
                    <TableCell className="font-body">
                      <div>{booking.phone}</div>
                      {booking.email && <div className="text-xs text-muted-foreground">{booking.email}</div>}
                    </TableCell>
                    <TableCell className="font-body capitalize">{booking.event_type}</TableCell>
                    <TableCell className="font-body">
                      {new Date(booking.event_date).toLocaleDateString()}
                      {booking.event_time && <div className="text-xs text-muted-foreground">{booking.event_time}</div>}
                    </TableCell>
                    <TableCell>
                      <Badge variant={booking.status === 'confirmed' ? 'default' : booking.status === 'pending' ? 'outline' : 'secondary'}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select onValueChange={(value) => handleStatusUpdate(booking.booking_id, value)} defaultValue={booking.status}>
                        <SelectTrigger className="w-32" data-testid="booking-status-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="blocked-dates" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <p className="font-body text-muted-foreground">Manage dates when bookings are not available</p>
            <Dialog open={openBlockDate} onOpenChange={setOpenBlockDate}>
              <DialogTrigger asChild>
                <Button className="font-ui uppercase tracking-wider" data-testid="block-date-button">
                  <Plus className="mr-2 h-4 w-4" />
                  Block Date
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-heading text-2xl">Block a Date</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleBlockDate} className="space-y-4" data-testid="block-date-form">
                  <div>
                    <Label>Select Date</Label>
                    <Input
                      type="date"
                      value={blockDateInput}
                      onChange={(e) => setBlockDateInput(e.target.value)}
                      required
                      data-testid="date-input"
                    />
                  </div>
                  <Button type="submit" className="w-full font-ui uppercase tracking-wider" data-testid="submit-block-date">
                    Block Date
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {blockedDates.map((blocked) => (
              <div key={blocked.blocked_id} className="bg-card border border-border p-4 flex items-center justify-between" data-testid="blocked-date-item">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-destructive" />
                  <span className="font-ui">{new Date(blocked.date).toLocaleDateString()}</span>
                </div>
                <Button onClick={() => handleUnblockDate(blocked.blocked_id)} variant="ghost" size="icon" className="text-destructive" data-testid="unblock-date-button">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
