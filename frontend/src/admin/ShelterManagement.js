import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import {
  Plus,
  MapPin,
  Phone,
  User,
  Edit2,
  Trash2,
  X,
  Package
} from 'lucide-react';

function ShelterManagement() {
  const {
    shelters,
    addShelter,
    updateShelter,
    deleteShelter
  } = useAdminData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingShelter, setEditingShelter] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: 300,
    currentOccupancy: 0,
    status: 'Open',
    suppliesStatus: 'Adequate',
    contactPerson: '',
    phone: '',
    amenities: 'Medical Camp, Clean Drinking Water, Food Distribution'
  });

  const totalCapacity = shelters.reduce((acc, s) => acc + s.capacity, 0);
  const totalOccupancy = shelters.reduce((acc, s) => acc + s.currentOccupancy, 0);
  const availableBeds = Math.max(0, totalCapacity - totalOccupancy);

  const handleCreateShelter = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location) return;

    addShelter({
      ...formData,
      capacity: Number(formData.capacity) || 100,
      currentOccupancy: Number(formData.currentOccupancy) || 0,
      amenities: formData.amenities ? formData.amenities.split(',').map(s => s.trim()) : []
    });

    setShowAddModal(false);
    resetForm();
  };

  const handleUpdateShelter = (e) => {
    e.preventDefault();
    if (!editingShelter) return;

    updateShelter(editingShelter.id, {
      ...formData,
      capacity: Number(formData.capacity) || 100,
      currentOccupancy: Number(formData.currentOccupancy) || 0,
      amenities: typeof formData.amenities === 'string' ? formData.amenities.split(',').map(s => s.trim()) : formData.amenities
    });

    setEditingShelter(null);
    resetForm();
  };

  const openEditModal = (shelter) => {
    setEditingShelter(shelter);
    setFormData({
      name: shelter.name,
      location: shelter.location,
      capacity: shelter.capacity,
      currentOccupancy: shelter.currentOccupancy,
      status: shelter.status,
      suppliesStatus: shelter.suppliesStatus,
      contactPerson: shelter.contactPerson,
      phone: shelter.phone,
      amenities: Array.isArray(shelter.amenities) ? shelter.amenities.join(', ') : shelter.amenities
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      capacity: 300,
      currentOccupancy: 0,
      status: 'Open',
      suppliesStatus: 'Adequate',
      contactPerson: '',
      phone: '',
      amenities: 'Medical Camp, Clean Drinking Water, Food Distribution'
    });
  };

  const handleOccupancyQuickAdjust = (shelter, delta) => {
    const newOcc = Math.max(0, Math.min(shelter.capacity, shelter.currentOccupancy + delta));
    let newStatus = shelter.status;
    if (newOcc >= shelter.capacity) {
      newStatus = 'Full';
    } else if (newOcc >= shelter.capacity * 0.85) {
      newStatus = 'Near Capacity';
    } else if (shelter.status === 'Full' || shelter.status === 'Near Capacity') {
      newStatus = 'Open';
    }
    updateShelter(shelter.id, { currentOccupancy: newOcc, status: newStatus });
  };

  return (
    <div>
      <div className="view-header">
        <div>
          <h1 className="view-title">Shelter & Relief Camp Management</h1>
          <p className="view-subtitle">Supervise designated evacuation shelters, live occupancy levels & critical relief supplies</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowAddModal(true); }}>
          <Plus size={18} /> Register New Safe Shelter
        </button>
      </div>

      {/* KPI Bar */}
      <div className="kpi-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="kpi-card kpi-info solid-border solid-shadow" style={{ padding: '1rem 1.25rem' }}>
          <span className="kpi-title">Active Shelters</span>
          <div className="kpi-value" style={{ fontSize: '2rem' }}>{shelters.length}</div>
          <div className="kpi-subtext">{shelters.filter(s => s.status === 'Open').length} Open & Staffed</div>
        </div>

        <div className="kpi-card kpi-safe solid-border solid-shadow" style={{ padding: '1rem 1.25rem' }}>
          <span className="kpi-title">Available Capacity</span>
          <div className="kpi-value" style={{ fontSize: '2rem', color: 'var(--color-safe)' }}>
            {availableBeds}
          </div>
          <div className="kpi-subtext">Vacant evacuee beds</div>
        </div>

        <div className="kpi-card kpi-alert solid-border solid-shadow" style={{ padding: '1rem 1.25rem' }}>
          <span className="kpi-title">Current Occupancy</span>
          <div className="kpi-value" style={{ fontSize: '2rem' }}>
            {totalOccupancy} / {totalCapacity}
          </div>
          <div className="kpi-subtext">{Math.round((totalOccupancy / totalCapacity) * 100)}% Overall Grid Occupancy</div>
        </div>

        <div className="kpi-card solid-border solid-shadow" style={{ padding: '1rem 1.25rem' }}>
          <span className="kpi-title">Supply Alerts</span>
          <div className="kpi-value" style={{ fontSize: '2rem', color: 'var(--color-sos)' }}>
            {shelters.filter(s => s.suppliesStatus === 'Critical' || s.suppliesStatus === 'Low').length}
          </div>
          <div className="kpi-subtext">Needs urgent restock</div>
        </div>
      </div>

      {/* Shelter Cards Grid */}
      <div className="grid-2">
        {shelters.map(shelter => {
          const pct = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
          let barColor = 'var(--color-safe)';
          if (pct >= 80) barColor = 'var(--color-report)';
          if (pct >= 100) barColor = 'var(--color-sos)';

          return (
            <div
              key={shelter.id}
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
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>{shelter.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-light)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                      <MapPin size={14} color="var(--color-sos)" /> {shelter.location}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                    <span className={`badge ${shelter.status === 'Open' ? 'badge-verified' : shelter.status === 'Full' ? 'badge-critical' : 'badge-high'}`}>
                      {shelter.status}
                    </span>
                  </div>
                </div>

                {/* Progress Bar & Quick Adjust */}
                <div style={{ margin: '1rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 800 }}>
                    <span>Capacity: {shelter.currentOccupancy} / {shelter.capacity} evacuees</span>
                    <span>{pct}% Occupied</span>
                  </div>
                  <div className="capacity-bar-wrap" style={{ height: '18px' }}>
                    <div className="capacity-bar-fill" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: barColor }}></div>
                  </div>

                  {/* Quick Occupancy Steppers */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>Quick Adjust:</span>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button className="btn-sm" onClick={() => handleOccupancyQuickAdjust(shelter, -20)}>-20</button>
                      <button className="btn-sm" onClick={() => handleOccupancyQuickAdjust(shelter, -5)}>-5</button>
                      <button className="btn-sm btn-sm-primary" onClick={() => handleOccupancyQuickAdjust(shelter, +5)}>+5</button>
                      <button className="btn-sm btn-sm-primary" onClick={() => handleOccupancyQuickAdjust(shelter, +20)}>+20</button>
                    </div>
                  </div>
                </div>

                {/* Info row */}
                <div className="solid-border" style={{ padding: '0.75rem', backgroundColor: 'var(--color-bg)', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span><User size={13} style={{ display: 'inline', marginRight: '4px' }} /> <strong>Superintendent:</strong></span>
                    <span>{shelter.contactPerson}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span><Phone size={13} style={{ display: 'inline', marginRight: '4px' }} /> <strong>Direct Contact:</strong></span>
                    <span>{shelter.phone}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><Package size={13} style={{ display: 'inline', marginRight: '4px' }} /> <strong>Ration & Supplies:</strong></span>
                    <span className={`badge ${shelter.suppliesStatus === 'Adequate' ? 'badge-verified' : shelter.suppliesStatus === 'Low' ? 'badge-high' : 'badge-critical'}`}>
                      {shelter.suppliesStatus}
                    </span>
                  </div>
                </div>

                {/* Amenities */}
                {shelter.amenities && shelter.amenities.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                    {shelter.amenities.map((am, i) => (
                      <span key={i} style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#f1f5f9', border: '1px solid #000', padding: '0.15rem 0.4rem' }}>
                        ✓ {am}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '2px dashed var(--color-black)', paddingTop: '0.75rem' }}>
                <button
                  className="btn-sm btn-sm-primary"
                  style={{ flex: 1 }}
                  onClick={() => openEditModal(shelter)}
                >
                  <Edit2 size={13} /> Edit Shelter
                </button>
                <button
                  className="btn-sm btn-sm-danger"
                  onClick={() => {
                    if (window.confirm(`Delete ${shelter.name}?`)) {
                      deleteShelter(shelter.id);
                    }
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Shelter Modal */}
      {(showAddModal || editingShelter) && (
        <div className="modal-overlay" onClick={() => { setShowAddModal(false); setEditingShelter(null); }}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingShelter ? `Edit Shelter: ${editingShelter.name}` : 'Register New Safe Evacuation Shelter'}
              </h2>
              <button
                className="btn-back solid-shadow"
                style={{ cursor: 'pointer' }}
                onClick={() => { setShowAddModal(false); setEditingShelter(null); }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={editingShelter ? handleUpdateShelter : handleCreateShelter}>
              <div className="form-group">
                <label>Shelter Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Community Center Zone 4"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Location & Address *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Street / Sector / District"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Max Capacity (Beds) *</label>
                  <input
                    type="number"
                    min="10"
                    className="form-control"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Current Occupancy</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={formData.currentOccupancy}
                    onChange={(e) => setFormData({ ...formData, currentOccupancy: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Shelter Status</label>
                  <select
                    className="form-control"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Open">Open</option>
                    <option value="Near Capacity">Near Capacity</option>
                    <option value="Full">Full</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Supply / Ration Status</label>
                  <select
                    className="form-control"
                    value={formData.suppliesStatus}
                    onChange={(e) => setFormData({ ...formData, suppliesStatus: e.target.value })}
                  >
                    <option value="Adequate">Adequate</option>
                    <option value="Low">Low (Restock Required)</option>
                    <option value="Critical">Critical (Immediate Need)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Superintendent / Officer</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Officer In Charge"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Contact Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+91 94000 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Amenities (comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Medical Station, Power Generator, Child Care"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editingShelter ? 'Save Changes' : 'Register Shelter'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => { setShowAddModal(false); setEditingShelter(null); }}
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

export default ShelterManagement;
