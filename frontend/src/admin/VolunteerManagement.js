import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import {
  HeartHandshake,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Phone,
  MapPin,
  ClipboardList,
  X,
  Building,
  UserCheck
} from 'lucide-react';

function VolunteerManagement() {
  const {
    volunteers,
    approveVolunteer,
    rejectVolunteer,
    assignVolunteerTask
  } = useAdminData();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal
  const [assigningVol, setAssigningVol] = useState(null);
  const [taskDescription, setTaskDescription] = useState('');

  const filteredVolunteers = volunteers.filter(vol => {
    const matchesSearch = vol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vol.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vol.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || vol.type.includes(typeFilter);
    const matchesStatus = statusFilter === 'All' || vol.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const pendingCount = volunteers.filter(v => v.status === 'Pending Approval').length;
  const approvedCount = volunteers.filter(v => v.status === 'Approved').length;
  const deployedCount = volunteers.filter(v => v.status === 'Deployed').length;

  const handleAssignTask = (e) => {
    e.preventDefault();
    if (!taskDescription || !assigningVol) return;
    assignVolunteerTask(assigningVol.id, taskDescription);
    setAssigningVol(null);
    setTaskDescription('');
  };

  return (
    <div>
      <div className="view-header">
        <div>
          <h1 className="view-title">NGO & Community Volunteer Grid</h1>
          <p className="view-subtitle">Mobilize humanitarian agencies, verify citizen volunteer applications & coordinate relief aid distribution</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className="badge badge-underreview">{pendingCount} Applications Pending</span>
          <span className="badge badge-verified">{approvedCount} Approved Volunteers</span>
          <span className="badge badge-deployed">{deployedCount} Active in Field</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="kpi-card kpi-alert solid-border solid-shadow" style={{ padding: '1rem 1.25rem' }}>
          <span className="kpi-title">Pending Approvals</span>
          <div className="kpi-value" style={{ fontSize: '2rem', color: 'var(--color-report)' }}>
            {pendingCount}
          </div>
          <div className="kpi-subtext">Requires background verification</div>
        </div>

        <div className="kpi-card kpi-safe solid-border solid-shadow" style={{ padding: '1rem 1.25rem' }}>
          <span className="kpi-title">Ready Volunteers</span>
          <div className="kpi-value" style={{ fontSize: '2rem', color: 'var(--color-safe)' }}>
            {approvedCount}
          </div>
          <div className="kpi-subtext">Vetted and ready for tasking</div>
        </div>

        <div className="kpi-card kpi-info solid-border solid-shadow" style={{ padding: '1rem 1.25rem' }}>
          <span className="kpi-title">Deployed on Field</span>
          <div className="kpi-value" style={{ fontSize: '2rem', color: '#6366f1' }}>
            {deployedCount}
          </div>
          <div className="kpi-subtext">Currently assigned to tasks</div>
        </div>

        <div className="kpi-card solid-border solid-shadow" style={{ padding: '1rem 1.25rem' }}>
          <span className="kpi-title">Total Registered NGOs</span>
          <div className="kpi-value" style={{ fontSize: '2rem' }}>
            {volunteers.length}
          </div>
          <div className="kpi-subtext">Community partners active</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar solid-border solid-shadow">
        <div className="search-input-wrap">
          <Search size={18} color="var(--color-text-light)" />
          <input
            type="text"
            placeholder="Search by name, organization, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Filter size={16} />
            <select
              className="filter-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All Aid Categories</option>
              <option value="Medical">Medical Assistance</option>
              <option value="Food">Food & Water</option>
              <option value="Shelter">Temporary Shelter</option>
              <option value="Transport">Transport / Evacuation</option>
              <option value="Volunteer">General Volunteer</option>
            </select>
          </div>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Approved">Approved</option>
            <option value="Deployed">Deployed</option>
            <option value="Rejected">Rejected</option>
          </select>

          {(searchTerm || typeFilter !== 'All' || statusFilter !== 'All') && (
            <button
              className="btn-sm"
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('All');
                setStatusFilter('All');
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Volunteers Table */}
      <div className="admin-card solid-border solid-shadow">
        {filteredVolunteers.length === 0 ? (
          <div className="empty-state">
            <HeartHandshake size={48} style={{ margin: '0 auto 1rem auto', color: 'var(--color-text-light)' }} />
            <p style={{ fontSize: '1.2rem', fontWeight: 800 }}>No Volunteers Found</p>
            <p>Try modifying your filter options.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name & Organization</th>
                  <th>Aid Specialization</th>
                  <th>Location & Contact</th>
                  <th>Current Mission / Task</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVolunteers.map(vol => (
                  <tr key={vol.id}>
                    <td>
                      <div style={{ fontWeight: 800 }}>{vol.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Building size={12} /> {vol.organization}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info" style={{ backgroundColor: '#e2f8f0', color: '#000' }}>
                        {vol.type}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <MapPin size={12} color="var(--color-sos)" /> {vol.location}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-text-light)' }}>
                          <Phone size={12} /> {vol.contact}
                        </div>
                      </div>
                    </td>
                    <td style={{ maxWidth: '240px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        {vol.assignedTask || '— None Assigned —'}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        vol.status === 'Approved' ? 'badge-verified' :
                        vol.status === 'Deployed' ? 'badge-deployed' :
                        vol.status === 'Pending Approval' ? 'badge-underreview' : 'badge-rejected'
                      }`}>
                        {vol.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {vol.status === 'Pending Approval' && (
                          <>
                            <button
                              className="btn-sm btn-sm-success"
                              title="Approve Volunteer"
                              onClick={() => approveVolunteer(vol.id)}
                            >
                              <CheckCircle size={14} /> Approve
                            </button>
                            <button
                              className="btn-sm btn-sm-danger"
                              title="Reject Application"
                              onClick={() => rejectVolunteer(vol.id)}
                            >
                              <XCircle size={14} />
                            </button>
                          </>
                        )}
                        {(vol.status === 'Approved' || vol.status === 'Deployed') && (
                          <button
                            className="btn-sm btn-sm-primary"
                            onClick={() => {
                              setAssigningVol(vol);
                              setTaskDescription(vol.assignedTask || '');
                            }}
                          >
                            <ClipboardList size={13} /> {vol.status === 'Deployed' ? 'Reassign' : 'Assign Task'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Task Assignment Modal */}
      {assigningVol && (
        <div className="modal-overlay" onClick={() => setAssigningVol(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                Assign Field Mission: {assigningVol.name}
              </h2>
              <button
                className="btn-back solid-shadow"
                style={{ cursor: 'pointer' }}
                onClick={() => setAssigningVol(null)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAssignTask}>
              <div style={{ marginBottom: '1.25rem' }}>
                <p style={{ fontWeight: 800, margin: '0 0 0.25rem 0' }}>
                  Volunteer / Org: {assigningVol.name} ({assigningVol.organization})
                </p>
                <p style={{ color: 'var(--color-text-light)', margin: 0, fontSize: '0.9rem' }}>
                  Capability: {assigningVol.type} • Contact: {assigningVol.contact}
                </p>
              </div>

              <div className="form-group">
                <label>Operational Task & Field Location *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="e.g. Assist medical staff at City Central Stadium shelter triage wing from 1 PM to 7 PM."
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={!taskDescription}
                >
                  <UserCheck size={18} /> Confirm Deployment
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setAssigningVol(null)}
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

export default VolunteerManagement;
