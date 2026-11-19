import React from 'react';
import { useAdminData } from '../context/AdminDataContext';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Radio,
  Home,
  CheckCircle2,
  Users,
  Droplets,
  Flame,
  Activity,
  Wind
} from 'lucide-react';

function Analytics() {
  const {
    incidents,
    sosRequests,
    shelters,
    rescueTeams,
    volunteers
  } = useAdminData();

  // Metrics calculations
  const totalIncidents = incidents.length;
  const criticalIncidents = incidents.filter(i => i.severity === 'Critical').length;
  const highIncidents = incidents.filter(i => i.severity === 'High').length;
  const mediumIncidents = incidents.filter(i => i.severity === 'Medium').length;
  const lowIncidents = incidents.filter(i => i.severity === 'Low').length;

  // Type counts
  const incidentTypes = ['Flood', 'Fire', 'Landslide', 'Earthquake', 'Cyclone'];
  const typeCounts = incidentTypes.map(type => ({
    type,
    count: incidents.filter(i => i.type === type).length
  }));

  // Status counts
  const resolvedCount = incidents.filter(i => i.status === 'Resolved').length;
  const inProgressCount = incidents.filter(i => i.status === 'In Progress').length;
  const verifiedCount = incidents.filter(i => i.status === 'Verified').length;
  const underReviewCount = incidents.filter(i => i.status === 'Under Review').length;

  // Shelter metrics
  const totalCapacity = shelters.reduce((acc, s) => acc + s.capacity, 0);
  const totalOccupancy = shelters.reduce((acc, s) => acc + s.currentOccupancy, 0);
  const overallOccupancyPct = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;

  // SOS metrics
  const totalSos = sosRequests.length;
  const rescuedSos = sosRequests.filter(s => s.status === 'Rescued').length;
  const rescuedRate = totalSos > 0 ? Math.round((rescuedSos / totalSos) * 100) : 0;
  const injuredCount = sosRequests.filter(s => s.injured).length;
  const totalPeopleStranded = sosRequests.reduce((acc, s) => acc + s.peopleCount, 0);

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
      <div className="view-header">
        <div>
          <h1 className="view-title">Disaster Grid Operational Analytics</h1>
          <p className="view-subtitle">High-level quantitative intelligence, incident distribution models & relief grid metrics</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-sm btn-outline" onClick={() => window.print()}>
            Print / Export Intelligence Report
          </button>
        </div>
      </div>

      {/* Topline Metrics */}
      <div className="kpi-grid">
        <div className="kpi-card solid-border solid-shadow">
          <div className="kpi-card-header">
            <span className="kpi-title">Incident Resolution</span>
            <div className="kpi-icon-wrap" style={{ backgroundColor: '#e2f8f0' }}>
              <CheckCircle2 size={22} color="var(--color-safe)" />
            </div>
          </div>
          <div className="kpi-value" style={{ color: 'var(--color-safe)' }}>
            {totalIncidents > 0 ? Math.round(((resolvedCount + inProgressCount) / totalIncidents) * 100) : 0}%
          </div>
          <div className="kpi-subtext">Active operational response rate</div>
        </div>

        <div className="kpi-card kpi-sos solid-border solid-shadow">
          <div className="kpi-card-header">
            <span className="kpi-title">SOS Rescue Rate</span>
            <div className="kpi-icon-wrap" style={{ backgroundColor: '#ffe5e9' }}>
              <Radio size={22} color="var(--color-sos)" />
            </div>
          </div>
          <div className="kpi-value" style={{ color: 'var(--color-sos)' }}>
            {rescuedRate}%
          </div>
          <div className="kpi-subtext">{rescuedSos} of {totalSos} signals safely rescued</div>
        </div>

        <div className="kpi-card kpi-info solid-border solid-shadow">
          <div className="kpi-card-header">
            <span className="kpi-title">Grid Shelter Load</span>
            <div className="kpi-icon-wrap" style={{ backgroundColor: '#e8f0fe' }}>
              <Home size={22} color="var(--color-help)" />
            </div>
          </div>
          <div className="kpi-value">{overallOccupancyPct}%</div>
          <div className="kpi-subtext">{totalOccupancy} housed / {totalCapacity} capacity</div>
        </div>

        <div className="kpi-card kpi-safe solid-border solid-shadow">
          <div className="kpi-card-header">
            <span className="kpi-title">Mobilized Force</span>
            <div className="kpi-icon-wrap" style={{ backgroundColor: '#f1f5f9' }}>
              <Users size={22} />
            </div>
          </div>
          <div className="kpi-value">
            {rescueTeams.length + volunteers.length}
          </div>
          <div className="kpi-subtext">Tactical units & volunteers active</div>
        </div>
      </div>

      {/* Grid 2: Incident Type Distribution & Severity Distribution */}
      <div className="grid-2">
        {/* Incident Type Breakdown */}
        <div className="admin-card solid-border solid-shadow">
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              <BarChart3 size={22} color="var(--color-help)" /> Incidents by Disaster Type
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {typeCounts.map(({ type, count }) => {
              const pct = totalIncidents > 0 ? Math.round((count / totalIncidents) * 100) : 0;
              return (
                <div key={type}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {getTypeIcon(type)} {type}
                    </span>
                    <span>{count} Reports ({pct}%)</span>
                  </div>
                  <div className="capacity-bar-wrap" style={{ height: '14px' }}>
                    <div
                      className="capacity-bar-fill"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: type === 'Flood' ? 'var(--color-safe)' :
                          type === 'Fire' ? 'var(--color-sos)' :
                          type === 'Landslide' ? 'var(--color-report)' : 'var(--color-help)'
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="admin-card solid-border solid-shadow">
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              <AlertTriangle size={22} color="var(--color-report)" /> Severity Tier Analysis
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'Critical Severity', count: criticalIncidents, color: 'var(--color-sos)', tag: 'Immediate threat to human life' },
              { label: 'High Severity', count: highIncidents, color: '#ff6b6b', tag: 'Severe infrastructure & structural risk' },
              { label: 'Medium Severity', count: mediumIncidents, color: '#ffd166', tag: 'Moderate localized hazard' },
              { label: 'Low Severity', count: lowIncidents, color: '#a0aec0', tag: 'Minor disruption / advisory' }
            ].map((sev, idx) => {
              const pct = totalIncidents > 0 ? Math.round((sev.count / totalIncidents) * 100) : 0;
              return (
                <div key={idx} className="solid-border" style={{ padding: '0.85rem', backgroundColor: 'var(--color-bg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 800 }}>{sev.label}</span>
                    <span style={{ fontWeight: 900, fontSize: '1.1rem' }}>{sev.count} ({pct}%)</span>
                  </div>
                  <div className="capacity-bar-wrap" style={{ height: '10px' }}>
                    <div className="capacity-bar-fill" style={{ width: `${pct}%`, backgroundColor: sev.color }}></div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: '0.3rem' }}>
                    {sev.tag}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid 2: Pipeline Response Funnel & Shelter Load */}
      <div className="grid-2">
        {/* Response Pipeline Funnel */}
        <div className="admin-card solid-border solid-shadow">
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              <TrendingUp size={22} color="var(--color-safe)" /> Incident Triage Status Funnel
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
            <div className="solid-border" style={{ padding: '1rem', textAlign: 'center', backgroundColor: '#fff3cd' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Under Review</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, margin: '0.25rem 0' }}>{underReviewCount}</div>
              <div style={{ fontSize: '0.75rem' }}>Citizen Reports</div>
            </div>

            <div className="solid-border" style={{ padding: '1rem', textAlign: 'center', backgroundColor: '#e2f8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Verified</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, margin: '0.25rem 0', color: 'var(--color-safe)' }}>{verifiedCount}</div>
              <div style={{ fontSize: '0.75rem' }}>Confirmed Disasters</div>
            </div>

            <div className="solid-border" style={{ padding: '1rem', textAlign: 'center', backgroundColor: '#e0e7ff' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>In Progress</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, margin: '0.25rem 0', color: '#6366f1' }}>{inProgressCount}</div>
              <div style={{ fontSize: '0.75rem' }}>Units Dispatched</div>
            </div>

            <div className="solid-border" style={{ padding: '1rem', textAlign: 'center', backgroundColor: '#dcfce7' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Resolved</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, margin: '0.25rem 0', color: '#16a34a' }}>{resolvedCount}</div>
              <div style={{ fontSize: '0.75rem' }}>Secured & Cleared</div>
            </div>
          </div>

          <div className="solid-border" style={{ padding: '1rem', backgroundColor: 'var(--color-bg)', marginTop: '1.25rem' }}>
            <div style={{ fontWeight: 800, marginBottom: '0.25rem' }}>Emergency Distress (SOS) Triage:</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>
              • Total Stranded Evacuees Recorded: <strong>{totalPeopleStranded} citizens</strong>
              <br />
              • Medical/Trauma Complications: <strong>{injuredCount} cases ({totalSos > 0 ? Math.round((injuredCount / totalSos) * 100) : 0}%)</strong>
              <br />
              • Average Response / Dispatch Time: <strong>6.8 minutes</strong>
            </div>
          </div>
        </div>

        {/* Shelter Capacity Breakdown */}
        <div className="admin-card solid-border solid-shadow">
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              <Home size={22} color="var(--color-help)" /> Shelter Capacity Breakdown
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {shelters.map(s => {
              const pct = Math.round((s.currentOccupancy / s.capacity) * 100);
              return (
                <div key={s.id} className="solid-border" style={{ padding: '0.75rem 1rem', backgroundColor: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.9rem' }}>
                    <span>{s.name}</span>
                    <span>{s.currentOccupancy} / {s.capacity} beds ({pct}%)</span>
                  </div>
                  <div className="capacity-bar-wrap" style={{ height: '12px' }}>
                    <div
                      className="capacity-bar-fill"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: pct >= 100 ? 'var(--color-sos)' : pct >= 80 ? 'var(--color-report)' : 'var(--color-safe)'
                      }}
                    ></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: '0.2rem' }}>
                    <span>{s.location}</span>
                    <span>Rations: <strong>{s.suppliesStatus}</strong></span>
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

export default Analytics;
