import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import {
  AlertOctagon,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Users,
  Eye,
  X,
  Droplets,
  Flame,
  Activity,
  Wind
} from 'lucide-react';

function IncidentManagement() {
  const {
    incidents,
    rescueTeams,
    verifyIncident,
    rejectIncident,
    updateIncidentStatus,
    updateIncidentSeverity,
    assignTeamToIncident
  } = useAdminData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modals state
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [assigningIncident, setAssigningIncident] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState('');

  // Filter logic
  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.reportedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || inc.type === filterType;
    const matchesSeverity = filterSeverity === 'All' || inc.severity === filterSeverity;
    const matchesStatus = filterStatus === 'All' || inc.status === filterStatus;
    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Flood': return <Droplets size={16} color="var(--color-safe)" />;
      case 'Fire': return <Flame size={16} color="var(--color-sos)" />;
      case 'Landslide':
      case 'Earthquake': return <Activity size={16} color="var(--color-report)" />;
      default: return <Wind size={16} color="var(--color-help)" />;
    }
  };

  const handleAssignTeam = (e) => {
    e.preventDefault();
    if (!selectedTeamId || !assigningIncident) return;
    assignTeamToIncident(assigningIncident.id, selectedTeamId);
    setAssigningIncident(null);
    setSelectedTeamId('');
  };

  return (
    <div>
      <div className="view-header">
        <div>
          <h1 className="view-title">Incident Management</h1>
          <p className="view-subtitle">Review, verify, assign response teams, and triage citizen-reported disasters</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="badge badge-verified">{incidents.filter(i => i.status === 'Verified').length} Verified</span>
          <span className="badge badge-underreview">{incidents.filter(i => i.status === 'Under Review').length} Under Review</span>
          <span className="badge badge-critical">{incidents.filter(i => i.severity === 'Critical').length} Critical</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar solid-border solid-shadow">
        <div className="search-input-wrap">
          <Search size={18} color="var(--color-text-light)" />
          <input
            type="text"
            placeholder="Search by title, location, or reporter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Filter size={16} />
            <select
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Flood">Flood</option>
              <option value="Fire">Fire</option>
              <option value="Landslide">Landslide</option>
              <option value="Earthquake">Earthquake</option>
              <option value="Cyclone">Cyclone</option>
            </select>
          </div>

          <select
            className="filter-select"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Under Review">Under Review</option>
            <option value="Verified">Verified</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>

          {(searchTerm || filterType !== 'All' || filterSeverity !== 'All' || filterStatus !== 'All') && (
            <button
              className="btn-sm"
              onClick={() => {
                setSearchTerm('');
                setFilterType('All');
                setFilterSeverity('All');
                setFilterStatus('All');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Incidents Table */}
      <div className="admin-card solid-border solid-shadow">
        {filteredIncidents.length === 0 ? (
          <div className="empty-state">
            <AlertOctagon size={48} style={{ margin: '0 auto 1rem auto', color: 'var(--color-text-light)' }} />
            <p style={{ fontSize: '1.2rem', fontWeight: 800 }}>No Incidents Found</p>
            <p>Try clearing filters or search criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title & Location</th>
                  <th>Type</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Assigned Team</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncidents.map(inc => {
                  const assignedTeam = rescueTeams.find(t => t.id === inc.assignedTeamId);

                  return (
                    <tr key={inc.id}>
                      <td style={{ fontWeight: 800, fontFamily: 'monospace' }}>{inc.id}</td>
                      <td>
                        <div style={{ fontWeight: 800 }}>{inc.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                          {inc.location} • Reported by {inc.reportedBy} ({inc.reportedAt})
                        </div>
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700 }}>
                          {getTypeIcon(inc.type)} {inc.type}
                        </span>
                      </td>
                      <td>
                        <select
                          className={`badge badge-${inc.severity.toLowerCase()}`}
                          style={{ cursor: 'pointer', outline: 'none' }}
                          value={inc.severity}
                          onChange={(e) => updateIncidentSeverity(inc.id, e.target.value)}
                        >
                          <option value="Critical">Critical</option>
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </td>
                      <td>
                        <select
                          className={`badge badge-${inc.status.toLowerCase().replace(' ', '')}`}
                          style={{ cursor: 'pointer', outline: 'none' }}
                          value={inc.status}
                          onChange={(e) => updateIncidentStatus(inc.id, e.target.value)}
                        >
                          <option value="Under Review">Under Review</option>
                          <option value="Verified">Verified</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td>
                        {assignedTeam ? (
                          <div style={{ fontSize: '0.85rem' }}>
                            <div style={{ fontWeight: 800, color: 'var(--color-safe)' }}>{assignedTeam.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{assignedTeam.leader}</div>
                          </div>
                        ) : (
                          <button
                            className="btn-sm"
                            style={{ backgroundColor: '#fff3cd' }}
                            onClick={() => {
                              setAssigningIncident(inc);
                              setSelectedTeamId('');
                            }}
                          >
                            <Users size={12} /> Assign Unit
                          </button>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {inc.status === 'Under Review' && (
                            <>
                              <button
                                className="btn-sm btn-sm-success"
                                title="Verify Incident"
                                onClick={() => verifyIncident(inc.id)}
                              >
                                <CheckCircle size={14} />
                              </button>
                              <button
                                className="btn-sm btn-sm-danger"
                                title="Reject Report"
                                onClick={() => rejectIncident(inc.id)}
                              >
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
                          <button
                            className="btn-sm btn-sm-primary"
                            title="View Full Details"
                            onClick={() => setSelectedIncident(inc)}
                          >
                            <Eye size={14} /> View
                          </button>
                          {assignedTeam && (
                            <button
                              className="btn-sm"
                              title="Reassign Team"
                              onClick={() => {
                                setAssigningIncident(inc);
                                setSelectedTeamId(assignedTeam.id);
                              }}
                            >
                              Reassign
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Incident Details Modal */}
      {selectedIncident && (
        <div className="modal-overlay" onClick={() => setSelectedIncident(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {selectedIncident.id}: {selectedIncident.title}
              </h2>
              <button
                className="btn-back solid-shadow"
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedIncident(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="stat-pill" style={{ flex: 1 }}>
                  <span>Disaster Type:</span>
                  <strong>{selectedIncident.type}</strong>
                </div>
                <div className="stat-pill" style={{ flex: 1 }}>
                  <span>People Affected:</span>
                  <strong>{selectedIncident.peopleAffected}</strong>
                </div>
              </div>

              <div className="solid-border" style={{ padding: '1rem', backgroundColor: 'var(--color-bg)' }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>Incident Description</h4>
                <p style={{ margin: 0, fontSize: '1rem' }}>{selectedIncident.description}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="solid-border" style={{ padding: '0.75rem', backgroundColor: '#fff' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>Reported By</div>
                  <div style={{ fontWeight: 800 }}>{selectedIncident.reportedBy}</div>
                  <div style={{ fontSize: '0.8rem' }}>{selectedIncident.reportedAt}</div>
                </div>

                <div className="solid-border" style={{ padding: '0.75rem', backgroundColor: '#fff' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>Location</div>
                  <div style={{ fontWeight: 800 }}>{selectedIncident.location}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => {
                    const inc = selectedIncident;
                    setSelectedIncident(null);
                    setAssigningIncident(inc);
                  }}
                >
                  <Users size={18} /> Assign / Change Rescue Team
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => setSelectedIncident(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Team Modal */}
      {assigningIncident && (
        <div className="modal-overlay" onClick={() => setAssigningIncident(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                Assign Rescue Team: {assigningIncident.id}
              </h2>
              <button
                className="btn-back solid-shadow"
                style={{ cursor: 'pointer' }}
                onClick={() => setAssigningIncident(null)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAssignTeam}>
              <div style={{ marginBottom: '1.25rem' }}>
                <p style={{ fontWeight: 700, margin: '0 0 0.5rem 0' }}>Incident: {assigningIncident.title}</p>
                <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', margin: 0 }}>
                  Location: {assigningIncident.location} ({assigningIncident.severity} Severity)
                </p>
              </div>

              <div className="form-group">
                <label>Select Rescue Unit</label>
                <select
                  className="form-control"
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  required
                >
                  <option value="">-- Choose a Rescue Unit --</option>
                  {rescueTeams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name} ({team.status}) - {team.specialization} [{team.membersCount} crew]
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={!selectedTeamId}
                >
                  Confirm Deployment
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setAssigningIncident(null)}
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

export default IncidentManagement;
