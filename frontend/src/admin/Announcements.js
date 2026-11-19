import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import {
  Plus,
  AlertTriangle,
  MapPin,
  Clock,
  Archive,
  X,
  Megaphone,
  Radio,
  CloudRain
} from 'lucide-react';

function Announcements() {
  const {
    announcements,
    createAnnouncement,
    archiveAnnouncement
  } = useAdminData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [filterUrgency, setFilterUrgency] = useState('All');

  const [formData, setFormData] = useState({
    title: '',
    urgency: 'Emergency Alert',
    targetArea: '',
    message: '',
    issuedBy: 'District Disaster Management Authority (DDMA)'
  });

  const filteredAnnouncements = announcements.filter(a => {
    return filterUrgency === 'All' || a.urgency === filterUrgency;
  });

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message || !formData.targetArea) return;

    createAnnouncement(formData);
    setShowAddModal(false);
    setFormData({
      title: '',
      urgency: 'Emergency Alert',
      targetArea: '',
      message: '',
      issuedBy: 'District Disaster Management Authority (DDMA)'
    });
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'Emergency Alert':
        return <span className="badge badge-critical"><Radio size={12} className="animate-pulse" /> Emergency Alert</span>;
      case 'Evacuation Advisory':
        return <span className="badge badge-high"><AlertTriangle size={12} /> Evacuation Advisory</span>;
      case 'Weather Warning':
        return <span className="badge badge-medium"><CloudRain size={12} /> Weather Warning</span>;
      default:
        return <span className="badge badge-verified"><Megaphone size={12} /> General Advisory</span>;
    }
  };

  return (
    <div>
      <div className="view-header">
        <div>
          <h1 className="view-title">Public Broadcasts & Disaster Advisories</h1>
          <p className="view-subtitle">Issue official warning bulletins, evacuation orders & relief resource announcements to citizens</p>
        </div>
        <button className="btn btn-sos" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Issue Emergency Broadcast
        </button>
      </div>

      {/* KPI Stats */}
      <div className="kpi-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="kpi-card kpi-sos solid-border solid-shadow" style={{ padding: '1rem 1.25rem' }}>
          <span className="kpi-title">Active Emergency Alerts</span>
          <div className="kpi-value" style={{ fontSize: '2rem', color: 'var(--color-sos)' }}>
            {announcements.filter(a => a.status === 'Active' && a.urgency === 'Emergency Alert').length}
          </div>
          <div className="kpi-subtext">Immediate action required</div>
        </div>

        <div className="kpi-card kpi-alert solid-border solid-shadow" style={{ padding: '1rem 1.25rem' }}>
          <span className="kpi-title">Weather Advisories</span>
          <div className="kpi-value" style={{ fontSize: '2rem' }}>
            {announcements.filter(a => a.urgency === 'Weather Warning').length}
          </div>
          <div className="kpi-subtext">Meteorological warnings</div>
        </div>

        <div className="kpi-card kpi-safe solid-border solid-shadow" style={{ padding: '1rem 1.25rem' }}>
          <span className="kpi-title">Total Bulletins Issued</span>
          <div className="kpi-value" style={{ fontSize: '2rem' }}>
            {announcements.length}
          </div>
          <div className="kpi-subtext">{announcements.filter(a => a.status === 'Active').length} Currently Active</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-bar solid-border solid-shadow">
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>Filter Urgency:</span>
          {['All', 'Emergency Alert', 'Evacuation Advisory', 'Weather Warning', 'General Update'].map(ug => (
            <button
              key={ug}
              className={`btn-sm ${filterUrgency === ug ? 'btn-sm-primary' : ''}`}
              onClick={() => setFilterUrgency(ug)}
            >
              {ug}
            </button>
          ))}
        </div>
      </div>

      {/* Bulletins List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredAnnouncements.map(ann => (
          <div
            key={ann.id}
            className={`solid-border solid-shadow ${ann.urgency === 'Emergency Alert' && ann.status === 'Active' ? 'kpi-sos' : ''}`}
            style={{
              backgroundColor: 'var(--color-white)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              borderLeftWidth: '8px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  {getUrgencyBadge(ann.urgency)}
                  <span className={`badge ${ann.status === 'Active' ? 'badge-verified' : 'badge-low'}`}>
                    {ann.status}
                  </span>
                </div>
                <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900 }}>
                  {ann.title}
                </h3>
              </div>

              {ann.status === 'Active' && (
                <button
                  className="btn-sm"
                  title="Archive Bulletin"
                  onClick={() => archiveAnnouncement(ann.id)}
                >
                  <Archive size={13} /> Archive
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-sos)' }}>
              <MapPin size={14} /> Targeted Zone: {ann.targetArea}
            </div>

            <div className="solid-border" style={{ padding: '1rem', backgroundColor: 'var(--color-bg)', fontSize: '1rem', lineHeight: 1.6 }}>
              {ann.message}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem', color: 'var(--color-text-light)', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
              <div>
                Issued By: <strong>{ann.issuedBy}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={12} /> {ann.issuedAt}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Broadcast Creation Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Broadcast Emergency Advisory</h2>
              <button
                className="btn-back solid-shadow"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowAddModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement}>
              <div className="form-group">
                <label>Advisory Headline *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Flash Flood Evacuation Notice: River Road"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Alert Urgency Level</label>
                  <select
                    className="form-control"
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  >
                    <option value="Emergency Alert">Emergency Alert (Critical)</option>
                    <option value="Evacuation Advisory">Evacuation Advisory</option>
                    <option value="Weather Warning">Weather Warning</option>
                    <option value="General Update">General Relief Update</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Target Affected Area *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Sectors 3, 4, 7 and Riverfront"
                    value={formData.targetArea}
                    onChange={(e) => setFormData({ ...formData, targetArea: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Official Advisory Instructions *</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Provide precise safety instructions, safe shelter destinations, and emergency contact frequencies..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Issuing Authority / Agency</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.issuedBy}
                  onChange={(e) => setFormData({ ...formData, issuedBy: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-sos" style={{ flex: 1 }}>
                  Broadcast Alert Now
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

export default Announcements;
