import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import {
  Search,
  Filter,
  Plus,
  UserCheck,
  UserX,
  X,
  Mail,
  Phone
} from 'lucide-react';

function UserManagement() {
  const {
    users,
    updateUserStatus,
    updateUserRole,
    addUser
  } = useAdminData();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Citizen',
    city: '',
    phone: ''
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    addUser(formData);
    setShowAddModal(false);
    setFormData({
      name: '',
      email: '',
      role: 'Citizen',
      city: '',
      phone: ''
    });
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Admin': return 'badge-critical';
      case 'Rescue Team': return 'badge-deployed';
      case 'NGO': return 'badge-verified';
      default: return 'badge-low';
    }
  };

  return (
    <div>
      <div className="view-header">
        <div>
          <h1 className="view-title">System User Directory & Roles</h1>
          <p className="view-subtitle">Manage administrative privileges, emergency responder credentials & citizen accounts</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Provision New Account
        </button>
      </div>

      {/* KPI Stats */}
      <div className="kpi-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="kpi-card solid-border solid-shadow" style={{ padding: '1rem 1.25rem' }}>
          <span className="kpi-title">Total Accounts</span>
          <div className="kpi-value" style={{ fontSize: '2rem' }}>{users.length}</div>
          <div className="kpi-subtext">{users.filter(u => u.status === 'Active').length} Active Credentials</div>
        </div>

        <div className="kpi-card kpi-sos solid-border solid-shadow" style={{ padding: '1rem 1.25rem' }}>
          <span className="kpi-title">Command Admins</span>
          <div className="kpi-value" style={{ fontSize: '2rem', color: 'var(--color-sos)' }}>
            {users.filter(u => u.role === 'Admin').length}
          </div>
          <div className="kpi-subtext">Full system access</div>
        </div>

        <div className="kpi-card kpi-info solid-border solid-shadow" style={{ padding: '1rem 1.25rem' }}>
          <span className="kpi-title">Rescue Personnel</span>
          <div className="kpi-value" style={{ fontSize: '2rem', color: '#6366f1' }}>
            {users.filter(u => u.role === 'Rescue Team').length}
          </div>
          <div className="kpi-subtext">First responders verified</div>
        </div>

        <div className="kpi-card kpi-safe solid-border solid-shadow" style={{ padding: '1rem 1.25rem' }}>
          <span className="kpi-title">NGO & Citizens</span>
          <div className="kpi-value" style={{ fontSize: '2rem', color: 'var(--color-safe)' }}>
            {users.filter(u => u.role === 'NGO' || u.role === 'Citizen').length}
          </div>
          <div className="kpi-subtext">Public & community members</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar solid-border solid-shadow">
        <div className="search-input-wrap">
          <Search size={18} color="var(--color-text-light)" />
          <input
            type="text"
            placeholder="Search by name, email, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Filter size={16} />
            <select
              className="filter-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Rescue Team">Rescue Team</option>
              <option value="NGO">NGO</option>
              <option value="Citizen">Citizen</option>
            </select>
          </div>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>

          {(searchTerm || roleFilter !== 'All' || statusFilter !== 'All') && (
            <button
              className="btn-sm"
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('All');
                setStatusFilter('All');
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-card solid-border solid-shadow">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User Details</th>
                <th>Role Assignment</th>
                <th>Location / Station</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 800, fontFamily: 'monospace' }}>{user.id}</td>
                  <td>
                    <div style={{ fontWeight: 800 }}>{user.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Mail size={12} /> {user.email}
                    </div>
                    {user.phone && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Phone size={11} /> {user.phone}
                      </div>
                    )}
                  </td>
                  <td>
                    <select
                      className={`badge ${getRoleBadgeClass(user.role)}`}
                      style={{ cursor: 'pointer', outline: 'none' }}
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                    >
                      <option value="Citizen">Citizen</option>
                      <option value="Rescue Team">Rescue Team</option>
                      <option value="NGO">NGO</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{user.city}</span>
                  </td>
                  <td>
                    <span className={`badge ${user.status === 'Active' ? 'badge-verified' : 'badge-critical'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    {user.registeredDate}
                  </td>
                  <td>
                    {user.status === 'Active' ? (
                      <button
                        className="btn-sm btn-sm-danger"
                        title="Suspend Account"
                        onClick={() => updateUserStatus(user.id, 'Suspended')}
                      >
                        <UserX size={13} /> Suspend
                      </button>
                    ) : (
                      <button
                        className="btn-sm btn-sm-success"
                        title="Activate Account"
                        onClick={() => updateUserStatus(user.id, 'Active')}
                      >
                        <UserCheck size={13} /> Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision User Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Provision New System Account</h2>
              <button
                className="btn-back solid-shadow"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowAddModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Inspector Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="user@dimag.gov.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Contact Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+91 98000 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>System Role *</label>
                  <select
                    className="form-control"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="Citizen">Citizen</option>
                    <option value="Rescue Team">Rescue Team</option>
                    <option value="NGO">NGO Coordinator</option>
                    <option value="Admin">Command Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Assigned City / Command Zone</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Central Command, Sector 4"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Create Account
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
