import { useState } from "react";
import { Activity, Shield } from "lucide-react";
import "./App.css";
import Home from "./components/Home";
import Help from "./components/Help";
import Report from "./components/Report";
import SafeZones from "./components/SafeZones";
import MyRequests from "./components/MyRequests";
import SosActive from "./components/SosActive";
import SuccessConfirmation from "./components/SuccessConfirmation";
import AdminLayout from "./admin/AdminLayout";
import { AdminDataProvider, useAdminData } from "./context/AdminDataContext";

function AppContent() {
  const [role, setRole] = useState("citizen"); // 'citizen' | 'admin'
  const [screen, setScreen] = useState("home");
  const [successType, setSuccessType] = useState(null);
  const [activeSosId, setActiveSosId] = useState(null);

  const { addCitizenReport, addCitizenSos, addCitizenHelp, updateSosStatus } = useAdminData();

  function handleSOS() {
    const newSos = addCitizenSos("Sector 4, City Center (Citizen Mobile GPS)");
    if (newSos?.id) {
      setActiveSosId(newSos.id);
    }
    setScreen("sos_active");
  }

  function handleCancelSos() {
    if (activeSosId) {
      updateSosStatus(activeSosId, "Cancelled");
      setActiveSosId(null);
    }
  }

  function handleSuccess(type, data) {
    if (type === 'report' && data) {
      addCitizenReport(data);
    } else if (type === 'help' && data) {
      addCitizenHelp(data);
    }
    setSuccessType(type);
    setScreen("success");
  }

  if (role === "admin") {
    return <AdminLayout onSwitchToCitizen={() => setRole("citizen")} />;
  }

  function renderScreen() {
    switch (screen) {
      case "sos_active":
        return (
          <SosActive
            goBack={() => setScreen("home")}
            onSwitchToAdmin={() => setRole("admin")}
            onCancelSos={handleCancelSos}
          />
        );
      case "success":
        return (
          <SuccessConfirmation
            goBack={() => setScreen("home")}
            type={successType}
            onSwitchToAdmin={() => setRole("admin")}
          />
        );
      case "help":
        return (
          <Help
            goBack={() => setScreen("home")}
            onSuccess={(data) => handleSuccess('help', data)}
            onSwitchToAdmin={() => setRole("admin")}
          />
        );
      case "report":
        return (
          <Report
            goBack={() => setScreen("home")}
            onSuccess={(data) => handleSuccess('report', data)}
            onSwitchToAdmin={() => setRole("admin")}
          />
        );
      case "safezones":
        return (
          <SafeZones
            goBack={() => setScreen("home")}
            onSwitchToAdmin={() => setRole("admin")}
          />
        );
      case "myrequests":
        return (
          <MyRequests
            goBack={() => setScreen("home")}
            onSwitchToAdmin={() => setRole("admin")}
          />
        );
      default:
        return (
          <div className="app-container">
            <nav className="navbar solid-shadow">
              <div className="navbar-brand" onClick={() => setScreen("home")}>
                <Activity size={28} color="var(--color-sos)" strokeWidth={3} />
                DIMAG
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <button
                  className="btn-switch-role"
                  onClick={() => setRole("admin")}
                  title="Switch to Government / Admin Control Center"
                >
                  <Shield size={16} color="var(--color-sos)" />
                  <span>Admin / Gov Portal</span>
                </button>
              </div>
            </nav>
            <main className="main-content">
              <Home
                handleSOS={handleSOS}
                handleReport={() => setScreen("report")}
                handleHelp={() => setScreen("help")}
                handleSafeZones={() => setScreen("safezones")}
                handleMyRequests={() => setScreen("myrequests")}
              />
            </main>
          </div>
        );
    }
  }

  return renderScreen();
}

function App() {
  return (
    <AdminDataProvider>
      <AppContent />
    </AdminDataProvider>
  );
}

export default App;
