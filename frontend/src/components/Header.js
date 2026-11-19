import React from 'react';
import { Activity, ArrowLeft, Shield } from 'lucide-react';

function Header({ goBack, hideBack = false, onSwitchToAdmin }) {
  return (
    <nav className="navbar solid-shadow" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {!hideBack && (
          <button className="btn-back solid-shadow" onClick={goBack} aria-label="Go back">
            <ArrowLeft size={24} />
          </button>
        )}
        <div className="navbar-brand" onClick={goBack} style={{ cursor: 'pointer' }}>
          <Activity size={28} color="var(--color-sos)" strokeWidth={3} />
          DIMAG
        </div>
      </div>
      {onSwitchToAdmin && (
        <button
          className="btn-switch-role"
          onClick={onSwitchToAdmin}
          title="Switch to Government / Admin Control Center"
        >
          <Shield size={16} color="var(--color-sos)" />
          <span>Admin / Gov Portal</span>
        </button>
      )}
    </nav>
  );
}

export default Header;
