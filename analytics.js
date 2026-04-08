// Analytics Tracking Module
class AnalyticsManager {
  constructor() {
    this.analyticsData = this.loadAnalytics();
    this.currentPage = this.getCurrentPage();
    this.sessionId = this.generateSessionId();
    this.trackPageView();
  }

  // Generate unique session ID
  generateSessionId() {
    let sessionId = localStorage.getItem('ega_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('ega_session_id', sessionId);
    }
    return sessionId;
  }

  // Get current page name from URL
  getCurrentPage() {
    const pageNames = {
      'home.html': 'Home',
      'about.html': 'About',
      'services.html': 'Services',
      'sdgs.html': 'SDGs',
      'team.html': 'Team',
      'education.html': 'Education',
      'contact.html': 'Contact',
      'analytics.html': 'Analytics Dashboard'
    };
    
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    return pageNames[currentPath] || currentPath;
  }

  // Load analytics from localStorage
  loadAnalytics() {
    const saved = localStorage.getItem('ega_analytics');
    return saved ? JSON.parse(saved) : {
      pageViews: {},
      events: [],
      timestamps: []
    };
  }

  // Save analytics to localStorage
  saveAnalytics() {
    localStorage.setItem('ega_analytics', JSON.stringify(this.analyticsData));
  }

  // Track page view
  trackPageView() {
    const page = this.currentPage;
    if (!this.analyticsData.pageViews[page]) {
      this.analyticsData.pageViews[page] = 0;
    }
    this.analyticsData.pageViews[page]++;
    this.analyticsData.timestamps.push({
      page: page,
      time: new Date().toISOString(),
      sessionId: this.sessionId
    });
    this.saveAnalytics();
    
    console.log(`📊 Page tracked: ${page} (Total: ${this.analyticsData.pageViews[page]})`);
  }

  // Track custom events
  trackEvent(eventName, eventData = {}) {
    this.analyticsData.events.push({
      name: eventName,
      page: this.currentPage,
      data: eventData,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId
    });
    this.saveAnalytics();
    
    console.log(`📌 Event tracked: ${eventName}`, eventData);
  }

  // Track button clicks
  trackButtonClick(buttonName) {
    this.trackEvent('button_click', { button: buttonName });
  }

  // Track form submissions
  trackFormSubmit(formName) {
    this.trackEvent('form_submit', { form: formName });
  }

  // Track scroll depth
  trackScrollDepth() {
    const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent % 25 === 0 && scrollPercent > 0) {
      this.trackEvent('scroll_depth', { depth: scrollPercent + '%' });
    }
  }

  // Get analytics summary
  getSummary() {
    return {
      totalPageViews: Object.values(this.analyticsData.pageViews).reduce((a, b) => a + b, 0),
      pageBreakdown: this.analyticsData.pageViews,
      totalEvents: this.analyticsData.events.length,
      uniqueSessions: [...new Set(this.analyticsData.timestamps.map(t => t.sessionId))].length
    };
  }

  // Get detailed analytics report
  getDetailedReport() {
    return {
      summary: this.getSummary(),
      pageViews: this.analyticsData.pageViews,
      events: this.analyticsData.events,
      recentActivity: this.analyticsData.timestamps.slice(-20)
    };
  }

  // Clear analytics (for testing)
  clearAnalytics() {
    this.analyticsData = { pageViews: {}, events: [], timestamps: [] };
    this.saveAnalytics();
    console.log('✅ Analytics cleared');
  }

  // Export analytics as CSV
  exportAsCSV() {
    let csv = 'Page,Views\n';
    for (const [page, views] of Object.entries(this.analyticsData.pageViews)) {
      csv += `${page},${views}\n`;
    }
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ega-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

// Initialize analytics
const analytics = new AnalyticsManager();

// Track scroll depth
window.addEventListener('scroll', () => {
  analytics.trackScrollDepth();
});

// Track link clicks
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    analytics.trackEvent('link_click', { url: e.target.href });
  }
});

// Track time on page (every 30 seconds)
setInterval(() => {
  analytics.trackEvent('page_active', { page: analytics.currentPage });
}, 30000);
