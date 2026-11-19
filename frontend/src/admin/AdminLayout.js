import React, { useState, useEffect } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import './Admin.css';
import {
  LayoutDashboard,
  AlertOctagon,
  Radio,
  Users,
  Home,
  HeartHandshake,
  UserCog,
  BellRing,
  BarChart3,
  Activity,
  ArrowLeftRight,
  Shield,
  Clock
} from 'lucide-react';

import AdminOverview from './AdminOverview';
import IncidentManagement from './IncidentManagement';
import SosManagement from './SosManagement';
import RescueTeamManagement from './RescueTeamManagement';
import ShelterManagement from './ShelterManagement';
import VolunteerManagement from './VolunteerManagement';
import UserManagement from './UserManagement';
import Announcements from './Announcements';
import Analytics from './Analytics';

function AdminLayout({ onSwitchToCitizen }) {
  const [currentTab, setCurrentTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  const {
    sosRequests,
    incidents,
    volunteers
  } = useAdminData();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeSosCount = sosRequests.filter(s => s.status !== 'Rescued' && s.status !== 'Cancelled').length;
  const underReviewCount = incidents.filter(i => i.status === 'Under Review').length;
  const pendingVolunteersCount = volunteers.filter(v => v.status === 'Pending Approval').length;

  const navItems = [
    { id: 'overview', label: 'Command Overview', icon: <LayoutDashboard size={18} /> },
    {
      id: 'incidents',
      label: 'Incident Management',
      icon: <AlertOctagon size={18} />,
      count: underReviewCount > 0 ? underReviewCount : null,
      alert: underReviewCount > 0
    },
    {
      id: 'sos',
      label: 'SOS Operations',
      icon: <Radio size={18} />,
      count: activeSosCount > 0 ? activeSosCount : null,
      alert: activeSosCount > 0
    },
    { id: 'rescue_teams', label: 'Rescue Squads', icon: <Users size={18} /> },
    { id: 'shelters', label: 'Safe Shelters', icon: <Home size={18} /> },
    {
      id: 'volunteers',
      label: 'NGOs & Volunteers',
      icon: <HeartHandshake size={18} />,
      count: pendingVolunteersCount > 0 ? pendingVolunteersCount : null
    },
    { id: 'users', label: 'User Accounts', icon: <UserCog size={18} /> },
    { id: 'announcements', label: 'Broadcasts', icon: <BellRing size={18} /> },
    { id: 'analytics', label: 'Grid Analytics', icon: <BarChart3 size={18} /> }
  ];

  const renderActiveScreen = () => {
    switch (currentTab) {
      case 'overview':
        return <AdminOverview onNavigate={(tab) => setCurrentTab(tab)} />;
      case 'incidents':
        return <IncidentManagement />;
      case 'sos':
        return <SosManagement />;
      case 'rescue_teams':
        return <RescueTeamManagement />;
      case 'shelters':
        return <ShelterManagement />;
      case 'volunteers':
        return <VolunteerManagement />;
      case 'users':
        return <UserManagement />;
      case 'announcements':
        return <Announcements />;
      case 'analytics':
        return <Analytics />;
      default:
        return <AdminOverview onNavigate={(tab) => setCurrentTab(tab)} />;
    }
  };

  return (
    <div className="admin-shell">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <Activity size={24} color="var(--color-sos)" strokeWidth={3} />
            <span>DIMAG</span>
            <span className="admin-badge-gov">GOV / ADMIN</span>
          </div>
        </div>

        <nav className="admin-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`admin-nav-item ${currentTab === item.id ? 'active' : ''}`}
              onClick={() => setCurrentTab(item.id)}
            >
              <div className="admin-nav-item-content">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.count !== null && item.count !== undefined && (
                <span className={`admin-nav-count ${item.alert ? 'alert' : ''}`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button
            className="btn btn-sm"
            style={{ width: '100%', backgroundColor: 'var(--color-bg)', display: 'flex', justifyContent: 'center' }}
            onClick={onSwitchToCitizen}
          >
            <ArrowLeftRight size={14} /> Exit to Citizen View
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="admin-main">
        {/* Top Navbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <div className="admin-live-pulse">
              <span className="pulse-dot"></span>
              <span>GRID LIVE • STATE OF EMERGENCY READY</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-light)' }}>
              <Clock size={14} /> {currentTime}
            </div>
          </div>

          <div className="admin-topbar-right">
            <button
              className="btn-switch-role"
              onClick={onSwitchToCitizen}
              title="Return to Citizen Portal"
            >
              <ArrowLeftRight size={15} />
              <span>Citizen Dashboard</span>
            </button>

            <div className="admin-user-pill">
              <Shield size={18} color="var(--color-sos)" />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Eshwar K.</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-light)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Command Administrator
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Screen View */}
        <main className="admin-content">
          {renderActiveScreen()}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
