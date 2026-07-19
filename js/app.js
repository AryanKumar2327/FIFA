// ============================================
// FIFA AI MATCHMATE - APP CORE (Router + Utils)
// ============================================

// ---- Auth State ----
const Auth = {
  isLoggedIn() {
    return localStorage.getItem('fifa_auth') !== null;
  },
  getUser() {
    try {
      return JSON.parse(localStorage.getItem('fifa_auth')) || {};
    } catch { return {}; }
  },
  login(userData) {
    localStorage.setItem('fifa_auth', JSON.stringify(userData));
  },
  logout() {
    localStorage.removeItem('fifa_auth');
    window.location.href = 'index.html';
  }
};

// ---- Toast System ----
const Toast = {
  container: null,
  timers: [],

  init() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(title, message, type = 'blue', duration = 4000) {
    if (!this.container) this.init();
    const icons = { blue: '💡', green: '✅', red: '🚨', yellow: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span style="font-size:1.1rem">${icons[type] || '💡'}</span>
      <div style="flex:1">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-msg">${message}</div>` : ''}
      </div>
      <button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--color-text-muted);cursor:pointer;font-size:1rem;padding:0;line-height:1;">✕</button>
    `;
    this.container.appendChild(toast);
    const timer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
    this.timers.push(timer);
    return toast;
  }
};

// ---- Sidebar Navigation ----
const Navigation = {
  currentModule: 'overview',
  sidebarCollapsed: false,

  init() {
    this.sidebarCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
    this.applyCollapse();
    this.setupNavItems();
    this.setupToggle();
    this.updateUserInfo();

    // Load module from URL hash
    const hash = window.location.hash.replace('#', '') || 'overview';
    this.navigate(hash, false);
  },

  setupNavItems() {
    document.querySelectorAll('[data-module]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const module = item.dataset.module;
        this.navigate(module);

        // Close mobile sidebar
        if (window.innerWidth <= 900) {
          document.querySelector('.sidebar')?.classList.remove('mobile-open');
          document.getElementById('sidebar-overlay')?.classList.add('hidden');
        }
      });
    });
  },

  setupToggle() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleSidebar());
    }

    // Mobile toggle
    const mobileToggle = document.getElementById('mobile-sidebar-toggle');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        sidebar?.classList.toggle('mobile-open');
        overlay?.classList.toggle('hidden');
      });
    }

    // Overlay close
    document.getElementById('sidebar-overlay')?.addEventListener('click', () => {
      document.querySelector('.sidebar')?.classList.remove('mobile-open');
      document.getElementById('sidebar-overlay')?.classList.add('hidden');
    });
  },

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    localStorage.setItem('sidebar_collapsed', this.sidebarCollapsed);
    this.applyCollapse();
  },

  applyCollapse() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    if (sidebar) {
      sidebar.classList.toggle('collapsed', this.sidebarCollapsed);
    }
    if (mainContent) {
      mainContent.classList.toggle('sidebar-collapsed', this.sidebarCollapsed);
    }
  },

  navigate(moduleId, updateHash = true) {
    // Hide all modules
    document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));

    // Show target
    const target = document.getElementById(`module-${moduleId}`);
    if (target) {
      target.classList.add('active');
      this.currentModule = moduleId;
    } else {
      // Fallback to overview
      document.getElementById('module-overview')?.classList.add('active');
      this.currentModule = 'overview';
    }

    // Update sidebar active state
    document.querySelectorAll('[data-module]').forEach(item => {
      item.classList.toggle('active', item.dataset.module === this.currentModule);
    });

    // Update breadcrumb
    const breadcrumb = document.getElementById('breadcrumb-active');
    if (breadcrumb) {
      const moduleNames = {
        overview: 'Dashboard',
        chatbot: 'AI Stadium Assistant',
        navigation: 'Smart Navigation',
        crowd: 'Crowd Intelligence',
        transport: 'Transportation',
        accessibility: 'Accessibility',
        translator: 'Translator',
        sustainability: 'Sustainability',
        emergency: 'Emergency Center',
        volunteer: 'Volunteer Dashboard',
        organizer: 'Organizer Dashboard',
        analytics: 'AI Analytics',
        matchcenter: 'Match Center',
        notifications: 'Notifications',
        profile: 'Profile'
      };
      breadcrumb.textContent = moduleNames[this.currentModule] || this.currentModule;
    }

    if (updateHash) window.location.hash = moduleId;

    // Trigger module init
    this.initModule(moduleId);
  },

  initModule(moduleId) {
    const initFns = {
      analytics: () => Charts.initAll(),
      crowd: () => CrowdModule.init(),
      sustainability: () => SustainabilityModule.init(),
      matchcenter: () => MatchModule.init(),
      overview: () => OverviewModule.init(),
      transport: () => TransportModule.init(),
      organizer: () => OrganizerModule.init()
    };
    if (initFns[moduleId]) {
      setTimeout(initFns[moduleId], 100);
    }
  },

  updateUserInfo() {
    const user = Auth.getUser();
    const nameEl = document.getElementById('sidebar-user-name');
    const roleEl = document.getElementById('sidebar-user-role');
    const avatarEl = document.getElementById('sidebar-user-avatar');
    const navAvatarEl = document.getElementById('nav-avatar');

    const displayName = user.name || user.email?.split('@')[0] || 'Guest';
    const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    if (nameEl) nameEl.textContent = displayName;
    if (roleEl) roleEl.textContent = user.role || 'Fan';
    if (avatarEl) avatarEl.textContent = initials;
    if (navAvatarEl) navAvatarEl.textContent = initials;
  }
};

// ---- Clock ----
function startClock() {
  const update = () => {
    const now = new Date();
    const el = document.getElementById('live-clock');
    if (el) {
      el.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
  };
  update();
  setInterval(update, 1000);
}

// ---- Countdown Timer ----
function startCountdown(targetDateStr, elementId) {
  const update = () => {
    const target = new Date(targetDateStr);
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) {
      const el = document.getElementById(elementId);
      if (el) el.textContent = "LIVE NOW";
      return;
    }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const el = document.getElementById(elementId);
    if (el) el.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  };
  update();
  setInterval(update, 1000);
}

// ---- Number Counter Animation ----
function animateCounter(el, target, duration = 1500, suffix = '') {
  const start = parseInt(el.textContent) || 0;
  const startTime = Date.now();
  const update = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// ---- Scroll Animation Observer ----
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

// ---- Particle System ----
function createParticles(container) {
  const colors = ['#00d4ff', '#00ff88', '#a855f7', '#ffd700'];
  for (let i = 0; i < 15; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration:${Math.random() * 15 + 10}s;
      animation-delay:${Math.random() * 10}s;
      box-shadow: 0 0 ${size * 2}px currentColor;
    `;
    container.appendChild(p);
  }
}

// ---- Football Background Animation ----
function createFootballAnimations(container) {
  const footballs = ['⚽', '⚽', '🏆', '🥅'];
  for (let i = 0; i < 6; i++) {
    const f = document.createElement('div');
    f.className = 'football-anim';
    f.textContent = footballs[Math.floor(Math.random() * footballs.length)];
    const size = Math.random() * 2 + 1.5;
    f.style.cssText = `
      font-size:${size}rem;
      bottom:${Math.random() * 100}%;
      animation-duration:${Math.random() * 20 + 15}s;
      animation-delay:${Math.random() * 15}s;
    `;
    container.appendChild(f);
  }
}

// ---- Format helpers ----
function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toLocaleString();
}

function formatCurrency(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(n);
}

function getTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr);
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  return `${Math.floor(h / 24)} days ago`;
}

// ---- Crowd level display ----
function getCrowdBadge(level) {
  const map = {
    low: '<span class="badge badge-green">🟢 Low</span>',
    medium: '<span class="badge badge-yellow">🟡 Medium</span>',
    high: '<span class="badge" style="background:rgba(255,107,53,0.15);color:#ff6b35;border-color:rgba(255,107,53,0.3)">🟠 High</span>',
    critical: '<span class="badge badge-purple">🟣 Critical</span>'
  };
  return map[level] || map['medium'];
}

window.Auth = Auth;
window.Toast = Toast;
window.Navigation = Navigation;
window.startClock = startClock;
window.startCountdown = startCountdown;
window.animateCounter = animateCounter;
window.initScrollAnimations = initScrollAnimations;
window.createParticles = createParticles;
window.createFootballAnimations = createFootballAnimations;
window.formatNumber = formatNumber;
window.formatCurrency = formatCurrency;
window.getTimeAgo = getTimeAgo;
window.getCrowdBadge = getCrowdBadge;
