import React from 'react';
import Header from './Header';
import { AlertCircle, Megaphone, HandHeart, ClipboardList } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';

function MyRequests({ goBack, onSwitchToAdmin }) {
  const { incidents, sosRequests, volunteers } = useAdminData();

  // Find citizen-submitted requests
  const citizenSos = sosRequests
    .filter(s => s.isCitizenSubmission)
    .map(s => ({
      id: s.id,
      type: "Emergency SOS",
      location: s.location,
      status: s.status,
      date: s.timestamp
    }));

  const citizenIncidents = incidents
    .filter(i => i.isCitizenSubmission)
    .map(i => ({
      id: i.id,
      type: `Disaster Report (${i.type})`,
      location: i.location,
      status: i.status,
      date: i.reportedAt
    }));

  const citizenHelp = volunteers
    .filter(v => v.isCitizenSubmission)
    .map(v => ({
      id: v.id,
      type: `Help Offer (${v.type})`,
      location: v.location,
      status: v.status,
      date: v.registeredDate
    }));

  const mockDefaultRequests = [
    { id: "MOCK-1", type: "Emergency SOS", location: "Sector 4, City Center", status: "Active", date: "10:45 AM, Today" },
    { id: "MOCK-2", type: "Disaster Report (Flood)", location: "Main Street Bridge", status: "Pending", date: "09:30 AM, Today" },
    { id: "MOCK-3", type: "Help Offer (Food & Water)", location: "North Side Shelter", status: "Resolved", date: "Yesterday" }
  ];

  const allRequests = [
    ...citizenSos,
    ...citizenIncidents,
    ...citizenHelp,
    ...mockDefaultRequests
  ];

  const getIcon = (type) => {
    if (type.includes("SOS")) {
      return <AlertCircle size={24} color="var(--color-sos)" />;
    } else if (type.includes("Report")) {
      return <Megaphone size={24} color="var(--color-report)" />;
    } else if (type.includes("Help")) {
      return <HandHeart size={24} color="var(--color-help)" />;
    }
    return <ClipboardList size={24} />;
  };

  const getStatusClass = (status) => {
    const s = (status || '').toLowerCase().replace(/\s+/g, '-');
    return `status-${s}`;
  };

  return (
    <div className="app-container">
      <Header goBack={goBack} onSwitchToAdmin={onSwitchToAdmin} />
      <main className="main-content">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="form-header" style={{ marginBottom: '1rem', borderBottom: 'none' }}>
            <ClipboardList size={36} />
            <h1 style={{ fontSize: '2.5rem' }}>My Requests</h1>
          </div>

          <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
            Track the status of all your emergency SOS alerts, disaster reports, and volunteer offers.
          </p>

          <div className="item-list">
            {allRequests.map((req) => (
              <div key={req.id} className="item-card solid-border solid-shadow">
                <div className="item-info" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ padding: '0.5rem', border: 'var(--border-width) solid var(--color-black)', borderRadius: '50%', backgroundColor: 'var(--color-bg)' }}>
                    {getIcon(req.type)}
                  </div>
                  <div>
                    <h3 style={{ marginBottom: '0.25rem' }}>{req.type}</h3>
                    <p style={{ color: 'var(--color-text)' }}><strong>{req.location}</strong></p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>{req.date}</p>
                  </div>
                </div>
                
                <div className={`status-badge ${getStatusClass(req.status)}`}>
                  {req.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default MyRequests;
