import React, { createContext, useContext, useState } from 'react';

const AdminDataContext = createContext();

const initialIncidents = [
  {
    id: "INC-101",
    title: "Main Bridge Flash Flood & Vehicle Trap",
    type: "Flood",
    location: "Sector 4, River Road Bridge",
    severity: "Critical",
    status: "In Progress",
    reportedBy: "Rohan Verma",
    reportedAt: "10:15 AM, Today",
    description: "Water levels rose 4 feet above danger mark. 3 vehicles trapped on bridge, road completely blocked.",
    peopleAffected: 12,
    assignedTeamId: "RT-01"
  },
  {
    id: "INC-102",
    title: "Industrial Area Transformer Fire Hazard",
    type: "Fire",
    location: "Phase II Industrial Zone, Plot 44",
    severity: "High",
    status: "Verified",
    reportedBy: "Sanjay Patel",
    reportedAt: "09:40 AM, Today",
    description: "Substation short circuit caused heavy explosion and localized fire near chemical storage warehouse.",
    peopleAffected: 30,
    assignedTeamId: "RT-03"
  },
  {
    id: "INC-103",
    title: "Hillslope Landslide & Road Blockage",
    type: "Landslide",
    location: "North Bypass Mountain Pass Km 14",
    severity: "High",
    status: "Under Review",
    reportedBy: "Meena Kumari",
    reportedAt: "08:50 AM, Today",
    description: "Heavy debris and mud cut off highway access for over 2 kilometers. Boulders still unstable.",
    peopleAffected: 50,
    assignedTeamId: null
  },
  {
    id: "INC-104",
    title: "Old Municipal School Roof Structural Damage",
    type: "Earthquake",
    location: "Ward 12, Old Market Area",
    severity: "Medium",
    status: "Verified",
    reportedBy: "Anil Shinde",
    reportedAt: "08:10 AM, Today",
    description: "Cracks observed in southern wing after morning tremors. School evacuated, building inspection needed.",
    peopleAffected: 0,
    assignedTeamId: null
  },
  {
    id: "INC-105",
    title: "Residential Area Stormwater Waterlogging",
    type: "Flood",
    location: "Shanti Colony, Lane 3",
    severity: "Low",
    status: "Resolved",
    reportedBy: "Pooja Hegde",
    reportedAt: "Yesterday, 04:30 PM",
    description: "Storm drains clogged. Water entered ground-floor porches. Pumping operations completed.",
    peopleAffected: 15,
    assignedTeamId: null
  }
];

const initialSos = [
  {
    id: "SOS-201",
    citizenName: "Priya Sharma",
    phone: "+91 98765 43210",
    location: "Block C, Metro Enclave, Sector 7",
    latitude: "17.4485° N",
    longitude: "78.3748° E",
    urgency: "Critical",
    peopleCount: 4,
    injured: true,
    medicalHelpNeeded: true,
    status: "Dispatched",
    assignedTeamId: "RT-02",
    timestamp: "10:42 AM, Today",
    notes: "Senior citizen with cardiac distress, 1st floor waterlogging. Immediate boat + paramedic required."
  },
  {
    id: "SOS-202",
    citizenName: "David K.",
    phone: "+91 97451 09876",
    location: "Green Valley Farmhouse, West Periphery",
    latitude: "17.4210° N",
    longitude: "78.3211° E",
    urgency: "Critical",
    peopleCount: 6,
    injured: false,
    medicalHelpNeeded: false,
    status: "Pending",
    assignedTeamId: null,
    timestamp: "10:35 AM, Today",
    notes: "Rapid flood water surrounded single-story house. 2 young children on rooftop."
  },
  {
    id: "SOS-203",
    citizenName: "Kavita Rao",
    phone: "+91 98450 11223",
    location: "Plot 19, Telecom Nagar, Hillside",
    latitude: "17.4650° N",
    longitude: "78.3980° E",
    urgency: "High",
    peopleCount: 2,
    injured: true,
    medicalHelpNeeded: true,
    status: "On Scene",
    assignedTeamId: "RT-04",
    timestamp: "09:55 AM, Today",
    notes: "Compound wall collapsed, leg fracture sustained. Paramedics providing first aid."
  },
  {
    id: "SOS-204",
    citizenName: "Abdul Rahman",
    phone: "+91 99001 54321",
    location: "Lakeview Apartments Basement",
    latitude: "17.4332° N",
    longitude: "78.3614° E",
    urgency: "Medium",
    peopleCount: 1,
    injured: false,
    medicalHelpNeeded: false,
    status: "Rescued",
    assignedTeamId: "RT-01",
    timestamp: "08:15 AM, Today",
    notes: "Elevator power cut during storm. Successfully evacuated through manual hatch."
  }
];

const initialRescueTeams = [
  {
    id: "RT-01",
    name: "NDRF Bravo Water Rescue Unit",
    leader: "Inspector Rajesh Deshmukh",
    phone: "+91 98111 22334",
    specialization: "Flood & Inflatable Boat Evacuation",
    status: "Deployed",
    currentAssignment: "Main Bridge Flash Flood (INC-101)",
    membersCount: 8,
    baseLocation: "District Fire Station 1",
    equipment: ["3 Motorized Inflatable Boats", "Life Vests", "Thermal Scanners"]
  },
  {
    id: "RT-02",
    name: "SDRF Rapid Paramedic Squad",
    leader: "Dr. Tarun Verma",
    phone: "+91 98222 33445",
    specialization: "Emergency Medical Triage & Evac",
    status: "Deployed",
    currentAssignment: "Sector 7 Distress Evac (SOS-201)",
    membersCount: 6,
    baseLocation: "Government General Hospital Triage Wing",
    equipment: ["2 Advanced Life Support Ambulances", "Defibrillators", "Trauma Kits"]
  },
  {
    id: "RT-03",
    name: "Fire & Hazmat Strike Team 4",
    leader: "Chief Officer M. Narayanan",
    phone: "+91 98333 44556",
    specialization: "Hazardous Chemical & Structural Fire",
    status: "Deployed",
    currentAssignment: "Industrial Area Transformer Fire (INC-102)",
    membersCount: 12,
    baseLocation: "MIDC Station 4",
    equipment: ["Foam Tender", "Breathing Apparatus Sets", "Hydraulic Cutters"]
  },
  {
    id: "RT-04",
    name: "Civil Defence Canine & Search Team",
    leader: "Sub-Inspector Anita Das",
    phone: "+91 98444 55667",
    specialization: "Collapse & Debris Search Operations",
    status: "Deployed",
    currentAssignment: "Telecom Nagar Compound Wall (SOS-203)",
    membersCount: 5,
    baseLocation: "Civil Defence Headquarters",
    equipment: ["2 Trained Search Dogs", "Acoustic Listening Devices", "Rescue Drones"]
  },
  {
    id: "RT-05",
    name: "Highland Rescue & Mountaineering Corps",
    leader: "Capt. Sonam Dorjee",
    phone: "+91 98555 66778",
    specialization: "Landslide & High Altitude Ropes",
    status: "Available",
    currentAssignment: "Standby for North Pass deployment",
    membersCount: 10,
    baseLocation: "North Range Base Camp",
    equipment: ["Rope Rescue Kits", "Earth Excavator", "Winch 4x4 Jeeps"]
  },
  {
    id: "RT-06",
    name: "City Volunteer Lifeguard Corps",
    leader: "Praveen Rao",
    phone: "+91 98666 77889",
    specialization: "Urban Water Transport & Rations",
    status: "Available",
    currentAssignment: "Standby for relief dispatch",
    membersCount: 14,
    baseLocation: "Lakeside Boating Club",
    equipment: ["Kayaks", "Rafts", "Megaphones", "Ration Crates"]
  }
];

const initialShelters = [
  {
    id: "SH-01",
    name: "City Central Indoor Stadium",
    location: "Civil Lines, Sector 2",
    capacity: 600,
    currentOccupancy: 380,
    status: "Open",
    suppliesStatus: "Adequate",
    contactPerson: "Rajesh Mehra (Superintendent)",
    phone: "+91 94230 11223",
    amenities: ["Medical Camp", "Community Kitchen", "Purified Water", "Clean Bedding"]
  },
  {
    id: "SH-02",
    name: "St. Jude's High School & Hall",
    location: "Mission Road, Sector 5",
    capacity: 350,
    currentOccupancy: 310,
    status: "Near Capacity",
    suppliesStatus: "Low",
    contactPerson: "Sister Maria Joseph",
    phone: "+91 94231 22334",
    amenities: ["Classroom Dormitories", "First Aid Station", "Women & Children Zone"]
  },
  {
    id: "SH-03",
    name: "Community Hall North",
    location: "Railway Colony, North Zone",
    capacity: 200,
    currentOccupancy: 200,
    status: "Full",
    suppliesStatus: "Critical",
    contactPerson: "Vikas Bansal (President)",
    phone: "+91 94232 33445",
    amenities: ["Shelter Hall", "Generator Backup", "Packed Meals"]
  },
  {
    id: "SH-04",
    name: "South Hills Polytechnic Center",
    location: "Ring Road, South Gate",
    capacity: 450,
    currentOccupancy: 120,
    status: "Open",
    suppliesStatus: "Adequate",
    contactPerson: "Dr. K. Srinivas",
    phone: "+91 94233 44556",
    amenities: ["Spacious Auditoriums", "Full Medical Ward", "Large Vehicle Parking"]
  }
];

const initialVolunteers = [
  {
    id: "VOL-301",
    name: "Dr. Ananya Roy",
    organization: "Indian Red Cross Society",
    type: "Medical Assistance (Doctor/Nurse)",
    location: "Sector 2, Civil Lines",
    contact: "+91 91234 56789",
    status: "Approved",
    assignedTask: "Medical Triage Station at City Central Stadium",
    registeredDate: "Today, 08:30 AM"
  },
  {
    id: "VOL-302",
    name: "Akash Singhal & Group",
    organization: "Youth Seva NGO",
    type: "Provide Food & Water",
    location: "Old Market Colony",
    contact: "+91 92345 67890",
    status: "Approved",
    assignedTask: "Distributing 500 meal packets in Sector 4",
    registeredDate: "Today, 09:15 AM"
  },
  {
    id: "VOL-303",
    name: "Karan Johar Fleet Services",
    organization: "Private Transport Alliance",
    type: "Transport / Evacuation",
    location: "Bypass Junction",
    contact: "+91 93456 78901",
    status: "Pending Approval",
    assignedTask: "Offered 4 Mini-buses for elderly evacuation",
    registeredDate: "Today, 10:20 AM"
  },
  {
    id: "VOL-304",
    name: "Sneha Mukherjee",
    organization: "Individual Volunteer",
    type: "Volunteer Work",
    location: "Koramangala, Zone 3",
    contact: "+91 94567 89012",
    status: "Pending Approval",
    assignedTask: "Available for shelter registration desk",
    registeredDate: "Today, 10:50 AM"
  },
  {
    id: "VOL-305",
    name: "Vikram Logistics",
    organization: "Individual",
    type: "Temporary Shelter",
    location: "Greenfields Enclave",
    contact: "+91 95678 90123",
    status: "Approved",
    assignedTask: "Offered warehouse space for dry rations storage",
    registeredDate: "Yesterday, 06:00 PM"
  }
];

const initialUsers = [
  {
    id: "USR-001",
    name: "K. Eshwar",
    email: "eshwar.admin@dimag.gov.in",
    role: "Admin",
    city: "State Command Center",
    phone: "+91 99999 00001",
    status: "Active",
    registeredDate: "2026-01-10"
  },
  {
    id: "USR-002",
    name: "Inspector Rajesh Deshmukh",
    email: "deshmukh.ndrf@gov.in",
    role: "Rescue Team",
    city: "District Fire Station 1",
    phone: "+91 98111 22334",
    status: "Active",
    registeredDate: "2026-01-15"
  },
  {
    id: "USR-003",
    name: "Dr. Ananya Roy",
    email: "ananya.roy@redcross.org",
    role: "NGO",
    city: "Civil Lines",
    phone: "+91 91234 56789",
    status: "Active",
    registeredDate: "2026-01-20"
  },
  {
    id: "USR-004",
    name: "Priya Sharma",
    email: "priya.sharma@gmail.com",
    role: "Citizen",
    city: "Sector 7",
    phone: "+91 98765 43210",
    status: "Active",
    registeredDate: "2026-02-01"
  },
  {
    id: "USR-005",
    name: "Rohan Verma",
    email: "rohan.v@outlook.com",
    role: "Citizen",
    city: "River Road",
    phone: "+91 98765 12345",
    status: "Active",
    registeredDate: "2026-02-14"
  },
  {
    id: "USR-006",
    name: "Amitabh Sen (Disaster Observer)",
    email: "amitabh.sen@observer.org",
    role: "Citizen",
    city: "Old City",
    phone: "+91 98765 99887",
    status: "Suspended",
    registeredDate: "2026-02-18"
  }
];

const initialAnnouncements = [
  {
    id: "ANN-501",
    title: "Urgent Evacuation Alert: Sector 4 Riverbank Residents",
    urgency: "Emergency Alert",
    targetArea: "Sectors 3, 4, and 7 Low-Lying Riverfront",
    message: "Flood crest expected at 12:30 PM. All ground-floor and riverbank residents must relocate immediately to City Central Stadium shelter. Boats are patrolling.",
    issuedAt: "10:00 AM Today",
    issuedBy: "District Disaster Management Authority (DDMA)",
    status: "Active"
  },
  {
    id: "ANN-502",
    title: "Heavy Rainfall & Landslide Warning for North Bypass",
    urgency: "Weather Warning",
    targetArea: "North Mountain Pass (Km 10 to Km 25)",
    message: "Continuous precipitation has triggered slope instability. All non-emergency vehicular traffic through North Pass is banned until 6:00 PM tomorrow.",
    issuedAt: "08:30 AM Today",
    issuedBy: "State Meteorological Division",
    status: "Active"
  },
  {
    id: "ANN-503",
    title: "Free Medical Aid & Infant Formula at South Hills Center",
    urgency: "General Update",
    targetArea: "Citywide Evacuees",
    message: "Red Cross pediatric clinic and essential baby formula supplies are available at South Hills Polytechnic shelter. No registration fee required.",
    issuedAt: "07:45 AM Today",
    issuedBy: "Emergency Relief Directorate",
    status: "Active"
  }
];

export function AdminDataProvider({ children }) {
  const [incidents, setIncidents] = useState(initialIncidents);
  const [sosRequests, setSosRequests] = useState(initialSos);
  const [rescueTeams, setRescueTeams] = useState(initialRescueTeams);
  const [shelters, setShelters] = useState(initialShelters);
  const [volunteers, setVolunteers] = useState(initialVolunteers);
  const [users, setUsers] = useState(initialUsers);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);

  // INCIDENT ACTIONS
  const verifyIncident = (id) => {
    setIncidents(prev => prev.map(item => item.id === id ? { ...item, status: "Verified" } : item));
  };

  const rejectIncident = (id) => {
    setIncidents(prev => prev.map(item => item.id === id ? { ...item, status: "Rejected" } : item));
  };

  const updateIncidentStatus = (id, newStatus) => {
    setIncidents(prev => {
      return prev.map(item => {
        if (item.id === id) {
          // If resolved, free up the team if assigned
          if (newStatus === "Resolved" && item.assignedTeamId) {
            setRescueTeams(teams => teams.map(t => t.id === item.assignedTeamId ? { ...t, status: "Available", currentAssignment: "Standby for new deployment" } : t));
          }
          return { ...item, status: newStatus };
        }
        return item;
      });
    });
  };

  const updateIncidentSeverity = (id, newSeverity) => {
    setIncidents(prev => prev.map(item => item.id === id ? { ...item, severity: newSeverity } : item));
  };

  const assignTeamToIncident = (incidentId, teamId) => {
    const targetTeam = rescueTeams.find(t => t.id === teamId);
    const targetIncident = incidents.find(i => i.id === incidentId);

    setIncidents(prev => prev.map(i => i.id === incidentId ? { ...i, assignedTeamId: teamId, status: i.status === "Under Review" ? "In Progress" : i.status } : i));

    if (targetTeam && targetIncident) {
      setRescueTeams(prev => prev.map(t => t.id === teamId ? {
        ...t,
        status: "Deployed",
        currentAssignment: `${targetIncident.title} (${targetIncident.id})`
      } : t));
    }
  };

  // SOS ACTIONS
  const assignTeamToSos = (sosId, teamId) => {
    const targetTeam = rescueTeams.find(t => t.id === teamId);
    const targetSos = sosRequests.find(s => s.id === sosId);

    setSosRequests(prev => prev.map(s => s.id === sosId ? { ...s, assignedTeamId: teamId, status: "Dispatched" } : s));

    if (targetTeam && targetSos) {
      setRescueTeams(prev => prev.map(t => t.id === teamId ? {
        ...t,
        status: "Deployed",
        currentAssignment: `Distress Call: ${targetSos.citizenName} at ${targetSos.location}`
      } : t));
    }
  };

  const updateSosStatus = (sosId, newStatus) => {
    setSosRequests(prev => prev.map(s => {
      if (s.id === sosId) {
        if (newStatus === "Rescued" && s.assignedTeamId) {
          setRescueTeams(teams => teams.map(t => t.id === s.assignedTeamId ? { ...t, status: "Available", currentAssignment: "Standby for new dispatch" } : t));
        }
        return { ...s, status: newStatus };
      }
      return s;
    }));
  };

  // RESCUE TEAM ACTIONS
  const addRescueTeam = (teamData) => {
    const newTeam = {
      ...teamData,
      id: `RT-0${rescueTeams.length + 1}`,
      status: teamData.status || "Available",
      currentAssignment: teamData.currentAssignment || "Standby for dispatch"
    };
    setRescueTeams(prev => [newTeam, ...prev]);
  };

  const updateRescueTeamStatus = (teamId, newStatus) => {
    setRescueTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          status: newStatus,
          currentAssignment: newStatus === "Available" ? "Standby at base station" : t.currentAssignment
        };
      }
      return t;
    }));
  };

  // SHELTER ACTIONS
  const addShelter = (shelterData) => {
    const newShelter = {
      ...shelterData,
      id: `SH-0${shelters.length + 1}`,
      capacity: Number(shelterData.capacity) || 100,
      currentOccupancy: Number(shelterData.currentOccupancy) || 0,
      status: shelterData.status || "Open",
      suppliesStatus: shelterData.suppliesStatus || "Adequate",
      amenities: shelterData.amenities || ["Clean Water", "Basic First Aid"]
    };
    setShelters(prev => [newShelter, ...prev]);
  };

  const updateShelter = (id, updatedFields) => {
    setShelters(prev => prev.map(s => s.id === id ? { ...s, ...updatedFields } : s));
  };

  const deleteShelter = (id) => {
    setShelters(prev => prev.filter(s => s.id !== id));
  };

  // VOLUNTEER ACTIONS
  const approveVolunteer = (id) => {
    setVolunteers(prev => prev.map(v => v.id === id ? { ...v, status: "Approved" } : v));
  };

  const rejectVolunteer = (id) => {
    setVolunteers(prev => prev.map(v => v.id === id ? { ...v, status: "Rejected" } : v));
  };

  const assignVolunteerTask = (id, task) => {
    setVolunteers(prev => prev.map(v => v.id === id ? { ...v, assignedTask: task, status: "Deployed" } : v));
  };

  // USER MANAGEMENT ACTIONS
  const updateUserStatus = (id, newStatus) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
  };

  const updateUserRole = (id, newRole) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  const addUser = (userData) => {
    const newUser = {
      ...userData,
      id: `USR-00${users.length + 1}`,
      status: "Active",
      registeredDate: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [newUser, ...prev]);
  };

  // ANNOUNCEMENTS ACTIONS
  const createAnnouncement = (annData) => {
    const newAnn = {
      ...annData,
      id: `ANN-${500 + announcements.length + 1}`,
      issuedAt: "Just now",
      status: "Active",
      issuedBy: annData.issuedBy || "DDMA Command Center"
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const archiveAnnouncement = (id) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, status: "Archived" } : a));
  };

  // Citizen cross-connection actions
  const addCitizenReport = (data) => {
    const newInc = {
      id: `INC-${100 + incidents.length + 1}`,
      title: `${data.type} Alert at ${data.location}`,
      type: data.type || "Other",
      location: data.location,
      severity: "High",
      status: "Under Review",
      reportedBy: "Citizen Portal User",
      reportedAt: "Just now",
      description: data.description || "Reported via citizen emergency form",
      peopleAffected: 0,
      assignedTeamId: null,
      isCitizenSubmission: true
    };
    setIncidents(prev => [newInc, ...prev]);
    return newInc;
  };

  const addCitizenSos = (locationName = "Current Geolocation") => {
    const newSos = {
      id: `SOS-${200 + sosRequests.length + 1}`,
      citizenName: "Live Citizen Alert",
      phone: "+91 99999 88888",
      location: locationName,
      latitude: "17.4485° N",
      longitude: "78.3748° E",
      urgency: "Critical",
      peopleCount: 1,
      injured: false,
      medicalHelpNeeded: false,
      status: "Pending",
      assignedTeamId: null,
      timestamp: "Just now",
      notes: "Triggered from mobile SOS citizen screen.",
      isCitizenSubmission: true
    };
    setSosRequests(prev => [newSos, ...prev]);
    return newSos;
  };

  const addCitizenHelp = (data) => {
    const newVol = {
      id: `VOL-${300 + volunteers.length + 1}`,
      name: "Citizen Supporter",
      organization: "Community Volunteer",
      type: data.helpType || "Volunteer Work",
      location: data.location || "City Center",
      contact: data.contact || "+91 98000 00000",
      status: "Pending Approval",
      assignedTask: "Reviewing offer capabilities",
      registeredDate: "Just now",
      isCitizenSubmission: true
    };
    setVolunteers(prev => [newVol, ...prev]);
    return newVol;
  };

  return (
    <AdminDataContext.Provider
      value={{
        incidents,
        sosRequests,
        rescueTeams,
        shelters,
        volunteers,
        users,
        announcements,
        verifyIncident,
        rejectIncident,
        updateIncidentStatus,
        updateIncidentSeverity,
        assignTeamToIncident,
        assignTeamToSos,
        updateSosStatus,
        addRescueTeam,
        updateRescueTeamStatus,
        addShelter,
        updateShelter,
        deleteShelter,
        approveVolunteer,
        rejectVolunteer,
        assignVolunteerTask,
        updateUserStatus,
        updateUserRole,
        addUser,
        createAnnouncement,
        archiveAnnouncement,
        addCitizenReport,
        addCitizenSos,
        addCitizenHelp
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error("useAdminData must be used within an AdminDataProvider");
  }
  return context;
}
