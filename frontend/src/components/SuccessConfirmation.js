import React from 'react';
import Header from './Header';
import { CheckCircle } from 'lucide-react';

function SuccessConfirmation({ goBack, type, onSwitchToAdmin }) {
  const title = type === 'report' ? 'Report Submitted' : 'Offer Registered';
  const text = type === 'report' 
    ? 'Thank you for reporting. Authorities and rescue teams have been notified.' 
    : 'Thank you for offering help. Your volunteer details have been recorded in the Command Grid.';

  return (
    <div className="app-container">
      <Header goBack={goBack} onSwitchToAdmin={onSwitchToAdmin} />
      <main className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="form-container solid-border solid-shadow" style={{ textAlign: 'center', width: '100%', maxWidth: '500px', padding: '4rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <CheckCircle size={80} color="var(--color-safe)" />
          </div>
          
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>{title}</h1>
          <p style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '2.5rem' }}>
            {text}
          </p>
          
          <button className="btn btn-primary" onClick={goBack} style={{ width: '100%' }}>
            Return to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}

export default SuccessConfirmation;
