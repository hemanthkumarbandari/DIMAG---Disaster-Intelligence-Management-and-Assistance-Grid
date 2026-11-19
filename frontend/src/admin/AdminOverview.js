import React from 'react';
import { useAdminData } from '../context/AdminDataContext';
import {
  AlertOctagon,
  Radio,
  ShieldAlert,
  Users,
  Home,
  Clock,
  ArrowRight,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Droplets,
  Wind,
  Activity
} from 'lucide-react';

function AdminOverview({ onNavigate }) {
  const {
    incidents,
    sosRequests,
    rescueTeams,
    shelters,
    volunteers,
    updateSosStatus,
    verifyIncident
  } = useAdminData();

  // Metrics calculations
  const totalIncidents = incidents.length;
  const criticalIncidents = incidents.filter(i => i.severity === 'Critical' && i.status !== 'Resolved').length;
  const activeSos = sosRequests.filter(s => s.status !== 'Rescued' && s.status !== 'Cancelled');
  const criticalSos = activeSos.filter(s => s.urgency === 'Critical').length;
  const availableTeams = rescueTeams.filter(t => t.status === 'Available').length;
  const openShelters = shelters.filter(s => s.status === 'Open' || s.status === 'Near Capacity').length;
  const totalShelterCapacity = shelters.reduce((acc, s) => acc + s.capacity, 0);
  const totalOccupancy = shelters.reduce((acc, s) => acc + s.currentOccupancy, 0);
  const pendingVolunteers = volunteers.filter(v => v.status === 'Pending Approval').length;
  const pendingRequestsTotal = activeSos.filter(s => s.status === 'Pending').length +
    incidents.filter(i => i.status === 'Under Review').length +
    pendingVolunteers;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Flood': return <Droplets size={16} color="var(--color-safe)" />;
      case 'Fire': return <Flame size={16} color="var(--color-sos)" />;
      case 'Landslide':
      case 'Earthquake': return <Activity size={16} color="var(--color-report)" />;
      default: return <Wind size={16} color="var(--color-help)" />;
    }
  };

  return (
    <div>
      {/* Page Title */}
      <div className="view-header">
        <div>
          <h1 className="view-title">Emergency Command Center</h1>
          <p className="view-subtitle">Real-time disaster coordination, emergency dispatch & relief grid</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-sm" onClick={() => onNavigate('incidents')}>
            + Manage Incidents
          </button>
          <button className="btn btn-sm btn-sm-danger" onClick={() => onNavigate('sos')}>
            <Radio size={16} /> Live SOS Board
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="kpi-grid">
        {/* Active SOS Alerts */}
        <div className="kpi-card kpi-sos solid-border solid-shadow">
          <div className="kpi-card-header">
            <span className="kpi-title">Active SOS Calls</span>
            <div className="kpi-icon-wrap" style={{ backgroundColor: '#ffe5e9' }}>
              <Radio size={22} color="var(--color-sos)" className="animate-pulse" />
            </div>
          </div>
          <div className="kpi-value" style={{ color: 'var(--color-sos)' }}>
            {activeSos.length}
          </div>
          <div className="kpi-subtext">
            <strong>{criticalSos} Critical</strong> awaiting dispatch
          </div>
        </div>

        {/* Critical Incidents */}
        <div className="kpi-card kpi-alert solid-border solid-shadow">
          <div className="kpi-card-header">
            <span className="kpi-title">Active Disasters</span>
            <div className="kpi-icon-wrap" style={{ backgroundColor: '#fff4e6' }}>
              <AlertOctagon size={22} color="var(--color-report)" />
            </div>
          </div>
          <div className="kpi-value">{totalIncidents}</div>
          <div className="kpi-subtext">
            <strong>{criticalIncidents} Critical Severity</strong>
          </div>
        </div>

        {/* Rescue Teams Available */}
        <div className="kpi-card kpi-safe solid-border solid-shadow">
          <div className="kpi-card-header">
            <span className="kpi-title">Rescue Units</span>
            <div className="kpi-icon-wrap" style={{ backgroundColor: '#e2f8f0' }}>
              <ShieldAlert size={22} color="var(--color-safe)" />
            </div>
          </div>
          <div className="kpi-value" style={{ color: 'var(--color-safe)' }}>
            {availableTeams} / {rescueTeams.length}
          </div>
          <div className="kpi-subtext">
            {rescueTeams.length - availableTeams} Units currently deployed
          </div>
        </div>

        {/* Shelter Occupancy */}
        <div className="kpi-card kpi-info solid-border solid-shadow">
          <div className="kpi-card-header">
            <span className="kpi-title">Safe Shelters</span>
            <div className="kpi-icon-wrap" style={{ backgroundColor: '#e8f0fe' }}>
              <Home size={22} color="var(--color-help)" />
            </div>
          </div>
          <div className="kpi-value">{openShelters} Open</div>
          <div className="kpi-subtext">
            {totalOccupancy} / {totalShelterCapacity} evacuees housed ({Math.round((totalOccupancy / totalShelterCapacity) * 100)}%)
          </div>
        </div>

        {/* Pending Action Items */}
        <div className="kpi-card solid-border solid-shadow">
          <div className="kpi-card-header">
            <span className="kpi-title">Pending Review</span>
            <div className="kpi-icon-wrap" style={{ backgroundColor: '#f1f5f9' }}>
              <Clock size={22} />
            </div>
          </div>
          <div className="kpi-value">{pendingRequestsTotal}</div>
          <div className="kpi-subtext">
            Needs verification / approval
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Urgent SOS vs Live Incidents */}
      <div className="grid-2">
        {/* Urgent SOS Alerts */}
        <div className="admin-card solid-border solid-shadow">
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              <Radio size={22} color="var(--color-sos)" /> Urgent SOS Distress Calls
            </h2>
            <button className="btn-sm" onClick={() => onNavigate('sos')}>
              View All ({activeSos.length}) <ArrowRight size={14} />
            </button>
          </div>

          {activeSos.length === 0 ? (
            <div className="empty-state">
              <CheckCircle2 size={36} color="var(--color-safe)" style={{ margin: '0 auto 0.5rem auto' }} />
              <p>No active SOS alerts. All distress calls resolved.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Caller & Location</th>
                    <th>People</th>
                    <th>Urgency</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeSos.slice(0, 4).map(sos => (
                    <tr key={sos.id}>
                      <td>
                        <div style={{ fontWeight: 800 }}>{sos.citizenName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={12} color="var(--color-sos)" /> {sos.location}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 800 }}>{sos.peopleCount}</span>
                        {sos.injured && <span style={{ color: 'var(--color-sos)', fontWeight: 800, marginLeft: '4px' }}>⚠️</span>}
                      </td>
                      <td>
                        <span className={`badge badge-${sos.urgency.toLowerCase()}`}>
                          {sos.urgency}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${sos.status.toLowerCase().replace(' ', '')}`}>
                          {sos.status}
                        </span>
                      </td>
                      <td>
                        {sos.status === 'Pending' ? (
                          <button
                            className="btn-sm btn-sm-danger"
                            onClick={() => onNavigate('sos')}
                          >
                            Dispatch
                          </button>
                        ) : (
                          <button
                            className="btn-sm btn-sm-success"
                            onClick={() => updateSosStatus(sos.id, 'Rescued')}
                          >
                            Mark Rescued
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Reported Incidents */}
        <div className="admin-card solid-border solid-shadow">
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              <AlertTriangle size={22} color="var(--color-report)" /> Recent Disaster Reports
            </h2>
            <button className="btn-sm" onClick={() => onNavigate('incidents')}>
              View All ({incidents.length}) <ArrowRight size={14} />
            </button>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Incident Details</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {incidents.slice(0, 4).map(inc => (
                  <tr key={inc.id}>
                    <td>
                      <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        {getTypeIcon(inc.type)}
                        {inc.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                        {inc.location} • {inc.reportedAt}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${inc.severity.toLowerCase()}`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${inc.status.toLowerCase().replace(' ', '')}`}>
                        {inc.status}
                      </span>
                    </td>
                    <td>
                      {inc.status === 'Under Review' ? (
                        <button
                          className="btn-sm btn-sm-success"
                          onClick={() => verifyIncident(inc.id)}
                        >
                          Verify
                        </button>
                      ) : (
                        <button
                          className="btn-sm"
                          onClick={() => onNavigate('incidents')}
                        >
                          Manage
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Rescue Team Deployment Status & Shelter Quick Bar */}
      <div className="grid-2">
        {/* Rescue Team Quick Status */}
        <div className="admin-card solid-border solid-shadow">
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              <Users size={22} color="var(--color-help)" /> Rescue Teams Readiness
            </h2>
            <button className="btn-sm" onClick={() => onNavigate('rescue_teams')}>
              Manage Units <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {rescueTeams.map(team => (
              <div
                key={team.id}
                className="solid-border"
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--color-white)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{team.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                    {team.specialization} • {team.membersCount} Crew Members
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginTop: '0.2rem' }}>
                    Mission: {team.currentAssignment}
                  </div>
                </div>
                <div>
                  <span className={`badge badge-${team.status.toLowerCase()}`}>
                    {team.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shelter Capacity Snapshot */}
        <div className="admin-card solid-border solid-shadow">
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              <Home size={22} color="var(--color-safe)" /> Shelter Occupancy Gauges
            </h2>
            <button className="btn-sm" onClick={() => onNavigate('shelters')}>
              Manage Shelters <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {shelters.map(shelter => {
              const pct = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
              let barColor = 'var(--color-safe)';
              if (pct > 80) barColor = 'var(--color-report)';
              if (pct >= 100) barColor = 'var(--color-sos)';

              return (
                <div key={shelter.id} className="solid-border" style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--color-white)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <div style={{ fontWeight: 800 }}>{shelter.name}</div>
                    <span className={`badge ${shelter.status === 'Open' ? 'badge-verified' : shelter.status === 'Full' ? 'badge-critical' : 'badge-high'}`}>
                      {shelter.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--color-text-light)', marginBottom: '0.4rem' }}>
                    {shelter.location} • Supplies: <strong>{shelter.suppliesStatus}</strong>
                  </div>

                  <div className="capacity-bar-wrap">
                    <div
                      className="capacity-bar-fill"
                      style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: barColor }}
                    ></div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginTop: '0.25rem' }}>
                    <span>{shelter.currentOccupancy} Evacuees Housed</span>
                    <span>{pct}% Full ({shelter.capacity - shelter.currentOccupancy} spots left)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
