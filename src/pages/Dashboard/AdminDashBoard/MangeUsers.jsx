import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Users, Search, Trash2, Shield, UserCheck, Briefcase, Coins } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  const fetchUsers = async () => {
    try {
      const res = await axiosSecure.get(`/api/users`);
      setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (email, name) => {
    const confirm = await Swal.fire({
      title: 'Delete User Account?',
      text: `Are you sure you want to permanently delete ${name || email}? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete Account',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#EF4444',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/api/users/${email}`);
        if (res.data.success) {
          Swal.fire('Deleted!', 'User account has been deleted.', 'success');
          fetchUsers();
        } else {
          Swal.fire('Error', res.data.message || 'Failed to delete user', 'error');
        }
      } catch (err) {
        console.error('Failed to delete user', err);
        Swal.fire('Error', 'Something went wrong.', 'error');
      }
    }
  };

  const handleUpdateRole = async (email, newRole) => {
    try {
      const res = await axiosSecure.patch(`/api/users/${email}`, {
        role: newRole,
      });
      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Role Updated!',
          text: `User role has been changed to ${newRole}.`,
          timer: 1500,
          showConfirmButton: false,
        });
        fetchUsers();
      } else {
        Swal.fire('Error', res.data.message || 'Failed to update role', 'error');
      }
    } catch (err) {
      console.error('Failed to update role', err);
      Swal.fire('Error', 'Failed to update user role.', 'error');
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-primary" />
            Manage Platform Users
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            View user profiles, assign operational roles, and manage credentials.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, role..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6 font-semibold">User</th>
                <th className="py-3.5 px-6 font-semibold">Email</th>
                <th className="py-3.5 px-6 font-semibold">Coins Balance</th>
                <th className="py-3.5 px-6 font-semibold">Role</th>
                <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    No users matching search query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const initial = (user.name || user.email || 'U').charAt(0).toUpperCase();
                  return (
                    <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {user.photo ? (
                            <img
                              src={user.photo}
                              alt={user.name}
                              className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary/20"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                              {initial}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {user.name || 'Anonymous User'}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              UID: {user.uid ? user.uid.substring(0, 10) + '...' : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-slate-600 dark:text-slate-400">
                        {user.email}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                          <Coins className="w-3.5 h-3.5" />
                          {Number(user.coins || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={user.role || 'worker'}
                          onChange={(e) => handleUpdateRole(user.email, e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer capitalize"
                        >
                          <option value="worker">Worker</option>
                          <option value="buyer">Buyer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDeleteUser(user.email, user.name)}
                          className="p-2 rounded-lg text-rose-500 hover:text-white hover:bg-rose-500 transition-colors cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
