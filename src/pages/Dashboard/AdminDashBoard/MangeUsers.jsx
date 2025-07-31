import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const axiosSecure= useAxiosSecure()


  const fetchUsers = async () => {
    try {
      const res = await axiosSecure.get(`/api/users`);
      setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (email) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: `This will permanently delete the user: ${email}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/api/users/${email}`);
        if (res.data.success) {
          Swal.fire('Deleted!', 'User has been deleted.', 'success');
          fetchUsers();
        } else {
          Swal.fire('Error', res.data.message, 'error');
        }
      } catch (err) {
        console.error('Failed to delete user', err);
        Swal.fire('Error!', 'Something went wrong.', 'error');
      }
    }
  };

  const handleUpdateRole = async (email, newRole) => {
    try {
      const res = await axiosSecure.patch(`/api/users/${email}`, {
        role: newRole,
      });
      if (res.data.success) {
        Swal.fire('Updated!', 'Role has been updated.', 'success');
        fetchUsers();
      } else {
        Swal.fire('Error', res.data.message, 'error');
      }
    } catch (err) {
      Swal.fire('Error!', 'Something went wrong while updating role.', 'error');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Photo</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="p-2 border">
                  <img
                    src={user?.photoURL || user?.photoUrl || user?.photo || user?.reloadUserInfo?.photoUrl || '/placeholder.svg'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">
                  <select
                    value={user.role}
                    onChange={(e) => handleUpdateRole(user.email, e.target.value)}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="buyer">Buyer</option>
                    <option value="worker">Worker</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleDeleteUser(user.email)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}


            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
