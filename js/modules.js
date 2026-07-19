// ============================================
// FIFA AI MATCHMATE - ALL DASHBOARD MODULES
// ============================================

// =====================
// OVERVIEW MODULE
// =====================
const OverviewModule = {
  init() {
    this.renderStats();
    this.startLiveUpdates();
  },

  renderStats() {
    const s = DEMO_DATA.stadium;
    const stats = [
      { id: 'ov-capacity', value: s.capacity, suffix: '' },
      { id: 'ov-crowd', value: s.currentCrowd, suffix: '' },
      { id: 'ov-gates', value: s.gates, suffix: '' },
      { id: 'ov-ai', value: s.aiRecommendations, suffix: '' }
    ];
    stats.forEach(({ id, value, suffix }) => {
      const el = document.getElementById(id);
      if (el) animateCounter(el, value, 1500, suffix);
    });
  },

  startLiveUpdates() {
    // Simulate live crowd changes
    setInterval(() => {
      const crowdEl = document.getElementById('ov-crowd');
      if (crowdEl) {
        const current = parseInt(crowdEl.textContent.replace(/,/g, ''));
        const delta = Math.floor(Math.random() * 100) - 30;
        DEMO_DATA.stadium.currentCrowd = Math.max(70000, Math.min(82500, current + delta));
        animateCounter(crowdEl, DEMO_DATA.stadium.currentCrowd, 500);
      }
    }, 5000);
  }
};

// =====================
// AI CHATBOT MODULE
// =====================
const ChatbotModule = {
  conversationHistory: [],
  isListening: false,
  isSpeaking: false,
  recognition: null,
  synthesis: window.speechSynthesis,

  init() {
    this.setupEventListeners();
    this.renderSuggestions();
    if (!this.conversationHistory.length) {
      this.addMessage('ai', DEMO_DATA.aiResponses.default);
    }
  },

  setupEventListeners() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const voiceBtn = document.getElementById('chat-voice');
    const clearBtn = document.getElementById('chat-clear');

    if (sendBtn) sendBtn.addEventListener('click', () => this.sendMessage());
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.sendMessage(); }
      });
      input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 120) + 'px';
      });
    }
    if (voiceBtn) voiceBtn.addEventListener('click', () => this.toggleVoice());
    if (clearBtn) clearBtn.addEventListener('click', () => this.clearConversation());
  },

  renderSuggestions() {
    const container = document.getElementById('chat-suggestions');
    if (!container) return;
    const suggestions = [
      "📍 Where is my seat?",
      "🚪 Least crowded gate?",
      "🍔 Nearest food court?",
      "🚻 Where are restrooms?",
      "🚑 Medical emergency?",
      "♿ Wheelchair routes?",
      "🅿️ Parking availability?",
      "🚇 Best transport option?",
      "📅 Today's match schedule?",
      "🏆 Team information?",
      "🛍️ Merchandise stores?",
      "🔍 Lost and found?"
    ];
    container.innerHTML = suggestions.map(s => `
      <button class="suggestion-chip" onclick="ChatbotModule.quickAsk('${s.replace(/'/g, "\\'")}')">${s}</button>
    `).join('');
  },

  quickAsk(question) {
    const input = document.getElementById('chat-input');
    if (input) input.value = question;
    this.sendMessage();
  },

  sendMessage() {
    const input = document.getElementById('chat-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    this.addMessage('user', text);
    input.value = '';
    input.style.height = 'auto';

    this.showTyping();
    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      this.hideTyping();
      const response = this.getAIResponse(text);
      this.addMessage('ai', response);
      if (this.isSpeaking || document.getElementById('voice-response-toggle')?.checked) {
        this.speak(response.replace(/\*\*/g, '').replace(/\n/g, '. ').replace(/[🚇🚌🚕🚗🚶🅿️📅🏆🛍️🔍🚪🍔🚻🚑♿📍⚽🚨💡✅⚠️]/gu, ''));
      }
    }, delay);
  },

  getAIResponse(text) {
    const t = text.toLowerCase();
    const r = DEMO_DATA.aiResponses;
    if (t.includes('seat') || t.includes('block') || t.includes('row')) return r.seat;
    if (t.includes('gate') || t.includes('entrance') || t.includes('entry')) return r.gate;
    if (t.includes('food') || t.includes('eat') || t.includes('restaurant') || t.includes('burger') || t.includes('court')) return r.food;
    if (t.includes('restroom') || t.includes('toilet') || t.includes('bathroom') || t.includes('wc')) return r.restroom;
    if (t.includes('medical') || t.includes('emergency') || t.includes('ambulance') || t.includes('doctor')) return r.medical;
    if (t.includes('wheelchair') || t.includes('accessible') || t.includes('disabled') || t.includes('accessibility')) return r.wheelchair;
    if (t.includes('parking') || t.includes('park') || t.includes('lot')) return r.parking;
    if (t.includes('transport') || t.includes('metro') || t.includes('bus') || t.includes('taxi') || t.includes('uber')) return r.transport;
    if (t.includes('schedule') || t.includes('match') || t.includes('game') || t.includes('kickoff')) return r.schedule;
    if (t.includes('team') || t.includes('player') || t.includes('squad')) return this.getTeamInfo(t);
    if (t.includes('lost') || t.includes('found') || t.includes('missing')) return "🔍 **Lost & Found Center** is located at Gate A, Level 1 (Info Desk). Operating hours: 2 hours before kickoff to 1 hour after the final whistle.\n\nYou can also report lost items:\n• Via this app (Profile → Report Lost Item)\n• Security desk at any gate\n• Call: +1-855-FIFA-HELP";
    if (t.includes('merchandise') || t.includes('shop') || t.includes('store') || t.includes('jersey')) return "🛍️ **Official FIFA Merchandise Stores:**\n• Main Store – Gate A, Level 1 (Queue: ~8 min)\n• Express Store – Gate C, Level 2 (Queue: ~3 min) ✅ Recommended\n• Pop-up Store – Section E concourse\n\nAI Tip: Visit the Gate C store now – shortest queue!";
    if (t.includes('hello') || t.includes('hi') || t.includes('hey')) return "Hello! 👋 Welcome to FIFA World Cup 2026 at MetLife Stadium! I'm your AI MatchMate assistant, ready to make your experience unforgettable.\n\nHow can I help you today? ⚽";
    if (t.includes('thank')) return "You're welcome! 🎉 Enjoy the match! If you need anything else, I'm always here to help. Go enjoy the beautiful game! ⚽🏆";
    return r.default;
  },

  getTeamInfo(text) {
    const teams = {
      brazil: "🇧🇷 **Brazil**\n• FIFA Ranking: #1\n• Coach: Dorival Júnior\n• Key Players: Vinicius Jr., Rodrygo, Endrick\n• Formation: 4-2-3-1\n• Top scorer (WC26): Vinicius Jr. (3 goals)",
      argentina: "🇦🇷 **Argentina** (Defending Champion)\n• FIFA Ranking: #2\n• Coach: Lionel Scaloni\n• Key Players: Messi, Di María, Álvarez\n• Formation: 4-4-2 diamond\n• Top scorer (WC26): Messi (4 goals)",
      france: "🇫🇷 **France**\n• FIFA Ranking: #3\n• Coach: Didier Deschamps\n• Key Players: Mbappé, Griezmann, Camavinga\n• Formation: 4-3-3\n• Top scorer (WC26): Mbappé (5 goals)",
      england: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 **England**\n• FIFA Ranking: #4\n• Coach: Gareth Southgate\n• Key Players: Bellingham, Saka, Foden\n• Formation: 4-3-3\n• Top scorer (WC26): Bellingham (3 goals)"
    };
    for (const [key, info] of Object.entries(teams)) {
      if (text.includes(key)) return info;
    }
    return "⚽ **World Cup 2026 Teams**\n• 48 teams qualified (expanded format)\n• 16 groups → Knockout from Round of 32\n• Hosts: USA 🇺🇸, Canada 🇨🇦, Mexico 🇲🇽\n\nAsk about a specific team for details! Try: 'Tell me about Brazil' or 'France team info'";
  },

  addMessage(role, text) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const isUser = role === 'user';
    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');

    const msg = document.createElement('div');
    msg.className = `chat-message ${isUser ? 'user-message' : ''}`;
    msg.innerHTML = `
      <div class="chat-avatar ${role}">${isUser ? '👤' : '🤖'}</div>
      <div>
        <div class="chat-bubble ${role}">${formattedText}</div>
        <div class="chat-time">${time}</div>
      </div>
    `;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;

    this.conversationHistory.push({ role, text, time });
  },

  showTyping() {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    const typing = document.createElement('div');
    typing.className = 'chat-message';
    typing.id = 'typing-indicator';
    typing.innerHTML = `
      <div class="chat-avatar ai">🤖</div>
      <div class="chat-bubble ai">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
  },

  hideTyping() {
    document.getElementById('typing-indicator')?.remove();
  },

  toggleVoice() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      Toast.show('Voice Not Supported', 'Your browser does not support voice input.', 'yellow');
      return;
    }
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  },

  startListening() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SR();
    this.recognition.lang = 'en-US';
    this.recognition.continuous = false;
    this.recognition.interimResults = true;

    this.recognition.onstart = () => {
      this.isListening = true;
      document.getElementById('chat-voice')?.classList.add('active');
      Toast.show('Listening...', 'Speak your question', 'blue', 3000);
    };

    this.recognition.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
      const input = document.getElementById('chat-input');
      if (input) input.value = transcript;
      if (e.results[e.results.length - 1].isFinal) {
        this.stopListening();
        setTimeout(() => this.sendMessage(), 300);
      }
    };

    this.recognition.onerror = () => this.stopListening();
    this.recognition.onend = () => this.stopListening();
    this.recognition.start();
  },

  stopListening() {
    this.isListening = false;
    document.getElementById('chat-voice')?.classList.remove('active');
    this.recognition?.stop();
  },

  speak(text) {
    if (!this.synthesis) return;
    this.synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.substring(0, 300));
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.lang = 'en-US';
    this.synthesis.speak(utterance);
  },

  clearConversation() {
    const container = document.getElementById('chat-messages');
    if (container) container.innerHTML = '';
    this.conversationHistory = [];
    this.addMessage('ai', DEMO_DATA.aiResponses.default);
  }
};

// =====================
// CROWD MODULE
// =====================
const CrowdModule = {
  interval: null,

  init() {
    this.renderHeatmap();
    this.renderAlerts();
    this.renderGateOccupancy();
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      updateCrowdData();
      this.renderHeatmap();
      this.updateStats();
    }, 4000);
  },

  renderHeatmap() {
    const container = document.getElementById('crowd-heatmap');
    if (!container) return;
    container.innerHTML = DEMO_DATA.crowdZones.map(z => `
      <div class="heatmap-cell heatmap-${z.level}"
           data-label="${z.name}: ${z.occupancy}%"
           title="${z.name}: ${z.occupancy}% (${z.level.toUpperCase()})"
           onclick="CrowdModule.showZoneDetail('${z.id}')">
      </div>
    `).join('');
  },

  updateStats() {
    const zones = DEMO_DATA.crowdZones;
    const avg = Math.round(zones.reduce((s, z) => s + z.occupancy, 0) / zones.length);
    const critical = zones.filter(z => z.level === 'critical').length;
    const el = document.getElementById('crowd-avg');
    const critEl = document.getElementById('crowd-critical-count');
    if (el) el.textContent = avg + '%';
    if (critEl) critEl.textContent = critical;
  },

  renderAlerts() {
    const container = document.getElementById('crowd-alerts');
    if (!container) return;
    const criticalZones = DEMO_DATA.crowdZones.filter(z => z.level === 'critical' || z.level === 'high').slice(0, 5);
    container.innerHTML = criticalZones.map(z => `
      <div class="notif-item ${z.level === 'critical' ? 'unread' : ''}">
        <div class="notif-icon ${z.level === 'critical' ? 'icon-wrap-purple' : 'icon-wrap-yellow'} icon-wrap">
          ${z.level === 'critical' ? '🔴' : '🟠'}
        </div>
        <div class="notif-content">
          <div class="notif-title">${z.name}</div>
          <div class="notif-msg">${z.occupancy}% occupancy — ${z.level === 'critical' ? 'Consider alternative routes' : 'Moderate congestion'}</div>
          <div class="notif-time">Updated just now</div>
        </div>
        ${getCrowdBadge(z.level)}
      </div>
    `).join('');
  },

  renderGateOccupancy() {
    const container = document.getElementById('gate-occupancy-list');
    if (!container) return;
    const gates = DEMO_DATA.crowdZones.filter(z => z.id.startsWith('G'));
    container.innerHTML = gates.map(g => `
      <div style="margin-bottom:0.875rem">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.3rem">
          <span style="font-size:0.85rem;font-weight:600">${g.name}</span>
          <span style="font-size:0.82rem;color:var(--color-text-secondary)">${g.occupancy}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${g.occupancy}%;background:${
            g.level === 'critical' ? 'linear-gradient(90deg,#a855f7,#7c3aed)' :
            g.level === 'high' ? 'linear-gradient(90deg,#ff6b35,#ff4757)' :
            g.level === 'medium' ? 'linear-gradient(90deg,#ffd700,#ff9500)' :
            'linear-gradient(90deg,#00ff88,#00d4ff)'
          }"></div>
        </div>
      </div>
    `).join('');
  },

  showZoneDetail(id) {
    const zone = DEMO_DATA.crowdZones.find(z => z.id === id);
    if (!zone) return;
    Toast.show(zone.name, `Occupancy: ${zone.occupancy}% (${zone.level.toUpperCase()}) | AI: ${zone.level === 'critical' ? 'Route around this area' : zone.level === 'high' ? 'Expect delays' : 'Moving freely'}`, zone.level === 'critical' ? 'red' : zone.level === 'high' ? 'yellow' : 'green');
  }
};

// =====================
// TRANSPORT MODULE
// =====================
const TransportModule = {
  init() {
    this.renderTransportCards();
    this.renderTrafficMap();
  },

  renderTransportCards() {
    const container = document.getElementById('transport-list');
    if (!container) return;
    container.innerHTML = DEMO_DATA.transport.map((t, i) => `
      <div class="transport-card ${t.recommended ? 'recommended' : ''}" style="animation-delay:${i * 0.05}s">
        <div class="transport-icon" style="background:${t.color}22;border:1px solid ${t.color}44;font-size:1.6rem">${t.icon}</div>
        <div class="transport-info">
          <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.3rem">
            <div class="transport-name">${t.name}</div>
            ${t.recommended ? '<span class="badge badge-green">⭐ Recommended</span>' : ''}
          </div>
          <div class="transport-details">
            <div class="transport-detail-item">⏱️ ${t.eta}</div>
            <div class="transport-detail-item">💰 ${t.cost}</div>
            <div class="transport-detail-item">🚦 ${t.traffic}</div>
            <div class="transport-detail-item">${getCrowdBadge(t.crowdLevel)}</div>
          </div>
          <div style="font-size:0.78rem;color:var(--color-text-muted);margin-top:0.35rem">📍 ${t.route}</div>
        </div>
        <button class="btn btn-sm btn-outline" onclick="TransportModule.selectTransport('${t.type}')">Select</button>
      </div>
    `).join('');
  },

  renderTrafficMap() {
    const container = document.getElementById('traffic-map');
    if (!container) return;
    container.innerHTML = `
      <div style="background:rgba(0,212,255,0.04);border:1px solid var(--color-border);border-radius:var(--radius-lg);height:280px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden">
        <div style="position:absolute;inset:0;opacity:0.05;background-image:repeating-linear-gradient(0deg,#00d4ff 0px,transparent 1px,transparent 30px),repeating-linear-gradient(90deg,#00d4ff 0px,transparent 1px,transparent 30px)"></div>
        <svg width="100%" height="100%" viewBox="0 0 400 280" style="position:absolute;inset:0">
          <!-- Roads -->
          <line x1="0" y1="140" x2="400" y2="140" stroke="#ffd700" stroke-width="3" opacity="0.6"/>
          <line x1="200" y1="0" x2="200" y2="280" stroke="#ffd700" stroke-width="3" opacity="0.6"/>
          <line x1="0" y1="70" x2="400" y2="210" stroke="#ff6b35" stroke-width="2" opacity="0.4"/>
          <!-- Stadium -->
          <ellipse cx="200" cy="140" rx="50" ry="35" fill="rgba(0,212,255,0.15)" stroke="#00d4ff" stroke-width="2"/>
          <text x="200" y="145" text-anchor="middle" fill="#00d4ff" font-size="10" font-weight="700">🏟️ STADIUM</text>
          <!-- Transport icons -->
          <text x="40" y="125" font-size="18">🚇</text>
          <text x="340" y="125" font-size="18">🚌</text>
          <text x="180" y="40" font-size="18">🚗</text>
          <text x="180" y="250" font-size="18">🅿️</text>
          <!-- Congestion indicators -->
          <circle cx="90" cy="140" r="8" fill="rgba(255,107,53,0.7)" class="animate-pulse"/>
          <circle cx="310" cy="140" r="6" fill="rgba(0,255,136,0.7)" class="animate-pulse"/>
          <circle cx="200" cy="90" r="9" fill="rgba(255,71,87,0.7)" class="animate-pulse"/>
        </svg>
        <div style="position:absolute;bottom:0.75rem;left:0.75rem;display:flex;gap:0.5rem;flex-wrap:wrap">
          <span style="font-size:0.7rem;background:rgba(0,0,0,0.6);padding:0.2rem 0.5rem;border-radius:4px;color:var(--color-neon-green)">🟢 Light</span>
          <span style="font-size:0.7rem;background:rgba(0,0,0,0.6);padding:0.2rem 0.5rem;border-radius:4px;color:var(--color-neon-yellow)">🟡 Moderate</span>
          <span style="font-size:0.7rem;background:rgba(0,0,0,0.6);padding:0.2rem 0.5rem;border-radius:4px;color:var(--color-neon-red)">🔴 Heavy</span>
        </div>
      </div>
    `;
  },

  selectTransport(type) {
    const t = DEMO_DATA.transport.find(x => x.type === type);
    if (t) Toast.show(`${t.icon} ${t.name} Selected`, `Estimated arrival: ${t.eta} | Cost: ${t.cost}`, 'green');
  }
};

// =====================
// SUSTAINABILITY MODULE
// =====================
const SustainabilityModule = {
  init() {
    this.renderGauges();
    this.renderStats();
    this.renderRecommendations();
  },

  renderGauges() {
    const s = DEMO_DATA.sustainability;
    const gauges = [
      { id: 'gauge-green', value: s.greenScore, label: 'Green Score', color: '#00ff88' },
      { id: 'gauge-transport', value: s.publicTransportUsage, label: 'Public Transport', color: '#00d4ff' },
      { id: 'gauge-recycled', value: s.wasteRecycled, label: 'Waste Recycled', color: '#a855f7' },
      { id: 'gauge-energy', value: s.energyFromRenewable, label: 'Renewable Energy', color: '#ffd700' }
    ];

    gauges.forEach(g => {
      const container = document.getElementById(g.id);
      if (!container) return;
      const r = 50;
      const circ = 2 * Math.PI * r;
      const dash = (g.value / 100) * circ;
      container.innerHTML = `
        <div class="gauge-circle">
          <svg class="gauge-svg" viewBox="0 0 120 120">
            <circle class="gauge-track" cx="60" cy="60" r="${r}"/>
            <circle class="gauge-fill" cx="60" cy="60" r="${r}"
              stroke="${g.color}"
              stroke-dasharray="${dash} ${circ}"
              stroke-dashoffset="0"/>
          </svg>
          <div class="gauge-label">
            <span class="gauge-value" style="color:${g.color}">${g.value}</span>
            <span class="gauge-unit">%</span>
          </div>
        </div>
        <div style="text-align:center;font-size:0.8rem;font-weight:600;color:var(--color-text-secondary)">${g.label}</div>
      `;
    });
  },

  renderStats() {
    const s = DEMO_DATA.sustainability;
    const statsEl = document.getElementById('sustain-stats');
    if (!statsEl) return;
    statsEl.innerHTML = `
      <div class="card card-glow-green" style="padding:1rem">
        <div style="font-size:1.5rem;font-weight:800;color:var(--color-neon-green)">${s.carbonSaved} t</div>
        <div style="font-size:0.75rem;color:var(--color-text-muted)">CO₂ Saved vs Baseline</div>
      </div>
      <div class="card" style="padding:1rem">
        <div style="font-size:1.5rem;font-weight:800;color:var(--color-neon-blue)">${s.waterRefillStations}</div>
        <div style="font-size:0.75rem;color:var(--color-text-muted)">Water Refill Stations</div>
      </div>
      <div class="card" style="padding:1rem">
        <div style="font-size:1.5rem;font-weight:800;color:var(--color-neon-yellow)">${s.solarPanels.toLocaleString()}</div>
        <div style="font-size:0.75rem;color:var(--color-text-muted)">Solar Panels Active</div>
      </div>
      <div class="card" style="padding:1rem">
        <div style="font-size:1.5rem;font-weight:800;color:var(--color-neon-purple)">${s.evChargingPoints}</div>
        <div style="font-size:0.75rem;color:var(--color-text-muted)">EV Charging Points</div>
      </div>
    `;
  },

  renderRecommendations() {
    const container = document.getElementById('sustain-recs');
    if (!container) return;
    const recs = [
      { icon: '🚇', tip: 'Take Metro Line 3 – saves 2.4kg CO₂ vs driving', impact: 'High' },
      { icon: '💧', tip: 'Use refill stations – 14,000 plastic bottles prevented today', impact: 'High' },
      { icon: '♻️', tip: 'Sort waste at bin stations for 68% recycling rate', impact: 'Medium' },
      { icon: '🌱', tip: 'Choose plant-based meals – 60% lower carbon footprint', impact: 'Medium' },
      { icon: '⚡', tip: 'Stadium running at 54% solar power right now!', impact: 'Info' }
    ];
    container.innerHTML = recs.map(r => `
      <div class="notif-item">
        <div style="font-size:1.5rem">${r.icon}</div>
        <div style="flex:1">
          <div style="font-size:0.85rem;font-weight:500">${r.tip}</div>
          <div style="font-size:0.72rem;color:var(--color-neon-green);margin-top:0.2rem">Impact: ${r.impact}</div>
        </div>
      </div>
    `).join('');
  }
};

// =====================
// MATCH MODULE
// =====================
const MatchModule = {
  init() {
    this.renderMatches();
    this.startLiveMatch();
  },

  renderMatches() {
    const container = document.getElementById('matches-grid');
    if (!container) return;
    container.innerHTML = DEMO_DATA.matches.map(m => {
      const matchDate = new Date(m.date);
      const isLive = m.status === 'live';
      const isDone = m.status === 'finished';
      return `
        <div class="match-card ${isLive ? 'card-glow-blue' : ''}">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem">
            <span class="badge ${isLive ? 'badge-red' : isDone ? 'badge-blue' : 'badge-green'}">${isLive ? '🔴 LIVE' : isDone ? '✅ FINAL' : '📅 UPCOMING'}</span>
            <span class="badge badge-blue">${m.group}</span>
          </div>
          <div class="match-teams">
            <div class="match-team">
              <div class="match-team-flag">${m.team1.flag}</div>
              <div class="match-team-name">${m.team1.name}</div>
            </div>
            <div style="text-align:center">
              ${isLive || isDone
                ? `<div class="match-score">${m.score.team1} – ${m.score.team2}</div>${isLive ? `<div style="font-size:0.75rem;color:var(--color-neon-red);font-weight:700">${m.minute}'</div>` : ''}`
                : `<div style="font-size:1.2rem;font-weight:800;color:var(--color-text-muted)">VS</div>`
              }
            </div>
            <div class="match-team">
              <div class="match-team-flag">${m.team2.flag}</div>
              <div class="match-team-name">${m.team2.name}</div>
            </div>
          </div>
          <div class="glow-line"></div>
          <div style="display:flex;justify-content:space-between;font-size:0.78rem;color:var(--color-text-muted)">
            <span>🏟️ ${m.venue}</span>
            <span>🕐 ${matchDate.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}</span>
          </div>
          <div style="font-size:0.78rem;color:var(--color-text-muted);margin-top:0.25rem">
            🌤️ ${m.weather.temp}°C ${m.weather.condition} | 💨 ${m.weather.wind}
          </div>
          ${!isDone ? `<button class="btn btn-outline btn-sm w-full" style="margin-top:1rem" onclick="MatchModule.showMatchDetail(${m.id})">View Details</button>` : ''}
        </div>
      `;
    }).join('');

    // Countdown for upcoming match
    const upcoming = DEMO_DATA.matches.find(m => m.status === 'upcoming');
    if (upcoming) startCountdown(upcoming.date, 'match-countdown');
  },

  startLiveMatch() {
    const liveMatch = DEMO_DATA.matches.find(m => m.status === 'live');
    if (!liveMatch) return;
    setInterval(() => {
      liveMatch.minute = Math.min(90, liveMatch.minute + 1);
      const minuteEls = document.querySelectorAll('[data-live-minute]');
      minuteEls.forEach(el => el.textContent = liveMatch.minute + "'");
    }, 60000);
  },

  showMatchDetail(id) {
    const match = DEMO_DATA.matches.find(m => m.id === id);
    if (match) Toast.show(`${match.team1.flag} ${match.team1.name} vs ${match.team2.flag} ${match.team2.name}`, `${match.venue} | ${new Date(match.date).toLocaleDateString()}`, 'blue');
  }
};

// =====================
// ORGANIZER MODULE
// =====================
const OrganizerModule = {
  init() {
    this.renderKPIs();
    setTimeout(() => Charts.initAll(), 200);
  },

  renderKPIs() {
    const o = DEMO_DATA.organizer;
    const s = DEMO_DATA.stadium;
    const kpis = [
      { id: 'org-attend', value: s.currentCrowd.toLocaleString(), label: 'Live Attendance', change: o.attendance.change, icon: '👥', color: 'blue' },
      { id: 'org-density', value: `${o.crowdDensity.value}%`, label: 'Crowd Density', change: o.crowdDensity.change, icon: '🌡️', color: 'yellow' },
      { id: 'org-alerts', value: o.securityAlerts.active, label: 'Active Alerts', change: '-2', icon: '🔐', color: 'red' },
      { id: 'org-revenue', value: formatCurrency(o.revenueEstimate.value), label: 'Revenue Est.', change: '+8.3%', icon: '💰', color: 'green' },
      { id: 'org-medical', value: o.medicalIncidents.active, label: 'Medical Active', change: o.medicalIncidents.total + ' total', icon: '🏥', color: 'red' },
      { id: 'org-energy', value: `${o.energyUsage.value}kWh`, label: 'Energy Usage', change: `${o.energyUsage.solar}% solar`, icon: '⚡', color: 'yellow' },
      { id: 'org-waste', value: `${o.wasteGenerated.value}t`, label: 'Waste Generated', change: `${o.wasteGenerated.recycled}% recycled`, icon: '♻️', color: 'green' },
      { id: 'org-food', value: formatCurrency(o.foodDemand.revenue), label: 'Food Revenue', change: o.foodDemand.topItem, icon: '🍔', color: 'purple' }
    ];
    kpis.forEach(k => {
      const container = document.getElementById(k.id);
      if (!container) return;
      container.innerHTML = `
        <div class="stat-card-dash">
          <div class="stat-card-head">
            <div class="stat-card-label">${k.label}</div>
            <div class="stat-card-icon-wrap icon-wrap-${k.color}">${k.icon}</div>
          </div>
          <div class="stat-card-val text-neon-${k.color === 'blue' ? 'blue' : k.color === 'green' ? 'green' : k.color === 'purple' ? 'purple' : k.color === 'yellow' ? 'yellow' : 'red'}">${k.value}</div>
          <div class="stat-card-change up">${k.change}</div>
        </div>
      `;
    });
  }
};

// =====================
// NOTIFICATIONS MODULE
// =====================
const NotificationsModule = {
  init() {
    this.render();
  },
  render() {
    const container = document.getElementById('notif-list');
    if (!container) return;
    container.innerHTML = DEMO_DATA.notifications.map(n => `
      <div class="notif-item ${n.unread ? 'unread' : ''}" onclick="NotificationsModule.markRead(${n.id})">
        <div class="notif-icon icon-wrap icon-wrap-${n.color} icon-wrap-md">${n.icon}</div>
        <div class="notif-content">
          <div class="notif-title">${n.title} ${n.unread ? '<span class="badge badge-blue" style="font-size:0.6rem">NEW</span>' : ''}</div>
          <div class="notif-msg">${n.msg}</div>
          <div class="notif-time">${n.time}</div>
        </div>
      </div>
    `).join('');
  },
  markRead(id) {
    const notif = DEMO_DATA.notifications.find(n => n.id === id);
    if (notif) {
      notif.unread = false;
      this.render();
    }
  }
};

// =====================
// TRANSLATOR MODULE
// =====================
const TranslatorModule = {
  sourceLang: 'en',
  targetLang: 'es',
  synthesis: window.speechSynthesis,

  // Simulated translations
  translations: {
    'Hello, where is my seat?': {
      es: 'Hola, ¿dónde está mi asiento?',
      fr: 'Bonjour, où est mon siège ?',
      pt: 'Olá, onde é o meu assento?',
      hi: 'नमस्ते, मेरी सीट कहाँ है?',
      ar: 'مرحبا، أين مقعدي؟',
      de: 'Hallo, wo ist mein Platz?',
      ja: 'こんにちは、私の座席はどこですか？'
    },
    'default': {
      es: '[Traducción simulada al Español]',
      fr: '[Traduction simulée en Français]',
      pt: '[Tradução simulada em Português]',
      hi: '[हिन्दी में अनुवाद]',
      ar: '[ترجمة إلى العربية]',
      de: '[Übersetzung auf Deutsch]',
      ja: '[日本語への翻訳]'
    }
  },

  init() {
    this.setupListeners();
    this.updateLangSelects();
  },

  setupListeners() {
    const translateBtn = document.getElementById('translate-btn');
    const swapBtn = document.getElementById('swap-langs');
    const speakBtn = document.getElementById('speak-source');
    const speakTransBtn = document.getElementById('speak-translated');
    const copyBtn = document.getElementById('copy-translation');

    if (translateBtn) translateBtn.addEventListener('click', () => this.translate());
    if (swapBtn) swapBtn.addEventListener('click', () => this.swapLanguages());
    if (speakBtn) speakBtn.addEventListener('click', () => this.speakSource());
    if (speakTransBtn) speakTransBtn.addEventListener('click', () => this.speakTranslation());
    if (copyBtn) copyBtn.addEventListener('click', () => this.copyTranslation());
  },

  updateLangSelects() {
    ['source-lang', 'target-lang'].forEach(id => {
      const sel = document.getElementById(id);
      if (!sel) return;
      sel.innerHTML = DEMO_DATA.languages.map(l => `<option value="${l.code}">${l.flag} ${l.name}</option>`).join('');
    });
    const sl = document.getElementById('source-lang');
    const tl = document.getElementById('target-lang');
    if (sl) sl.value = this.sourceLang;
    if (tl) tl.value = this.targetLang;
    if (sl) sl.addEventListener('change', e => this.sourceLang = e.target.value);
    if (tl) tl.addEventListener('change', e => this.targetLang = e.target.value);
  },

  translate() {
    const input = document.getElementById('translate-input')?.value?.trim();
    if (!input) { Toast.show('Empty Input', 'Please type something to translate.', 'yellow'); return; }

    const btn = document.getElementById('translate-btn');
    if (btn) { btn.textContent = 'Translating...'; btn.disabled = true; }

    setTimeout(() => {
      const lookup = this.translations[input] || this.translations['default'];
      const translated = lookup[this.targetLang] || `[${input}] → ${this.targetLang.toUpperCase()} translation`;
      const output = document.getElementById('translate-output');
      if (output) output.value = translated;
      if (btn) { btn.textContent = '⚡ Translate'; btn.disabled = false; }
      Toast.show('Translation Complete!', '', 'green', 2000);
    }, 600);
  },

  swapLanguages() {
    const sl = document.getElementById('source-lang');
    const tl = document.getElementById('target-lang');
    const si = document.getElementById('translate-input');
    const so = document.getElementById('translate-output');
    if (!sl || !tl) return;
    [sl.value, tl.value] = [tl.value, sl.value];
    this.sourceLang = sl.value;
    this.targetLang = tl.value;
    if (si && so) [si.value, so.value] = [so.value, si.value];
  },

  speakSource() {
    const text = document.getElementById('translate-input')?.value;
    if (text && this.synthesis) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = this.sourceLang + '-' + this.sourceLang.toUpperCase();
      this.synthesis.speak(u);
    }
  },

  speakTranslation() {
    const text = document.getElementById('translate-output')?.value;
    if (text && this.synthesis) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = this.targetLang;
      this.synthesis.speak(u);
    }
  },

  copyTranslation() {
    const text = document.getElementById('translate-output')?.value;
    if (text) {
      navigator.clipboard?.writeText(text);
      Toast.show('Copied!', 'Translation copied to clipboard.', 'green', 2000);
    }
  }
};

// =====================
// ACCESSIBILITY MODULE
// =====================
const AccessibilityModule = {
  highContrast: false,
  largeFontMode: false,

  init() {
    this.setupButtons();
  },

  setupButtons() {
    const hcBtn = document.getElementById('toggle-high-contrast');
    const lfBtn = document.getElementById('toggle-large-font');
    if (hcBtn) hcBtn.addEventListener('click', () => this.toggleHighContrast());
    if (lfBtn) lfBtn.addEventListener('click', () => this.toggleLargeFont());
  },

  toggleHighContrast() {
    this.highContrast = !this.highContrast;
    document.body.classList.toggle('high-contrast', this.highContrast);
    Toast.show('High Contrast', this.highContrast ? 'Enabled' : 'Disabled', this.highContrast ? 'green' : 'blue');
  },

  toggleLargeFont() {
    this.largeFontMode = !this.largeFontMode;
    document.documentElement.style.fontSize = this.largeFontMode ? '20px' : '16px';
    Toast.show('Large Font Mode', this.largeFontMode ? 'Enabled' : 'Disabled', this.largeFontMode ? 'green' : 'blue');
  },

  requestEmergencyAssistance() {
    Toast.show('🚨 Emergency Assistance Requested', 'A volunteer is being dispatched to your location. Stay calm.', 'red', 8000);
  }
};

// =====================
// VOLUNTEER MODULE
// =====================
const VolunteerModule = {
  init() {
    this.renderTasks();
    this.renderTeam();
  },

  renderTasks() {
    const container = document.getElementById('volunteer-tasks');
    if (!container) return;
    const tasks = [
      { name: 'Guide fans to Gate B', location: 'Gate A → Gate B', priority: 'High', done: true },
      { name: 'Language assistance - Spanish family', location: 'Section C, Row 5', priority: 'Medium', done: true },
      { name: 'Report crowd density Gate D', location: 'Gate D Entrance', priority: 'High', done: false },
      { name: 'Escort wheelchair user to Block H', location: 'Gate E → Block H', priority: 'High', done: false },
      { name: 'Restock leaflets at info desk', location: 'Info Desk, Level 1', priority: 'Low', done: false },
      { name: 'Monitor food court queue lengths', location: 'Food Courts 1-4', priority: 'Medium', done: false }
    ];
    container.innerHTML = tasks.map((t, i) => `
      <div class="task-item">
        <div class="task-check ${t.done ? 'done' : ''}" onclick="VolunteerModule.toggleTask(this)">
          ${t.done ? '✓' : ''}
        </div>
        <div class="task-info">
          <div class="task-name" style="${t.done ? 'text-decoration:line-through;opacity:0.5' : ''}">${t.name}</div>
          <div class="task-location">📍 ${t.location}</div>
        </div>
        <span class="badge ${t.priority === 'High' ? 'badge-red' : t.priority === 'Medium' ? 'badge-yellow' : 'badge-blue'}">${t.priority}</span>
      </div>
    `).join('');
  },

  toggleTask(checkEl) {
    const isDone = !checkEl.classList.contains('done');
    checkEl.classList.toggle('done', isDone);
    checkEl.innerHTML = isDone ? '✓' : '';
    const taskName = checkEl.closest('.task-item')?.querySelector('.task-name');
    if (taskName) taskName.style.textDecoration = isDone ? 'line-through' : 'none';
    if (taskName) taskName.style.opacity = isDone ? '0.5' : '1';
    if (isDone) Toast.show('Task Complete!', taskName?.textContent, 'green', 2000);
  },

  renderTeam() {
    const container = document.getElementById('volunteer-team');
    if (!container) return;
    container.innerHTML = DEMO_DATA.volunteers.map(v => `
      <div class="task-item">
        <div style="width:38px;height:38px;border-radius:50%;background:var(--gradient-primary);display:flex;align-items:center;justify-content:center;font-weight:700;color:#050a14;font-size:0.85rem;flex-shrink:0">${v.avatar}</div>
        <div class="task-info">
          <div class="task-name">${v.name}</div>
          <div class="task-location">📍 ${v.zone} | 🌐 ${v.lang}</div>
        </div>
        <div style="text-align:right">
          <div class="badge ${v.status === 'active' ? 'badge-green' : v.status === 'busy' ? 'badge-yellow' : 'badge-blue'}">${v.status}</div>
          <div style="font-size:0.72rem;color:var(--color-text-muted);margin-top:0.25rem">${v.completed}/${v.tasks} tasks</div>
        </div>
      </div>
    `).join('');
  }
};

// =====================
// PROFILE MODULE
// =====================
const ProfileModule = {
  init() {
    this.renderProfile();
  },

  renderProfile() {
    const user = Auth.getUser();
    const nameEl = document.getElementById('profile-name');
    const emailEl = document.getElementById('profile-email');
    const avatarEl = document.getElementById('profile-avatar');
    const displayName = user.name || 'FIFA Fan';
    const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    if (nameEl) nameEl.textContent = displayName;
    if (emailEl) emailEl.textContent = user.email || 'fan@fifa2026.com';
    if (avatarEl) avatarEl.textContent = initials;
  }
};

// =====================
// EMERGENCY MODULE
// =====================
const EmergencyModule = {
  trigger(type) {
    const config = {
      medical: { title: '🚑 Medical Emergency Activated', msg: 'Medical team dispatched. Bay 1 is nearest (2 min). Stay calm.', color: 'red' },
      fire: { title: '🔥 Fire Alert Sent', msg: 'Fire services notified. Follow green EXIT signs. Do not use elevators.', color: 'red' },
      security: { title: '🔐 Security Alert', msg: 'Security team en route. Stay in your current location.', color: 'yellow' },
      child: { title: '👶 Lost Child Report', msg: 'Alert broadcast stadium-wide. Please go to Info Desk, Gate A.', color: 'yellow' },
      item: { title: '🔍 Lost Item Report', msg: 'Lost & Found team notified. Describe item at Gate A Info Desk.', color: 'blue' },
      evacuate: { title: '🚪 Evacuation Route', msg: 'Nearest exits: Gate B (22% capacity) → Parking Lot C. Follow staff.', color: 'red' }
    };
    const c = config[type];
    if (c) Toast.show(c.title, c.msg, c.color, 8000);
  }
};

// Expose all modules globally
window.ChatbotModule = ChatbotModule;
window.CrowdModule = CrowdModule;
window.TransportModule = TransportModule;
window.SustainabilityModule = SustainabilityModule;
window.MatchModule = MatchModule;
window.OrganizerModule = OrganizerModule;
window.NotificationsModule = NotificationsModule;
window.TranslatorModule = TranslatorModule;
window.AccessibilityModule = AccessibilityModule;
window.VolunteerModule = VolunteerModule;
window.ProfileModule = ProfileModule;
window.EmergencyModule = EmergencyModule;
window.OverviewModule = OverviewModule;
