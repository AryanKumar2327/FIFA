// ============================================
// FIFA AI MATCHMATE - DATA LAYER
// ============================================

const DEMO_DATA = {
  // Stadium Info
  stadium: {
    name: "MetLife Stadium",
    city: "East Rutherford, New Jersey",
    capacity: 82500,
    currentCrowd: 71243,
    crowdPercent: 86,
    gates: 12,
    aiRecommendations: 2847,
    openedGates: 9,
    closedGates: 3,
    openGatesList: ['A1','A2','B1','B2','C1','C2','D1','E1','F1'],
    closedGatesList: ['D2','E2','F2']
  },

  // Match Data
  matches: [
    {
      id: 1,
      team1: { name: "Brazil", flag: "🇧🇷", code: "BRA", players: ["Vinicius Jr.", "Rodrygo", "Endrick"] },
      team2: { name: "Argentina", flag: "🇦🇷", code: "ARG", players: ["Messi", "Di María", "Álvarez"] },
      date: "2026-07-20T20:00:00",
      venue: "MetLife Stadium",
      group: "Final",
      status: "upcoming",
      score: null,
      weather: { temp: 28, condition: "Partly Cloudy", humidity: 65, wind: "12 km/h NE" }
    },
    {
      id: 2,
      team1: { name: "France", flag: "🇫🇷", code: "FRA", players: ["Mbappé", "Griezmann", "Camavinga"] },
      team2: { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", code: "ENG", players: ["Bellingham", "Saka", "Foden"] },
      date: "2026-07-19T17:00:00",
      venue: "SoFi Stadium",
      group: "Semi-Final",
      status: "live",
      score: { team1: 2, team2: 1 },
      minute: 67,
      weather: { temp: 31, condition: "Sunny", humidity: 45, wind: "8 km/h SW" }
    },
    {
      id: 3,
      team1: { name: "Germany", flag: "🇩🇪", code: "GER", players: ["Musiala", "Wirtz", "Füllkrug"] },
      team2: { name: "Spain", flag: "🇪🇸", code: "ESP", players: ["Pedri", "Yamal", "Morata"] },
      date: "2026-07-18T20:00:00",
      venue: "AT&T Stadium",
      group: "Quarter-Final",
      status: "finished",
      score: { team1: 2, team2: 3 },
      weather: { temp: 26, condition: "Clear", humidity: 55, wind: "5 km/h N" }
    },
    {
      id: 4,
      team1: { name: "Morocco", flag: "🇲🇦", code: "MAR", players: ["Hakimi", "Ziyech", "Boufal"] },
      team2: { name: "USA", flag: "🇺🇸", code: "USA", players: ["Pulisic", "McKennie", "Reyna"] },
      date: "2026-07-21T14:00:00",
      venue: "Rose Bowl",
      group: "Quarter-Final",
      status: "upcoming",
      score: null,
      weather: { temp: 29, condition: "Sunny", humidity: 40, wind: "10 km/h W" }
    }
  ],

  // Crowd Data for heatmap
  crowdZones: [
    { id: "N1", name: "North Stand 1", level: "low", occupancy: 35 },
    { id: "N2", name: "North Stand 2", level: "medium", occupancy: 62 },
    { id: "N3", name: "North Stand 3", level: "high", occupancy: 81 },
    { id: "N4", name: "North Stand 4", level: "critical", occupancy: 97 },
    { id: "S1", name: "South Stand 1", level: "medium", occupancy: 58 },
    { id: "S2", name: "South Stand 2", level: "low", occupancy: 28 },
    { id: "S3", name: "South Stand 3", level: "high", occupancy: 77 },
    { id: "S4", name: "South Stand 4", level: "critical", occupancy: 94 },
    { id: "E1", name: "East Stand 1", level: "low", occupancy: 42 },
    { id: "E2", name: "East Stand 2", level: "medium", occupancy: 65 },
    { id: "E3", name: "East Stand 3", level: "medium", occupancy: 70 },
    { id: "E4", name: "East Stand 4", level: "high", occupancy: 88 },
    { id: "W1", name: "West Stand 1", level: "critical", occupancy: 95 },
    { id: "W2", name: "West Stand 2", level: "high", occupancy: 83 },
    { id: "W3", name: "West Stand 3", level: "medium", occupancy: 61 },
    { id: "W4", name: "West Stand 4", level: "low", occupancy: 38 },
    { id: "G1", name: "Gate A", level: "high", occupancy: 84 },
    { id: "G2", name: "Gate B", level: "low", occupancy: 22 },
    { id: "G3", name: "Gate C", level: "medium", occupancy: 55 },
    { id: "G4", name: "Gate D", level: "critical", occupancy: 96 },
    { id: "F1", name: "Food Court 1", level: "high", occupancy: 79 },
    { id: "F2", name: "Food Court 2", level: "medium", occupancy: 64 },
    { id: "F3", name: "Food Court 3", level: "low", occupancy: 31 },
    { id: "F4", name: "Food Court 4", level: "medium", occupancy: 69 },
    { id: "P1", name: "Parking A", level: "critical", occupancy: 98 },
    { id: "P2", name: "Parking B", level: "high", occupancy: 87 },
    { id: "P3", name: "Parking C", level: "medium", occupancy: 56 },
    { id: "P4", name: "Parking D", level: "low", occupancy: 33 },
    { id: "M1", name: "Medical 1", level: "low", occupancy: 15 },
    { id: "M2", name: "Medical 2", level: "low", occupancy: 20 },
    { id: "VIP1", name: "VIP Lounge", level: "medium", occupancy: 67 },
    { id: "VIP2", name: "Media Area", level: "low", occupancy: 44 },
    { id: "PS1", name: "Press Box", level: "medium", occupancy: 71 },
    { id: "T1", name: "Tunnel A", level: "high", occupancy: 82 },
    { id: "C1", name: "Corner Block 1", level: "medium", occupancy: 59 },
    { id: "C2", name: "Corner Block 2", level: "high", occupancy: 76 },
    { id: "C3", name: "Corner Block 3", level: "low", occupancy: 41 },
    { id: "C4", name: "Corner Block 4", level: "medium", occupancy: 63 },
    { id: "MR1", name: "Merchandise 1", level: "high", occupancy: 80 },
    { id: "MR2", name: "Merchandise 2", level: "medium", occupancy: 68 },
    { id: "R1", name: "Restroom N", level: "critical", occupancy: 92 },
    { id: "R2", name: "Restroom S", level: "low", occupancy: 25 },
    { id: "R3", name: "Restroom E", level: "medium", occupancy: 57 },
    { id: "R4", name: "Restroom W", level: "high", occupancy: 85 },
    { id: "SC1", name: "Security 1", level: "medium", occupancy: 60 },
    { id: "SC2", name: "Security 2", level: "low", occupancy: 30 },
    { id: "EX1", name: "Exit 1", level: "low", occupancy: 18 },
    { id: "EX2", name: "Exit 2", level: "medium", occupancy: 53 },
    { id: "EX3", name: "Exit 3", level: "high", occupancy: 78 },
    { id: "EX4", name: "Exit 4", level: "critical", occupancy: 91 },
    { id: "EL1", name: "Elevator 1", level: "low", occupancy: 29 },
    { id: "EL2", name: "Elevator 2", level: "medium", occupancy: 62 },
    { id: "EL3", name: "Elevator 3", level: "high", occupancy: 76 },
    { id: "EL4", name: "Elevator 4", level: "low", occupancy: 35 },
    { id: "ST1", name: "Stairs North", level: "medium", occupancy: 54 },
    { id: "ST2", name: "Stairs South", level: "high", occupancy: 83 },
    { id: "ST3", name: "Stairs East", level: "low", occupancy: 26 },
    { id: "ST4", name: "Stairs West", level: "critical", occupancy: 95 },
    { id: "CV1", name: "Concession 1", level: "high", occupancy: 87 },
    { id: "CV2", name: "Concession 2", level: "medium", occupancy: 66 },
    { id: "CV3", name: "Concession 3", level: "low", occupancy: 32 },
    { id: "CV4", name: "Concession 4", level: "medium", occupancy: 72 },
    { id: "LO1", name: "Lounge A", level: "low", occupancy: 40 }
  ],

  // Transport options
  transport: [
    {
      type: "metro",
      name: "Metro Line 3",
      icon: "🚇",
      eta: "8 min",
      crowdLevel: "medium",
      cost: "$4.50",
      traffic: "Good",
      route: "Stadium Station → MetLife",
      frequency: "Every 3 min",
      recommended: true,
      color: "#00d4ff"
    },
    {
      type: "bus",
      name: "Express Bus 217",
      icon: "🚌",
      eta: "15 min",
      crowdLevel: "low",
      cost: "$2.75",
      traffic: "Light",
      route: "Downtown Hub → MetLife",
      frequency: "Every 8 min",
      recommended: false,
      color: "#00ff88"
    },
    {
      type: "taxi",
      name: "Taxi / Cab",
      icon: "🚕",
      eta: "22 min",
      crowdLevel: "low",
      cost: "$18–25",
      traffic: "Moderate",
      route: "Your Location → MetLife",
      frequency: "On-demand",
      recommended: false,
      color: "#ffd700"
    },
    {
      type: "rideshare",
      name: "Uber / Lyft",
      icon: "🚗",
      eta: "12 min",
      crowdLevel: "high",
      cost: "$15–20",
      traffic: "Heavy near stadium",
      route: "Your Location → Drop Zone C",
      frequency: "On-demand",
      recommended: false,
      color: "#a855f7"
    },
    {
      type: "walk",
      name: "Walking Route",
      icon: "🚶",
      eta: "35 min",
      crowdLevel: "low",
      cost: "Free",
      traffic: "No traffic",
      route: "Riverside Park → MetLife",
      frequency: "Anytime",
      recommended: false,
      color: "#ff6b35"
    },
    {
      type: "parking",
      name: "Drive & Park",
      icon: "🅿️",
      eta: "Available: Lot C (34%)",
      crowdLevel: "medium",
      cost: "$35",
      traffic: "Heavy on I-95",
      route: "Lot C → Gate B",
      frequency: "Limited spaces",
      recommended: false,
      color: "#8ba3c4"
    }
  ],

  // Analytics data
  analytics: {
    crowdTrend: {
      labels: ["06:00","08:00","10:00","12:00","14:00","16:00","18:00","20:00","22:00"],
      data: [2100, 8400, 18700, 32500, 48200, 61800, 71200, 71243, 65000]
    },
    entryPrediction: {
      labels: ["Now","30m","1h","2h","3h","4h"],
      data: [71243, 72800, 73200, 72000, 68000, 55000]
    },
    peakHours: {
      labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
      data: [45000, 52000, 61000, 58000, 71000, 82500, 77000]
    },
    gateUsage: {
      labels: ["Gate A","Gate B","Gate C","Gate D","Gate E","Gate F"],
      data: [84, 22, 55, 96, 73, 61]
    },
    transportUsage: {
      labels: ["Metro","Bus","Taxi","Rideshare","Walk","Car"],
      data: [38, 22, 12, 18, 6, 4]
    },
    foodDemand: {
      labels: ["Burgers","Pizza","Hot Dogs","Drinks","Snacks","Vegan"],
      data: [28, 22, 18, 45, 35, 12]
    },
    waterConsumption: {
      labels: ["06h","09h","12h","15h","18h","21h"],
      data: [120, 380, 920, 1240, 1680, 1420]
    },
    emergencyIncidents: {
      labels: ["Medical","Security","Lost Child","Fire","Lost Item","Evacuation"],
      data: [8, 3, 5, 0, 12, 0]
    },
    volunteerPerf: {
      labels: ["Gate A","Gate B","Gate C","Medical","Parking","Info"],
      data: [92, 88, 95, 97, 84, 90]
    }
  },

  // Sustainability data
  sustainability: {
    carbonSaved: 42.7,
    carbonUnit: "tonnes CO₂",
    publicTransportUsage: 76,
    waterRefillStations: 48,
    wasteRecycled: 68,
    energyFromRenewable: 54,
    greenScore: 81,
    solarPanels: 3200,
    evChargingPoints: 85,
    waterSaved: 128000
  },

  // Notifications
  notifications: [
    { id: 1, type: "warning", icon: "⚠️", title: "Gate D Congestion", msg: "Gate D at 96% capacity. Use Gate B or F.", time: "2 min ago", unread: true, color: "yellow" },
    { id: 2, type: "info", icon: "🚇", title: "Metro Delay", msg: "Metro Line 3 delayed 5 min. Next train: 8 mins.", time: "5 min ago", unread: true, color: "blue" },
    { id: 3, type: "success", icon: "⚽", title: "Match Reminder", msg: "BRA vs ARG kicks off in 45 minutes!", time: "10 min ago", unread: true, color: "green" },
    { id: 4, type: "error", icon: "🔴", title: "Weather Alert", msg: "Thunderstorm possible after 22:00. Be prepared.", time: "18 min ago", unread: false, color: "red" },
    { id: 5, type: "info", icon: "🎫", title: "Seat Reminder", msg: "Your seat is Block C, Row 12, Seat 4.", time: "25 min ago", unread: false, color: "blue" },
    { id: 6, type: "warning", icon: "🅿️", title: "Parking Update", msg: "Lot A full. Lot C has 34% availability.", time: "30 min ago", unread: false, color: "yellow" },
    { id: 7, type: "info", icon: "🍔", title: "Food AI Pick", msg: "Try Stand 7 – only 3 min queue right now!", time: "40 min ago", unread: false, color: "blue" },
    { id: 8, type: "success", icon: "♻️", title: "Green Milestone", msg: "Stadium hit 80+ Green Score today!", time: "1 hr ago", unread: false, color: "green" },
    { id: 9, type: "warning", icon: "🔐", title: "Security Alert", msg: "Enhanced screening at Gate A. Allow extra time.", time: "1.5 hr ago", unread: false, color: "yellow" },
    { id: 10, type: "info", icon: "🌤️", title: "Weather Update", msg: "Current: 28°C, Partly Cloudy. UV Index: 7.", time: "2 hr ago", unread: false, color: "blue" }
  ],

  // Volunteers
  volunteers: [
    { id: "V001", name: "Alex Johnson", zone: "Gate A", tasks: 8, completed: 6, status: "active", lang: "EN/ES", avatar: "AJ" },
    { id: "V002", name: "Maria Garcia", zone: "Medical Bay", tasks: 5, completed: 5, status: "active", lang: "ES/PT", avatar: "MG" },
    { id: "V003", name: "Yuki Tanaka", zone: "Section C", tasks: 12, completed: 9, status: "busy", lang: "JA/EN", avatar: "YT" },
    { id: "V004", name: "Omar Hassan", zone: "Parking B", tasks: 7, completed: 4, status: "active", lang: "AR/FR", avatar: "OH" },
    { id: "V005", name: "Sarah Chen", zone: "Info Desk", tasks: 15, completed: 13, status: "active", lang: "ZH/EN", avatar: "SC" },
    { id: "V006", name: "Luca Ferrari", zone: "Gate D", tasks: 9, completed: 7, status: "break", lang: "IT/EN", avatar: "LF" }
  ],

  // Organizer KPIs
  organizer: {
    attendance: { value: 71243, max: 82500, change: "+4.2%" },
    crowdDensity: { value: 86, unit: "%", change: "+2%" },
    gateOccupancy: { avg: 71, hotspot: "Gate D (96%)" },
    transportLoad: { metro: 76, bus: 22, rideshare: 18 },
    foodDemand: { topItem: "Beverages", revenue: 218400 },
    securityAlerts: { active: 3, resolved: 12 },
    energyUsage: { value: 2840, unit: "kWh", solar: 54 },
    medicalIncidents: { active: 2, total: 8 },
    wasteGenerated: { value: 4.8, unit: "tonnes", recycled: 68 },
    revenueEstimate: { value: 12400000, concessions: 1850000 }
  },

  // AI Chat responses
  aiResponses: {
    seat: "Your seat is in **Block C, Row 12, Seat 4**. From Gate B, take the escalator to Level 2, turn left, and proceed 40m. Estimated walk: 3 minutes. 🗺️",
    gate: "**Gate B** is currently at 22% capacity — it's the least crowded option! Head north from the main plaza and follow the blue pathway signs. Distance: ~180m from the info kiosk.",
    food: "The nearest food courts are:\n• **Food Court 3** (Level 1, North Stand) – Queue: ~3 min\n• **Stand 7** (Level 2, Section C) – Queue: ~5 min ✅ Recommended\n• **Food Court 1** (Level 1, East Gate) – Queue: ~12 min (busy)\n\nAI Tip: Visit Stand 7 for the fastest service right now!",
    restroom: "Nearest restrooms:\n• **Restroom B** – Level 1, 50m east of your current location\n• **Restroom E** – Level 2, near Section D5\n\nNote: Restroom N is currently at 92% capacity. Use Restroom S for shorter wait times.",
    medical: "🚨 **Medical emergency? Dial 911 first!**\n\nNearest Medical Rooms:\n• **Medical Bay 1** – Level 1, Section B Gate (2 min walk)\n• **Medical Bay 2** – Level 3, East Stand\n\nSecurity escorts are available. Alert the nearest volunteer wearing a red vest.",
    wheelchair: "♿ **Wheelchair accessible routes:**\n• All main concourses are wheelchair-friendly\n• Use Elevator 1 or 3 (near Gates A and C)\n• Dedicated viewing areas: Block H, Rows 1–3\n• Priority restrooms: Near Gate B and Gate E\n\nNeed assistance? Press the blue button on this screen.",
    parking: "🅿️ **Current parking status:**\n• Lot A: FULL 🔴\n• Lot B: 87% 🟠\n• Lot C: 34% 🟢 ← Recommended\n• Lot D: 56% 🟡\n\nNavigate to **Lot C via Exit 12** on I-95N. Estimated drive: 8 min from downtown.",
    transport: "🚇 **Best option right now: Metro Line 3**\n• Next train: 8 minutes\n• Crowd level: Medium\n• Cost: $4.50\n• No traffic delays!\n\nAlternative: Express Bus 217 departs in 15 min from Bay 4.",
    schedule: "📅 **Today's matches:**\n• 17:00 – France 2:1 England (SoFi Stadium) 🔴 LIVE - 67'\n• 20:00 – Brazil vs Argentina (MetLife Stadium) ⚽ Upcoming\n\n**Tomorrow:**\n• 14:00 – Morocco vs USA (Rose Bowl)\n• 20:00 – Semi-Final TBD",
    default: "I'm the FIFA AI MatchMate Assistant! I can help you with:\n\n🪑 **Seat & Navigation** – Find your seat or any location\n🚪 **Gates & Entry** – Least crowded gates\n🍔 **Food & Drinks** – Best stalls with short queues\n🚇 **Transport** – Best route to/from stadium\n🚑 **Emergency** – Medical, fire, security\n♿ **Accessibility** – Wheelchair routes & elevators\n🎫 **Match Info** – Schedules, scores, teams\n\nJust ask me anything! ⚽"
  },

  // Languages
  languages: [
    { code: "en", name: "English", flag: "🇺🇸", native: "English" },
    { code: "es", name: "Spanish", flag: "🇪🇸", native: "Español" },
    { code: "fr", name: "French", flag: "🇫🇷", native: "Français" },
    { code: "pt", name: "Portuguese", flag: "🇧🇷", native: "Português" },
    { code: "hi", name: "Hindi", flag: "🇮🇳", native: "हिन्दी" },
    { code: "ar", name: "Arabic", flag: "🇸🇦", native: "العربية" },
    { code: "de", name: "German", flag: "🇩🇪", native: "Deutsch" },
    { code: "ja", name: "Japanese", flag: "🇯🇵", native: "日本語" }
  ]
};

// Simulated real-time updates
function getRandomVariation(base, percent = 5) {
  const variation = base * (percent / 100);
  return Math.round(base + (Math.random() - 0.5) * 2 * variation);
}

function updateCrowdData() {
  DEMO_DATA.crowdZones.forEach(zone => {
    zone.occupancy = Math.min(99, Math.max(5, getRandomVariation(zone.occupancy, 3)));
    if (zone.occupancy < 40) zone.level = "low";
    else if (zone.occupancy < 70) zone.level = "medium";
    else if (zone.occupancy < 90) zone.level = "high";
    else zone.level = "critical";
  });
}

// Export
window.DEMO_DATA = DEMO_DATA;
window.updateCrowdData = updateCrowdData;
