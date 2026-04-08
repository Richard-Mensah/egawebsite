/**
 * Africa Map Visualization for EGA Analytics Dashboard
 * Dynamic SVG rendering with interactive country selection
 * Author: EGA Mentorship International
 * Version: 2.0.0
 *
 * Features:
 * - Dynamic SVG rendering of African countries
 * - Interactive country selection (click/hover)
 * - Color-coded impact intensity visualization
 * - Smooth animations and transitions
 * - Tooltip system with detailed information
 * - Data export capabilities (CSV/JSON)
 * - Analytics dashboard integration
 * - Responsive design with smooth animations
 * - Comprehensive error handling and logging
 *
 * Usage:
 * const africaMap = new AfricaMap('containerId', countryData);
 */

class AfricaMap {
  constructor(containerId, countryData) {
    this.containerId = containerId;
    this.countryData = countryData;
    this.selectedCountry = null;
    this.tooltip = null;
    this.animationDuration = 300;
    this.mapData = {
      viewBox: "0 0 800 600",
      countries: [
        // West Africa
        { id: 'senegal', path: 'M250 260 L270 260 L270 280 L265 285 L260 285 L255 280 L250 275 Z', active: true },
        { id: 'mali', path: 'M270 240 L310 240 L310 260 L305 265 L300 265 L295 260 L290 255 L285 255 L280 260 L275 265 L270 265 Z', active: true },
        { id: 'ghana', path: 'M350 320 L370 320 L370 340 L365 345 L360 345 L355 340 L350 335 Z', active: true },
        { id: 'nigeria', path: 'M330 300 L350 300 L350 320 L345 325 L340 325 L335 320 L330 315 Z', active: true },
        { id: 'cameroon', path: 'M310 310 L330 310 L330 330 L325 335 L320 335 L315 330 L310 325 Z', active: true },

        // East Africa
        { id: 'ethiopia', path: 'M390 280 L420 280 L420 310 L415 315 L410 315 L405 310 L400 305 L395 305 L390 300 Z', active: true },
        { id: 'kenya', path: 'M390 350 L410 350 L410 370 L405 375 L400 375 L395 370 L390 365 Z', active: true },
        { id: 'tanzania', path: 'M380 370 L400 370 L400 390 L395 395 L390 395 L385 390 L380 385 Z', active: true },
        { id: 'rwanda', path: 'M380 340 L390 340 L390 350 L385 355 L380 355 Z', active: true },
        { id: 'uganda', path: 'M380 330 L390 330 L390 340 L385 345 L380 345 Z', active: true },

        // Southern Africa
        { id: 'southafrica', path: 'M350 480 L390 480 L390 500 L385 505 L380 505 L375 500 L370 495 L365 495 L360 500 L355 505 L350 505 Z', active: true },

        // Other African countries (inactive base shapes for geographical context)
        { id: 'burkinafaso', path: 'M290 280 L310 280 L310 300 L305 305 L300 305 L295 300 L290 295 Z', active: false },
        { id: 'niger', path: 'M310 270 L330 270 L330 290 L325 295 L320 295 L315 290 L310 285 Z', active: false },
        { id: 'chad', path: 'M330 270 L350 270 L350 290 L345 295 L340 295 L335 290 L330 285 Z', active: false },
        { id: 'sudan', path: 'M370 270 L410 270 L410 290 L405 295 L400 295 L395 290 L390 285 L385 285 L380 290 L375 295 L370 295 Z', active: false },
        { id: 'somalia', path: 'M430 320 L450 320 L450 340 L445 345 L440 345 L435 340 L430 335 Z', active: false },
        { id: 'zimbabwe', path: 'M380 420 L400 420 L400 440 L395 445 L390 445 L385 440 L380 435 Z', active: false },
        { id: 'zambia', path: 'M370 400 L390 400 L390 420 L385 425 L380 425 L375 420 L370 415 Z', active: false },
        { id: 'angola', path: 'M330 420 L350 420 L350 460 L345 465 L340 465 L335 460 L330 455 Z', active: false },
        { id: 'namibia', path: 'M340 470 L360 470 L360 490 L355 495 L350 495 L345 490 L340 485 Z', active: false },
        { id: 'botswana', path: 'M370 450 L390 450 L390 470 L385 475 L380 475 L375 470 L370 465 Z', active: false },
        { id: 'mozambique', path: 'M410 440 L430 440 L430 480 L425 485 L420 485 L415 480 L410 475 Z', active: false },
        { id: 'madagascar', path: 'M450 450 L470 450 L470 520 L465 525 L460 525 L455 520 L450 515 Z', active: false },
        { id: 'ivorycoast', path: 'M320 290 L340 290 L340 310 L335 315 L330 315 L325 310 L320 305 Z', active: false },
        { id: 'guinea', path: 'M240 270 L260 270 L260 290 L255 295 L250 295 L245 290 L240 285 Z', active: false },
        { id: 'liberia', path: 'M280 300 L300 300 L300 320 L295 325 L290 325 L285 320 L280 315 Z', active: false },
        { id: 'sierraleone', path: 'M260 290 L280 290 L280 310 L275 315 L270 315 L265 310 L260 305 Z', active: false },
        { id: 'burundi', path: 'M390 350 L400 350 L400 360 L395 365 L390 365 Z', active: false },
        { id: 'djibouti', path: 'M430 300 L440 300 L440 310 L435 315 L430 315 Z', active: false },
        { id: 'eritrea', path: 'M420 270 L440 270 L440 280 L435 285 L430 285 Z', active: false },
        { id: 'egypt', path: 'M380 200 L420 200 L420 230 L415 235 L410 235 L405 230 L400 225 L395 225 L390 230 L385 235 L380 235 Z', active: false },
        { id: 'libya', path: 'M350 180 L390 180 L390 210 L385 215 L380 215 L375 210 L370 205 L365 205 L360 210 L355 215 L350 215 Z', active: false },
        { id: 'tunisia', path: 'M330 170 L350 170 L350 180 L345 185 L340 185 L335 180 L330 175 Z', active: false },
        { id: 'algeria', path: 'M280 150 L330 150 L330 180 L325 185 L320 185 L315 180 L310 175 L305 175 L300 180 L295 185 L290 185 L285 180 L280 175 Z', active: false },
        { id: 'morocco', path: 'M240 140 L280 140 L280 170 L275 175 L270 175 L265 170 L260 165 L255 165 L250 170 L245 175 L240 175 Z', active: false }
      ]
    };

    this.init();
  }

  /**
   * Initialize the map
   */
  init() {
    try {
      this.render();
      this.setupEventListeners();
      this.setDefaultSelection();
      console.log('Africa Map initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Africa Map:', error);
    }
  }

  /**
   * Render the SVG map dynamically
   */
  render() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      throw new Error(`Container element with ID '${this.containerId}' not found`);
    }

    // Clear existing content
    container.innerHTML = '';

    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', this.mapData.viewBox);
    svg.setAttribute('class', 'world-map-svg');
    svg.style.background = 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)';
    svg.style.boxShadow = 'inset 0 0 10px rgba(0,0,0,0.1)';
    svg.style.borderRadius = '8px';

    // Create continent group
    const continentGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    continentGroup.setAttribute('class', 'continent africa');

    // Add countries to the map
    this.mapData.countries.forEach(country => {
      const path = this.createCountryElement(country);
      continentGroup.appendChild(path);
    });

    svg.appendChild(continentGroup);
    container.appendChild(svg);

    // Create tooltip element
    this.createTooltip();

    console.log(`Rendered ${this.mapData.countries.length} countries on Africa map`);
  }

  /**
   * Create tooltip element for country information
   */
  createTooltip() {
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'map-tooltip';
    this.tooltip.style.cssText = `
      position: absolute;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-family: 'DM Sans', sans-serif;
      pointer-events: none;
      opacity: 0;
      transform: translate(-50%, -100%);
      transition: opacity 0.2s ease, transform 0.2s ease;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.2);
      max-width: 250px;
    `;

    document.body.appendChild(this.tooltip);
  }

  /**
   * Create a country SVG path element
   */
  createCountryElement(country) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', country.path);
    path.setAttribute('id', country.id);

    // Set CSS classes
    const classes = ['country'];
    if (country.active) {
      classes.push('active-country');

      // Apply intensity styling for active countries
      if (this.countryData[country.id]) {
        const intensity = this.countryData[country.id].intensity;
        classes.push(`intensity-${intensity}`);
      }
    } else {
      classes.push('inactive');
    }

    path.setAttribute('class', classes.join(' '));

    // Add data attributes for active countries
    if (country.active && this.countryData[country.id]) {
      const data = this.countryData[country.id];
      path.setAttribute('data-country', data.name);
      path.setAttribute('data-youth', data.youth);
      path.setAttribute('data-support', data.support);
      path.setAttribute('data-intensity', data.intensity);
    }

    return path;
  }

  /**
   * Set up event listeners for country interactions
   */
  setupEventListeners() {
    const countries = document.querySelectorAll('.active-country');

    countries.forEach(country => {
      // Click event
      country.addEventListener('click', (e) => {
        this.handleCountryClick(e.target);
      });

      // Mouse enter event
      country.addEventListener('mouseenter', (e) => {
        this.handleCountryHover(e.target, e);
      });

      // Mouse leave event
      country.addEventListener('mouseleave', (e) => {
        this.handleCountryLeave(e.target);
      });

      // Mouse move event for tooltip positioning
      country.addEventListener('mousemove', (e) => {
        this.updateTooltipPosition(e);
      });
    });
  }

  /**
   * Handle country click events
   */
  handleCountryClick(countryElement) {
    const countryId = countryElement.id;
    const countryInfo = this.countryData[countryId];

    if (countryInfo) {
      // Update selection
      this.clearSelection();
      countryElement.classList.add('selected');
      this.selectedCountry = countryId;

      // Apply selection animation
      this.animateCountry(countryElement, 'select');

      // Update details panel
      this.updateCountryDetails(countryInfo);

      // Trigger analytics integration
      this.notifyAnalyticsDashboard(countryInfo);

      console.log(`Selected country: ${countryInfo.name}`);
    }
  }

  /**
   * Handle country hover events
   */
  handleCountryHover(countryElement) {
    const countryId = countryElement.id;
    const countryInfo = this.countryData[countryId];

    if (countryInfo) {
      // Show tooltip
      this.showTooltip(countryInfo, event);

      // Update details panel
      this.updateCountryDetails(countryInfo);

      // Add hover animation
      this.animateCountry(countryElement, 'hover');
    }
  }

  /**
   * Handle country leave events
   */
  handleCountryLeave(countryElement) {
    // Hide tooltip
    this.hideTooltip();

    // Remove hover animation
    this.animateCountry(countryElement, 'leave');
  }

  /**
   * Show tooltip with country information
   */
  showTooltip(countryInfo, event) {
    if (!this.tooltip) return;

    const intensityLabels = {
      5: 'High Impact',
      4: 'Strong Growth',
      3: 'Growing',
      2: 'Emerging',
      1: 'Starting'
    };

    this.tooltip.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 8px; color: var(--gold);">
        ${countryInfo.name}
      </div>
      <div style="font-size: 12px; line-height: 1.4;">
        <div>👥 Youth Mentored: ${countryInfo.youth.toLocaleString()}</div>
        <div>🤝 Support Actions: ${countryInfo.support.toLocaleString()}</div>
        <div>📊 Impact Level: ${intensityLabels[countryInfo.intensity]}</div>
      </div>
    `;

    this.tooltip.style.opacity = '1';
    this.tooltip.style.transform = 'translate(-50%, -100%) translateY(-10px)';
    this.updateTooltipPosition(event);
  }

  /**
   * Hide tooltip
   */
  hideTooltip() {
    if (!this.tooltip) return;

    this.tooltip.style.opacity = '0';
    this.tooltip.style.transform = 'translate(-50%, -100%) translateY(-20px)';
  }

  /**
   * Update tooltip position based on mouse coordinates
   */
  updateTooltipPosition(event) {
    if (!this.tooltip) return;

    const x = event.pageX;
    const y = event.pageY;

    this.tooltip.style.left = `${x}px`;
    this.tooltip.style.top = `${y}px`;
  }

  /**
   * Animate country element
   */
  animateCountry(countryElement, type) {
    const duration = this.animationDuration;

    switch (type) {
      case 'hover':
        countryElement.style.transition = `all ${duration}ms ease`;
        countryElement.style.transform = 'scale(1.05)';
        countryElement.style.filter = 'brightness(1.1) drop-shadow(0 0 8px rgba(201,168,76,0.4))';
        break;

      case 'leave':
        countryElement.style.transform = 'scale(1)';
        countryElement.style.filter = 'brightness(1) drop-shadow(0 0 0px rgba(201,168,76,0))';
        break;

      case 'select':
        countryElement.style.transition = `all ${duration}ms ease`;
        countryElement.style.transform = 'scale(1.08)';
        countryElement.style.filter = 'brightness(1.2) drop-shadow(0 0 12px rgba(201,168,76,0.6))';
        break;

      case 'deselect':
        countryElement.style.transform = 'scale(1)';
        countryElement.style.filter = 'brightness(1) drop-shadow(0 0 0px rgba(201,168,76,0))';
        break;
    }
  }

  /**
   * Clear current country selection
   */
  clearSelection() {
    document.querySelectorAll('.active-country.selected').forEach(el => {
      el.classList.remove('selected');
      this.animateCountry(el, 'deselect');
    });
    this.selectedCountry = null;
  }

  /**
   * Set default country selection (Ghana)
   */
  setDefaultSelection() {
    setTimeout(() => {
      const defaultCountry = document.getElementById('ghana');
      if (defaultCountry) {
        this.handleCountryClick(defaultCountry);
      }
    }, 100);
  }

  /**
   * Update the country details panel
   */
  updateCountryDetails(countryInfo) {
    const nameElement = document.getElementById('countryName');
    const youthElement = document.getElementById('countryYouth');
    const supportElement = document.getElementById('countrySupport');
    const intensityElement = document.getElementById('countryIntensity');

    if (nameElement) nameElement.textContent = countryInfo.name;
    if (youthElement) youthElement.textContent = countryInfo.youth.toLocaleString();
    if (supportElement) supportElement.textContent = countryInfo.support.toLocaleString();

    // Convert intensity number to descriptive text
    const intensityLabels = {
      5: 'High Impact',
      4: 'Strong Growth',
      3: 'Growing',
      2: 'Emerging',
      1: 'Starting'
    };

    if (intensityElement) {
      intensityElement.textContent = intensityLabels[countryInfo.intensity] || 'Unknown';
    }
  }

  /**
   * Get country data by ID
   */
  getCountryData(countryId) {
    return this.countryData[countryId] || null;
  }

  /**
   * Get all active countries
   */
  getActiveCountries() {
    return this.mapData.countries.filter(country => country.active);
  }

  /**
   * Get total statistics across all active countries
   */
  getTotalStats() {
    const activeCountries = this.getActiveCountries();
    return activeCountries.reduce((total, country) => {
      const data = this.countryData[country.id];
      if (data) {
        total.youth += data.youth;
        total.support += data.support;
      }
      return total;
    }, { youth: 0, support: 0 });
  }

  /**
   * Notify analytics dashboard of country selection
   */
  notifyAnalyticsDashboard(countryInfo) {
    // Dispatch custom event for analytics integration
    const event = new CustomEvent('countrySelected', {
      detail: {
        country: countryInfo,
        timestamp: new Date().toISOString()
      }
    });
    document.dispatchEvent(event);

    // If updateCharts function exists, call it to refresh analytics
    if (typeof updateCharts === 'function') {
      // Could pass country-specific data to charts here
      console.log(`Analytics updated for ${countryInfo.name}`);
    }
  }

  /**
   * Export map data as CSV
   */
  exportToCSV() {
    const activeCountries = this.getActiveCountries();
    const csvData = [];

    // Add header
    csvData.push(['Country', 'Youth Mentored', 'Support Actions', 'Impact Intensity']);

    // Add data rows
    activeCountries.forEach(country => {
      const data = this.countryData[country.id];
      if (data) {
        csvData.push([
          data.name,
          data.youth,
          data.support,
          data.intensity
        ]);
      }
    });

    // Convert to CSV string
    const csvContent = csvData.map(row =>
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    // Download file
    this.downloadFile(csvContent, 'africa-map-data.csv', 'text/csv');
  }

  /**
   * Export map data as JSON
   */
  exportToJSON() {
    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        totalCountries: this.getActiveCountries().length,
        totalStats: this.getTotalStats()
      },
      countries: this.getActiveCountries().map(country => ({
        ...this.countryData[country.id],
        id: country.id
      }))
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    this.downloadFile(jsonContent, 'africa-map-data.json', 'application/json');
  }

  /**
   * Download file utility
   */
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    console.log(`Exported data to ${filename}`);
  }

  /**
   * Add export buttons to the map container
   */
  addExportButtons() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'map-export-buttons';
    buttonContainer.style.cssText = `
      display: flex;
      gap: 10px;
      margin-top: 15px;
      justify-content: center;
    `;

    const csvButton = this.createExportButton('📊 Export CSV', () => this.exportToCSV());
    const jsonButton = this.createExportButton('📋 Export JSON', () => this.exportToJSON());

    buttonContainer.appendChild(csvButton);
    buttonContainer.appendChild(jsonButton);

    // Insert after the map container
    container.parentNode.insertBefore(buttonContainer, container.nextSibling);
  }

  /**
   * Create export button
   */
  createExportButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.cssText = `
      background: var(--gold);
      color: var(--navy);
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: 'DM Sans', sans-serif;
    `;

    button.addEventListener('mouseenter', () => {
      button.style.background = '#b8964c';
      button.style.transform = 'translateY(-2px)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.background = 'var(--gold)';
      button.style.transform = 'translateY(0)';
    });

    button.addEventListener('click', onClick);

    return button;
  }

  /**
   * Update country data dynamically
   */
  updateCountryData(newData) {
    this.countryData = { ...this.countryData, ...newData };

    // Re-render the map with updated data
    this.render();
    this.setupEventListeners();
    this.setDefaultSelection();

    console.log('Country data updated and map re-rendered');
  }

  /**
   * Highlight countries based on criteria
   */
  highlightCountries(criteria) {
    const countries = document.querySelectorAll('.active-country');

    countries.forEach(country => {
      const countryId = country.id;
      const data = this.countryData[countryId];

      if (data && this.matchesCriteria(data, criteria)) {
        country.classList.add('highlighted');
        this.animateCountry(country, 'select');
      } else {
        country.classList.remove('highlighted');
        this.animateCountry(country, 'deselect');
      }
    });
  }

  /**
   * Check if country data matches given criteria
   */
  matchesCriteria(data, criteria) {
    if (criteria.minYouth && data.youth < criteria.minYouth) return false;
    if (criteria.maxYouth && data.youth > criteria.maxYouth) return false;
    if (criteria.minIntensity && data.intensity < criteria.minIntensity) return false;
    if (criteria.maxIntensity && data.intensity > criteria.maxIntensity) return false;
    if (criteria.countries && !criteria.countries.includes(data.name)) return false;

    return true;
  }

  /**
   * Get countries sorted by impact
   */
  getCountriesByImpact(order = 'desc') {
    const activeCountries = this.getActiveCountries();

    return activeCountries
      .map(country => ({
        ...this.countryData[country.id],
        id: country.id
      }))
      .sort((a, b) => {
        if (order === 'desc') {
          return b.intensity - a.intensity;
        } else {
          return a.intensity - b.intensity;
        }
      });
  }

  /**
   * Animate all countries sequentially
   */
  animateAllCountries() {
    const countries = document.querySelectorAll('.active-country');
    let delay = 0;

    countries.forEach((country, index) => {
      setTimeout(() => {
        this.animateCountry(country, 'select');
        setTimeout(() => {
          this.animateCountry(country, 'deselect');
        }, 1000);
      }, delay);
      delay += 200;
    });
  }

  /**
   * Initialize with enhanced features
   */
  init() {
    try {
      this.render();
      this.setupEventListeners();
      this.setDefaultSelection();
      this.addExportButtons();
      console.log('Africa Map initialized with enhanced features');
    } catch (error) {
      console.error('Failed to initialize Africa Map:', error);
    }
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AfricaMap;
}