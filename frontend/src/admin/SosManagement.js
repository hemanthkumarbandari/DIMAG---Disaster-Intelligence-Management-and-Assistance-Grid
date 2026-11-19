import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import {
  Radio,
  MapPin,
  Phone,
  Users,
  AlertTriangle,
  HeartPulse,
  CheckCircle2,
  Navigation,
  X,
  Filter,
  Plus
} from 'lucide-react';

function SosManagement() {
  const {
    sosRequests,
    rescueTeams,
    assignTeamToSos,
    updateSosStatus,
    addCitizenSos
  } = useAdminData();

  const [urgencyFilter, setUrgencyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dispatchModalSos, setDispatchModalSos] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState('');

  const filteredSos = sosRequests.filter(s => {
    const matchesUrgency = urgencyFilter === 'All' || s.urgency === urgencyFilter;
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesUrgency && matchesStatus;
  });

  const pendingCount = sosRequests.filter(s => s.status === 'Pending').length;
  const criticalCount = sosRequests.filter(s => s.urgency === 'Critical' && s.status !== 'Rescued').length;
  const medicalCount = sosRequests.filter(s => s.medicalHelpNeeded && s.status !== 'Rescued').length;

  const handleDispatch = (e) => {
    e.preventDefault();
    if (!selectedTeamId || !dispatchModalSos) return;
    assignTeamToSos(dispatchModalSos.id, selectedTeamId);
    setDispatchModalSos(null);
    setSelectedTeamId('');
  };

  return (
    <div>
      <div className="view-header">
        <div>
          <h1 className="view-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Radio size={32} color="var(--color-sos)" className="animate-pulse" />
            SOS Distress Operations Board
          </h1>
          <p className="view-subtitle">Live real-time monitoring of citizen emergency signals, GPS coordinates & life-saving dispatch</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-sm btn-sm-danger"
            onClick={() => addCitizenSos("Sector 9 Riverbank Lowland")}
          >
            <Plus size={16} /> Simulate New SOS
          </button>
        </div>
      </div>

      {/* Emergency Counter Pills */}
      <div className="kpi-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="kpi-card kpi-sos solid-border solid-shadow" style={{ padding: '1rem 1.25rem' }}>
          <span className="kpi-title">Awaiting Response</span>
          <div className="kpi-value" style={{ fontSize: '2rem', color: 'var(--color-sos)' }}>
            {pendingCount}
          </div>
          <div className="kpi-subtext">Immediate rescue dispatch needed</div>
        </div>

        <div className="kpi-card kpi-alert solid-border solid-shadow" style={{ padding: '1rem 1.25rem' }}>
          <span className="kpi-title">Critical Urgency</span>
          <div className="kpi-value" style={{ fontSize: '2rem' }}>
            {criticalCount}
          </div>
          <div className="kpi-subtext">Life-threatening conditions</div>
        </div>

        <div className="kpi-card kpi-info solid-border solid-shadow" style={{ padding: '1rem 1.25rem' }}>
          <span className="kpi-title">Medical Triage Alerts</span>
          <div className="kpi-value" style={{ fontSize: '2rem' }}>
            {medicalCount}
          </div>
          <div className="kpi-subtext">Trauma / Paramedic requested</div>
        </div>

        <div className="kpi-card kpi-safe solid-border solid-shadow" style={{ padding: '1rem 1.25rem' }}>
          <span className="kpi-title">Rescued Today</span>
          <div className="kpi-value" style={{ fontSize: '2rem', color: 'var(--color-safe)' }}>
            {sosRequests.filter(s => s.status === 'Rescued').length}
          </div>
          <div className="kpi-subtext">Citizens safely evacuated</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-bar solid-border solid-shadow">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginRight: '0.5rem' }}>
            <Filter size={14} style={{ display: 'inline', marginRight: '4px' }} /> Status:
          </span>
          {['All', 'Pending', 'Dispatched', 'On Scene', 'Rescued'].map(st => (
            <button
              key={st}
              className={`btn-sm ${statusFilter === st ? 'btn-sm-primary' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st} {st !== 'All' && `(${sosRequests.filter(s => s.status === st).length})`}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
          <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>Urgency:</span>
          <select
            className="filter-select"
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
          >
            <option value="All">All Urgencies</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
          </select>
        </div>
      </div>

      {/* SOS Distress Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredSos.length === 0 ? (
          <div className="admin-card solid-border solid-shadow empty-state">
            <CheckCircle2 size={48} color="var(--color-safe)" style={{ margin: '0 auto 1rem auto' }} />
            <p style={{ fontSize: '1.2rem', fontWeight: 800 }}>No SOS Calls in this category</p>
            <p>All citizen distress requests are currently managed.</p>
          </div>
        ) : (
          filteredSos.map(sos => {
            const assignedTeam = rescueTeams.find(t => t.id === sos.assignedTeamId);

            return (
              <div
                key={sos.id}
                className={`solid-border solid-shadow ${sos.urgency === 'Critical' && sos.status !== 'Rescued' ? 'kpi-sos' : ''}`}
                style={{
                  backgroundColor: 'var(--color-white)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderLeftWidth: '8px'
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        padding: '0.5rem',
                        border: '2px solid var(--color-black)',
                        backgroundColor: sos.urgency === 'Critical' ? '#ffe5e9' : 'var(--color-bg)'
                      }}
                    >
                      <Radio size={24} color={sos.urgency === 'Critical' ? 'var(--color-sos)' : 'var(--color-text)'} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 900, fontSize: '1.2rem' }}>{sos.citizenName}</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem' }}>({sos.id})</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--color-text-light)', marginTop: '0.2rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Phone size={13} /> {sos.phone}
                        </span>
                        <span>•</span>
                        <span>{sos.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge badge-${sos.urgency.toLowerCase()}`}>
                      {sos.urgency} Urgency
                    </span>
                    <span className={`badge badge-${sos.status.toLowerCase().replace(' ', '')}`}>
                      {sos.status}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="grid-2" style={{ margin: 0, gap: '1rem' }}>
                  {/* Location & GPS */}
                  <div className="solid-border" style={{ padding: '0.85rem', backgroundColor: 'var(--color-bg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                      <MapPin size={16} color="var(--color-sos)" /> {sos.location}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
                      <Navigation size={13} /> GPS: {sos.latitude}, {sos.longitude}
                    </div>
                  </div>

                  {/* People & Medical Status */}
                  <div className="solid-border" style={{ padding: '0.85rem', backgroundColor: 'var(--color-bg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800 }}>
                        <Users size={16} /> {sos.peopleCount} People Stranded
                      </span>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        {sos.injured && (
                          <span className="badge badge-critical" style={{ fontSize: '0.7rem' }}>
                            <AlertTriangle size={12} /> Injured
                          </span>
                        )}
                        {sos.medicalHelpNeeded && (
                          <span className="badge badge-high" style={{ fontSize: '0.7rem' }}>
                            <HeartPulse size={12} /> Medical Req.
                          </span>
                        )}
                      </div>
                    </div>
                    <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: 'var(--color-text)' }}>
                      <strong>Notes:</strong> {sos.notes}
                    </p>
                  </div>
                </div>

                {/* Rescue Team Assignment & Triage Stepper */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '2px dashed var(--color-black)',
                    paddingTop: '0.85rem',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>Assigned Unit:</span>
                    {assignedTeam ? (
                      <span style={{ fontWeight: 800, color: 'var(--color-safe)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <CheckCircle2 size={16} /> {assignedTeam.name} ({assignedTeam.leader})
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-sos)', fontWeight: 800 }}>
                        No Unit Dispatched Yet!
                      </span>
                    )}
                  </div>

                  {/* Quick Action Progression */}
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {sos.status === 'Pending' && (
                      <button
                        className="btn-sm btn-sm-danger"
                        onClick={() => {
                          setDispatchModalSos(sos);
                          setSelectedTeamId('');
                        }}
                      >
                        Dispatch Rescue Unit
                      </button>
                    )}

                    {sos.status === 'Dispatched' && (
                      <>
                        <button
                          className="btn-sm btn-sm-warning"
                          onClick={() => updateSosStatus(sos.id, 'On Scene')}
                        >
                          Confirm On Scene
                        </button>
                        <button
                          className="btn-sm"
                          onClick={() => {
                            setDispatchModalSos(sos);
                            setSelectedTeamId(assignedTeam ? assignedTeam.id : '');
                          }}
                        >
                          Reassign
                        </button>
                      </>
                    )}

                    {sos.status === 'On Scene' && (
                      <button
                        className="btn-sm btn-sm-success"
                        onClick={() => updateSosStatus(sos.id, 'Rescued')}
                      >
                        <CheckCircle2 size={14} /> Complete Rescue
                      </button>
                    )}

                    {sos.status === 'Rescued' && (
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-safe)' }}>
                        ✓ Citizens Safely Evacuated
                      </span>
                    )}

                    {sos.status !== 'Cancelled' && sos.status !== 'Rescued' && (
                      <button
                        className="btn-sm"
                        style={{ color: '#666' }}
                        onClick={() => updateSosStatus(sos.id, 'Cancelled')}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Dispatch Modal */}
      {dispatchModalSos && (
        <div className="modal-overlay" onClick={() => setDispatchModalSos(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                Dispatch Rescue Squad to {dispatchModalSos.id}
              </h2>
              <button
                className="btn-back solid-shadow"
                style={{ cursor: 'pointer' }}
                onClick={() => setDispatchModalSos(null)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleDispatch}>
              <div style={{ marginBottom: '1.25rem' }}>
                <p style={{ fontWeight: 800, margin: '0 0 0.25rem 0' }}>
                  Distress Signal: {dispatchModalSos.citizenName} ({dispatchModalSos.peopleCount} Stranded)
                </p>
                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                  Location: {dispatchModalSos.location}
                </p>
                <div style={{ padding: '0.75rem', backgroundColor: '#fff3cd', border: '2px solid #000', fontWeight: 700, fontSize: '0.85rem' }}>
                  Urgency: {dispatchModalSos.urgency} | {dispatchModalSos.notes}
                </div>
              </div>

              <div className="form-group">
                <label>Select Rescue Unit for Rapid Deployment</label>
                <select
                  className="form-control"
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Unit to Deploy --</option>
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
                  className="btn btn-sos"
                  style={{ flex: 1 }}
                  disabled={!selectedTeamId}
                >
                  Confirm Emergency Dispatch
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setDispatchModalSos(null)}
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

export default SosManagement;
