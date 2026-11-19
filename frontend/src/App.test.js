import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders emergency dashboard with branding and action cards', () => {
  render(<App />);
  
  // Brand name
  const brandElements = screen.getAllByText(/DIMAG/i);
  expect(brandElements.length).toBeGreaterThan(0);

  // Main Dashboard Heading
  expect(screen.getByText(/Emergency Dashboard/i)).toBeInTheDocument();

  // Action Cards
  expect(screen.getByText(/SEND SOS/i)).toBeInTheDocument();
  expect(screen.getByText(/SAFE ZONES/i)).toBeInTheDocument();
  expect(screen.getByText(/REPORT DISASTER/i)).toBeInTheDocument();
  expect(screen.getByText(/I CAN HELP/i)).toBeInTheDocument();
  expect(screen.getByText(/MY REQUESTS/i)).toBeInTheDocument();
});

test('navigates to Report Disaster screen and back', () => {
  render(<App />);

  // Click Report Disaster
  const reportCard = screen.getByText(/REPORT DISASTER/i);
  fireEvent.click(reportCard);

  // Heading on Report screen
  expect(screen.getByRole('heading', { name: /Report Disaster/i })).toBeInTheDocument();

  // Back button navigation
  const backButton = screen.getByLabelText(/Go back/i);
  fireEvent.click(backButton);

  // Back on Home
  expect(screen.getByText(/Emergency Dashboard/i)).toBeInTheDocument();
});

test('toggles to Admin Portal and back to Citizen View', () => {
  render(<App />);

  // Click Admin / Gov Portal
  const adminBtn = screen.getByText(/Admin \/ Gov Portal/i);
  fireEvent.click(adminBtn);

  // In Admin Portal
  expect(screen.getByText(/Emergency Command Center/i)).toBeInTheDocument();

  // Exit back to citizen
  const exitBtn = screen.getByText(/Exit to Citizen View/i);
  fireEvent.click(exitBtn);

  // Back on Citizen Dashboard
  expect(screen.getByText(/Emergency Dashboard/i)).toBeInTheDocument();
});
