import React, { useState, useEffect } from 'react';
import Header from './Header';
import { ShieldCheck, MapPin, Phone, Users, Package } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';

function SafeZones({ goBack, onSwitchToAdmin }) {
  const [loading, setLoading] = useState(true);
  const adminData = useAdminData();
  const shelters = adminData?.shelters || [];

  const defaultMockZones = [
    { id: "SH-01", name: "City Central Stadium", location: "Civil Lines, Sector 2", capacity: 600, currentOccupancy: 380, status: "Open", phone: "+91 94230 11223", amenities: ["Medical Camp", "Purified Water", "Clean Bedding"] },
    { id: "SH-02", name: "St. Jude's High School", location: "Mission Road, Sector 5", capacity: 350, currentOccupancy: 310, status: "Near Capacity", phone: "+91 94231 22334", amenities: ["Classroom Dormitories", "First Aid"] },
    { id: "SH-03", name: "Community Hall North", location: "Railway Colony, North Zone", capacity: 200, currentOccupancy: 200, status: "Full", phone: "+91 94232 33445", amenities: ["Shelter Hall", "Generator Backup"] }
  ];

  const displayZones = shelters.length > 0 ? shelters : defaultMockZones;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'status-open';
      case 'near capacity': return 'status-near-capacity';
      case 'full': return 'status-full';
      case 'closed': return 'status-closed';
      default: return 'status-open';
    }
  };

  return (
    <div className="app-container">
      <Header goBack={goBack} onSwitchToAdmin={onSwitchToAdmin} />
      <main className="main-content">
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div className="form-header" style={{ marginBottom: '1rem', borderBottom: 'none' }}>
            <ShieldCheck size={36} color="var(--color-safe)" />
            <h1 style={{ fontSize: '2.5rem' }}>Safe Zones & Shelters</h1>
          </div>
          
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
            These are verified shelters currently accepting evacuees with active relief supplies.
          </p>

          <div className="item-list">
            {loading ? (
              <>
                {[1, 2, 3].map((n) => (
                  <div key={n} className="item-card skeleton" style={{ height: '110px' }}></div>
                ))}
              </>
            ) : (
              displayZones.map(zone => {
                const spotsLeft = Math.max(0, zone.capacity - zone.currentOccupancy);
                const amenitiesList = Array.isArray(zone.amenities)
                  ? zone.amenities
                  : typeof zone.amenities === 'string'
                    ? zone.amenities.split(',').map(a => a.trim())
                    : [];

                return (
                  <div key={zone.id} className="item-card solid-border solid-shadow" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div className="item-info">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <MapPin size={20} color="var(--color-sos)" />
                          {zone.name}
                        </h3>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-light)' }}>
                          <span>{zone.location}</span>
                        </p>
                      </div>

                      <div className={`status-badge ${getStatusClass(zone.status)}`}>
                        {zone.status}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--color-text)', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Users size={16} color="var(--color-safe)" />
                        <span><strong>{spotsLeft}</strong> beds left ({zone.currentOccupancy}/{zone.capacity})</span>
                      </div>
                      {zone.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Phone size={16} />
                          <span>{zone.phone}</span>
                        </div>
                      )}
                      {zone.suppliesStatus && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Package size={16} />
                          <span>Supplies: <strong>{zone.suppliesStatus}</strong></span>
                        </div>
                      )}
                    </div>

                    {amenitiesList.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                        {amenitiesList.map((amenity, idx) => (
                          <span
                            key={idx}
                            style={{
                              backgroundColor: 'var(--color-bg)',
                              border: '1px solid var(--color-black)',
                              padding: '0.15rem 0.5rem',
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default SafeZones;
