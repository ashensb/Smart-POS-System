import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Users as UsersIcon, UserPlus, Trash2, Ban, CheckCircle, Shield } from 'lucide-react';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'cashier' });
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await API.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch users', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateStaff = async (e) => {
        e.preventDefault();
        try {
            await API.post('/admin/users', form);
            setForm({ name: '', email: '', password: '', role: 'cashier' });
            setShowAddModal(false);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating user');
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await API.patch(`/admin/users/${id}/toggle-status`);
            fetchUsers();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                await API.delete(`/admin/users/${id}`);
                fetchUsers();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete user');
            }
        }
    };

    if (loading) return <div className="p-6 text-slate-500">Loading Users...</div>;

    return (
        <div className="p-6 bg-slate-50 min-h-screen space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <UsersIcon className="text-blue-600" /> User & Customer Management
                    </h1>
                    <p className="text-sm text-slate-500">Manage registered customers, cashiers, and admin staff</p>
                </div>
                <button
                    onClick={() => setShowAddModal(!showAddModal)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-sm flex items-center gap-2 shadow-sm"
                >
                    <UserPlus size={18} /> Add Staff Member
                </button>
            </div>

            {/* Add Staff Modal / Form */}
            {showAddModal && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 max-w-xl">
                    <h2 className="font-bold text-slate-800">Add New Staff / Admin</h2>
                    <form onSubmit={handleCreateStaff} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="border p-2 rounded-lg text-sm w-full"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="border p-2 rounded-lg text-sm w-full"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="border p-2 rounded-lg text-sm w-full"
                            required
                        />
                        <select
                            value={form.role}
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                            className="border p-2 rounded-lg text-sm w-full"
                        >
                            <option value="cashier">Cashier / Staff</option>
                            <option value="admin">Admin</option>
                        </select>
                        <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                            >
                                Create Account
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Users List Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-400 font-semibold text-xs uppercase">
                            <tr>
                                <th className="p-3">User Details</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Registered Date</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-6 text-slate-400">
                                        No users registered yet.
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50/50">
                                        <td className="p-3">
                                            <div className="font-semibold text-slate-800">{u.name}</div>
                                            <div className="text-xs text-slate-400">{u.email}</div>
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                                                    u.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-700'
                                                        : u.role === 'cashier'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-slate-100 text-slate-700'
                                                }`}
                                            >
                                                {u.role || 'customer'}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`text-xs px-2 py-1 rounded font-semibold flex items-center gap-1 w-fit ${
                                                    u.status === 'blocked'
                                                        ? 'bg-red-100 text-red-600'
                                                        : 'bg-emerald-100 text-emerald-700'
                                                }`}
                                            >
                                                {u.status === 'blocked' ? <Ban size={12} /> : <CheckCircle size={12} />}
                                                {u.status || 'active'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-xs text-slate-400">
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-3 text-right space-x-2">
                                            <button
                                                onClick={() => handleToggleStatus(u.id)}
                                                className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
                                                title={u.status === 'blocked' ? 'Activate User' : 'Block User'}
                                            >
                                                {u.status === 'blocked' ? <CheckCircle size={16} className="text-emerald-600" /> : <Ban size={16} className="text-amber-600" />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                className="p-1.5 hover:bg-red-50 rounded text-red-500"
                                                title="Delete User"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}