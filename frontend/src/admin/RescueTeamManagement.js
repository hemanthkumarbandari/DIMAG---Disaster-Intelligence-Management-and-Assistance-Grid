import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import {
  Plus,
  Phone,
  ShieldCheck,
  CheckCircle,
  X,
  MapPin,
  Wrench
} from 'lucide-react';

function RescueTeamManagement() {
  const {
    rescueTeams,
    incidents,
    addRescueTeam,
    updateRescueTeamStatus,
    assignTeamToIncident
  } = useAdminData();

  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [assignModalTeam, setAssignModalTeam] = useState(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState('');

  // Form state for new team
  const [formData, setFormData] = useState({
    name: '',
    leader: '',
    phone: '',
    specialization: 'Flood & Inflatable Boat Evacuation',
    baseLocation: '',
    membersCount: 8,
    equipment: ''
  });

  const filteredTeams = rescueTeams.filter(team => {
    return statusFilter === 'All' || team.status === statusFilter;
  });

  const availableCount = rescueTeams.filter(t => t.status === 'Available').length;
  const deployedCount = rescueTeams.filter(t => t.status === 'Deployed').length;
  const restCount = rescueTeams.filter(t => t.status === 'Rest').length;

  const handleCreateTeam = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.leader || !formData.phone) return;

    addRescueTeam({
      ...formData,
      membersCount: Number(formData.membersCount) || 6,
      equipment: formData.equipment ? formData.equipment.split(',').map(s => s.trim()) : ['Standard First Aid', 'Radio Sets']
    });

    setShowAddModal(false);
    setFormData({
      name: '',
      leader: '',
      phone: '',
      specialization: 'Flood & Inflatable Boat Evacuation',
      baseLocation: '',
      membersCount: 8,
      equipment: ''
    });
  };

  const handleAssignIncident = (e) => {
    e.preventDefault();
    if (!selectedIncidentId || !assignModalTeam) return;
    assignTeamToIncident(selectedIncidentId, assignModalTeam.id);
    setAssignModalTeam(null);
    setSelectedIncidentId('');
  };

  return (
    <div>
      <div className="view-header">
        <div>
          <h1 className="view-title">Rescue Units & Response Teams</h1>
          <p className="view-subtitle">Register elite tactical squads, monitor real-time readiness, and allocate deployment assignments</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Register Rescue Unit
        </button>
      </div>

      {/* KPI Stats */}
      <div className="kpi-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="kpi-card kpi-safe solid-border solid-shadow" style={{ padding: '1rem 1.25rem' }}>
          <span className="kpi-title">Available for Dispatch</span>
          <div className="kpi-value" style={{ fontSize: '2rem', color: 'var(--color-safe)' }}>
            {availableCount}
          </div>
          <div className="kpi-subtext">Ready for immediate response</div>
        </div>

        <div className="kpi-card kpi-info solid-border solid-shadow" style={{ padding: '1rem 1.25rem' }}>
          <span className="kpi-title">Currently Deployed</span>
          <div className="kpi-value" style={{ fontSize: '2rem', color: '#6366f1' }}>
            {deployedCount}
          </div>
          <div className="kpi-subtext">Active on-ground missions</div>
        </div>

        <div className="kpi-card solid-border solid-shadow" style={{ padding: '1rem 1.25rem' }}>
          <span className="kpi-title">Off-Duty / Standby</span>
          <div className="kpi-value" style={{ fontSize: '2rem' }}>
            {restCount}
          </div>
          <div className="kpi-subtext">Crew rotation & rest</div>
        </div>

        <div className="kpi-card solid-border solid-shadow" style={{ padding: '1rem 1.25rem' }}>
          <span className="kpi-title">Total Registered Crew</span>
          <div className="kpi-value" style={{ fontSize: '2rem' }}>
            {rescueTeams.reduce((acc, t) => acc + (t.membersCount || 0), 0)}
          </div>
          <div className="kpi-subtext">Specialized personnel</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-bar solid-border solid-shadow">
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>Filter Readiness:</span>
          {['All', 'Available', 'Deployed', 'Rest'].map(st => (
            <button
              key={st}
              className={`btn-sm ${statusFilter === st ? 'btn-sm-primary' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st} {st !== 'All' && `(${rescueTeams.filter(t => t.status === st).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Teams Grid Cards */}
      <div className="grid-2">
        {filteredTeams.map(team => (
          <div
            key={team.id}
            className="solid-border solid-shadow"
            style={{
              backgroundColor: 'var(--color-white)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.25rem' }}>{team.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', fontFamily: 'monospace' }}>
                    ID: {team.id}
                  </div>
                </div>
                <select
                  className={`badge badge-${team.status.toLowerCase()}`}
                  style={{ cursor: 'pointer', outline: 'none' }}
                  value={team.status}
                  onChange={(e) => updateRescueTeamStatus(team.id, e.target.value)}
                >
                  <option value="Available">Available</option>
                  <option value="Deployed">Deployed</option>
                  <option value="Rest">Rest / Off Duty</option>
                </select>
              </div>

              <div style={{ margin: '0.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={16} color="var(--color-help)" />
                  <strong>Leader:</strong> {team.leader}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={16} color="var(--color-safe)" />
                  <strong>Hotline:</strong> {team.phone}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} color="var(--color-sos)" />
                  <strong>Station:</strong> {team.baseLocation} ({team.membersCount} Crew)
                </div>
              </div>

              <div className="solid-border" style={{ padding: '0.75rem', backgroundColor: 'var(--color-bg)', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-light)' }}>
                  Active Mission / Assignment:
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>
                  {team.currentAssignment || 'Standby for deployment'}
                </div>
              </div>

              {team.equipment && team.equipment.length > 0 && (
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Wrench size={14} color="var(--color-text-light)" />
                  {team.equipment.map((eq, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: '#f1f5f9',
                        border: '1px solid #000',
                        padding: '0.15rem 0.4rem'
                      }}
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', borderTop: '2px dashed var(--color-black)', paddingTop: '0.75rem' }}>
              <button
                className="btn-sm btn-sm-primary"
                style={{ flex: 1 }}
                onClick={() => {
                  setAssignModalTeam(team);
                  setSelectedIncidentId('');
                }}
              >
                Assign to Incident
              </button>
              {team.status === 'Deployed' && (
                <button
                  className="btn-sm btn-sm-success"
                  onClick={() => updateRescueTeamStatus(team.id, 'Available')}
                >
                  <CheckCircle size={14} /> Free Unit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Register Team Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Register New Tactical Rescue Unit</h2>
              <button
                className="btn-back solid-shadow"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowAddModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTeam}>
              <div className="form-group">
                <label>Unit / Squad Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Rapid Disaster Response Battalion 3"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Commanding Officer / Leader *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Major R. K. Singhania"
                    value={formData.leader}
                    onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Emergency Phone *</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+91 98000 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Core Specialization</label>
                <select
                  className="form-control"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                >
                  <option>Flood & Inflatable Boat Evacuation</option>
                  <option>Emergency Medical Triage & Evac</option>
                  <option>Hazardous Chemical & Structural Fire</option>
                  <option>Collapse & Debris Search Operations</option>
                  <option>Landslide & High Altitude Ropes</option>
                  <option>Urban Water Transport & Rations</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Station / Base Location</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Western Sector Fire Depot"
                    value={formData.baseLocation}
                    onChange={(e) => setFormData({ ...formData, baseLocation: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Crew Size</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={formData.membersCount}
                    onChange={(e) => setFormData({ ...formData, membersCount: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Key Equipment (comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Life Rafts, Oxygen Tanks, Defibrillator, Winch Jeep"
                  value={formData.equipment}
                  onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Save & Register Unit
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

      {/* Assign to Incident Modal */}
      {assignModalTeam && (
        <div className="modal-overlay" onClick={() => setAssignModalTeam(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                Deploy {assignModalTeam.name}
              </h2>
              <button
                className="btn-back solid-shadow"
                style={{ cursor: 'pointer' }}
                onClick={() => setAssignModalTeam(null)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAssignIncident}>
              <div style={{ marginBottom: '1.25rem' }}>
                <p style={{ fontWeight: 800, margin: '0 0 0.25rem 0' }}>
                  Leader: {assignModalTeam.leader} ({assignModalTeam.membersCount} Crew)
                </p>
                <p style={{ color: 'var(--color-text-light)', margin: 0 }}>
                  Specialization: {assignModalTeam.specialization}
                </p>
              </div>

              <div className="form-group">
                <label>Select Target Incident for Deployment</label>
                <select
                  className="form-control"
                  value={selectedIncidentId}
                  onChange={(e) => setSelectedIncidentId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Incident to Assign --</option>
                  {incidents.filter(i => i.status !== 'Resolved' && i.status !== 'Rejected').map(inc => (
                    <option key={inc.id} value={inc.id}>
                      [{inc.id}] {inc.title} - {inc.location} ({inc.severity})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={!selectedIncidentId}
                >
                  Deploy to Mission
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setAssignModalTeam(null)}
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

export default RescueTeamManagement;
