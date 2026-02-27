import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

export const AdminUserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'admin',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.filter(u => u.client_id === user.client_id));
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { ...formData, client_id: user.client_id });
      toast.success('User created successfully');
      setOpen(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      full_name: '',
      role: 'admin',
    });
  };

  return (
    <div data-testid="admin-user-management">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-4xl font-bold">User Management</h1>
        <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="font-ui uppercase tracking-wider" data-testid="add-user-button">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl">Create New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="user-form">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                  data-testid="fullname-input"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  data-testid="email-input"
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  data-testid="password-input"
                />
              </div>
              <Button type="submit" className="w-full font-ui uppercase tracking-wider" data-testid="submit-user-button">
                Create User
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-ui uppercase">Name</TableHead>
              <TableHead className="font-ui uppercase">Email</TableHead>
              <TableHead className="font-ui uppercase">Role</TableHead>
              <TableHead className="font-ui uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.user_id} data-testid="user-row">
                <TableCell className="font-body font-semibold">{u.full_name}</TableCell>
                <TableCell className="font-body">{u.email}</TableCell>
                <TableCell className="font-body capitalize">{u.role.replace('_', ' ')}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDelete(u.user_id)} variant="ghost" size="icon" className="text-destructive" data-testid="delete-user-button">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
