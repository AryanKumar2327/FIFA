// ============================================
// FIFA AI MATCHMATE - CHARTS MODULE
// ============================================

const Charts = {
  instances: {},

  defaults: {
    color: (opacity = 1) => `rgba(0, 212, 255, ${opacity})`,
    green: (opacity = 1) => `rgba(0, 255, 136, ${opacity})`,
    purple: (opacity = 1) => `rgba(168, 85, 247, ${opacity})`,
    yellow: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`,
    red: (opacity = 1) => `rgba(255, 71, 87, ${opacity})`,
    orange: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,

    font: { family: 'Inter, sans-serif', size: 11 },
    grid: { color: 'rgba(255,255,255,0.05)' },
    ticks: { color: '#4a6080' },
    legend: { color: '#8ba3c4' }
  },

  globalDefaults() {
    if (!window.Chart) return;
    Chart.defaults.color = '#8ba3c4';
    Chart.defaults.font.family = 'Inter, sans-serif';
    Chart.defaults.font.size = 11;
    Chart.defaults.plugins.legend.labels.color = '#8ba3c4';
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.padding = 16;
    Chart.defaults.scale.grid.color = 'rgba(255,255,255,0.05)';
    Chart.defaults.scale.ticks.color = '#4a6080';
  },

  destroy(id) {
    if (this.instances[id]) {
      this.instances[id].destroy();
      delete this.instances[id];
    }
  },

  createLineChart(canvasId, labels, datasets, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;
    this.destroy(canvasId);
    const ctx = canvas.getContext('2d');

    this.instances[canvasId] = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: datasets.length > 1 },
          tooltip: {
            backgroundColor: 'rgba(8,15,30,0.95)',
            borderColor: 'rgba(0,212,255,0.3)',
            borderWidth: 1,
            padding: 10,
            titleFont: { weight: '700' }
          }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#4a6080' } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#4a6080' }, beginAtZero: false }
        },
        elements: {
          line: { tension: 0.4 },
          point: { radius: 3, hoverRadius: 6 }
        },
        interaction: { mode: 'index', intersect: false },
        ...options
      }
    });
    return this.instances[canvasId];
  },

  createBarChart(canvasId, labels, datasets, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;
    this.destroy(canvasId);
    const ctx = canvas.getContext('2d');

    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: datasets.length > 1 },
          tooltip: {
            backgroundColor: 'rgba(8,15,30,0.95)',
            borderColor: 'rgba(0,212,255,0.3)',
            borderWidth: 1,
            padding: 10
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#4a6080' },
            border: { display: false }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#4a6080' },
            border: { display: false },
            beginAtZero: true
          }
        },
        borderRadius: 6,
        ...options
      }
    });
    return this.instances[canvasId];
  },

  createDoughnutChart(canvasId, labels, data, colors, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;
    this.destroy(canvasId);
    const ctx = canvas.getContext('2d');

    this.instances[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderColor: colors.map(c => c.replace(/[\d.]+\)$/, '0.8)')),
          borderWidth: 2,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'right',
            labels: { padding: 12, font: { size: 11 } }
          },
          tooltip: {
            backgroundColor: 'rgba(8,15,30,0.95)',
            borderColor: 'rgba(0,212,255,0.3)',
            borderWidth: 1,
            padding: 10
          }
        },
        ...options
      }
    });
    return this.instances[canvasId];
  },

  createRadarChart(canvasId, labels, datasets, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;
    this.destroy(canvasId);
    const ctx = canvas.getContext('2d');

    this.instances[canvasId] = new Chart(ctx, {
      type: 'radar',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          tooltip: {
            backgroundColor: 'rgba(8,15,30,0.95)',
            borderColor: 'rgba(0,212,255,0.3)',
            borderWidth: 1
          }
        },
        scales: {
          r: {
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: '#4a6080', backdropColor: 'transparent', stepSize: 20 },
            pointLabels: { color: '#8ba3c4', font: { size: 11 } },
            min: 0,
            max: 100
          }
        },
        ...options
      }
    });
    return this.instances[canvasId];
  },

  createGradient(ctx, color1, color2) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
  },

  initAll() {
    if (!window.Chart || !window.DEMO_DATA) return;
    this.globalDefaults();
    const d = DEMO_DATA.analytics;

    // Crowd Trend
    const ctCanvas = document.getElementById('chart-crowd-trend');
    if (ctCanvas) {
      const ctx = ctCanvas.getContext('2d');
      const gradient = this.createGradient(ctx, 'rgba(0,212,255,0.4)', 'rgba(0,212,255,0)');
      this.createLineChart('chart-crowd-trend', d.crowdTrend.labels, [{
        label: 'Crowd Count',
        data: d.crowdTrend.data,
        borderColor: '#00d4ff',
        backgroundColor: gradient,
        fill: true,
        borderWidth: 2
      }]);
    }

    // Entry Prediction
    const epCanvas = document.getElementById('chart-entry-pred');
    if (epCanvas) {
      const ctx = epCanvas.getContext('2d');
      const g1 = this.createGradient(ctx, 'rgba(0,255,136,0.4)', 'rgba(0,255,136,0)');
      this.createLineChart('chart-entry-pred', d.entryPrediction.labels, [{
        label: 'Predicted Crowd',
        data: d.entryPrediction.data,
        borderColor: '#00ff88',
        backgroundColor: g1,
        fill: true,
        borderWidth: 2,
        borderDash: [5, 3]
      }]);
    }

    // Peak Hours
    const phCanvas = document.getElementById('chart-peak-hours');
    if (phCanvas) {
      const ctx = phCanvas.getContext('2d');
      const g2 = ctx.createLinearGradient(0, 0, 400, 0);
      g2.addColorStop(0, 'rgba(0,212,255,0.9)');
      g2.addColorStop(1, 'rgba(0,255,136,0.9)');
      this.createBarChart('chart-peak-hours', d.peakHours.labels, [{
        label: 'Attendance',
        data: d.peakHours.data,
        backgroundColor: g2,
        borderRadius: 8
      }]);
    }

    // Gate Usage
    const guCanvas = document.getElementById('chart-gate-usage');
    if (guCanvas) {
      this.createBarChart('chart-gate-usage', d.gateUsage.labels, [{
        label: 'Occupancy %',
        data: d.gateUsage.data,
        backgroundColor: d.gateUsage.data.map(v =>
          v >= 90 ? 'rgba(168,85,247,0.8)' :
          v >= 70 ? 'rgba(255,107,53,0.8)' :
          v >= 40 ? 'rgba(255,215,0,0.8)' :
          'rgba(0,255,136,0.8)'
        ),
        borderRadius: 8
      }]);
    }

    // Transport Usage (Doughnut)
    this.createDoughnutChart('chart-transport',
      d.transportUsage.labels,
      d.transportUsage.data,
      ['rgba(0,212,255,0.8)', 'rgba(0,255,136,0.8)', 'rgba(255,215,0,0.8)', 'rgba(168,85,247,0.8)', 'rgba(255,107,53,0.8)', 'rgba(139,163,196,0.8)']
    );

    // Food Demand (Doughnut)
    this.createDoughnutChart('chart-food-demand',
      d.foodDemand.labels,
      d.foodDemand.data,
      ['rgba(255,107,53,0.8)', 'rgba(255,215,0,0.8)', 'rgba(0,212,255,0.8)', 'rgba(0,255,136,0.8)', 'rgba(168,85,247,0.8)', 'rgba(139,163,196,0.8)']
    );

    // Water Consumption
    const wcCanvas = document.getElementById('chart-water');
    if (wcCanvas) {
      const ctx = wcCanvas.getContext('2d');
      const g3 = this.createGradient(ctx, 'rgba(0,212,255,0.5)', 'rgba(0,212,255,0)');
      this.createLineChart('chart-water', d.waterConsumption.labels, [{
        label: 'Water (L/h)',
        data: d.waterConsumption.data,
        borderColor: '#00d4ff',
        backgroundColor: g3,
        fill: true,
        borderWidth: 2
      }]);
    }

    // Emergency Incidents
    this.createBarChart('chart-emergency',
      d.emergencyIncidents.labels,
      [{
        label: 'Incidents',
        data: d.emergencyIncidents.data,
        backgroundColor: ['rgba(255,71,87,0.8)', 'rgba(0,212,255,0.8)', 'rgba(255,215,0,0.8)', 'rgba(255,107,53,0.8)', 'rgba(168,85,247,0.8)', 'rgba(0,255,136,0.8)'],
        borderRadius: 8
      }]
    );

    // Volunteer Performance (Radar)
    const d9 = DEMO_DATA.analytics.volunteerPerf;
    this.createRadarChart('chart-volunteer-perf', d9.labels, [{
      label: 'Performance %',
      data: d9.data,
      borderColor: '#00ff88',
      backgroundColor: 'rgba(0,255,136,0.15)',
      borderWidth: 2,
      pointBackgroundColor: '#00ff88'
    }]);

    // Overview mini charts (organizer)
    const orgCanvas = document.getElementById('chart-org-attendance');
    if (orgCanvas) {
      const ctx = orgCanvas.getContext('2d');
      const g = this.createGradient(ctx, 'rgba(0,212,255,0.4)', 'rgba(0,212,255,0)');
      this.createLineChart('chart-org-attendance', ['18h','19h','20h','21h','Now'], [{
        data: [55000, 63000, 68000, 70000, 71243],
        borderColor: '#00d4ff',
        backgroundColor: g,
        fill: true,
        borderWidth: 2
      }], { plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } });
    }
  }
};

window.Charts = Charts;
