# EGA Mentorship International

> Empowering Global Leaders for a Better World

[![Vercel Deploy](https://img.shields.io/badge/Deploy-Vercel-000?style=flat&logo=vercel)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 Overview

**EGA Mentorship International** is a comprehensive web platform dedicated to connecting and empowering 10,000+ youth leaders and entrepreneurs globally. Our mission is to foster collaboration, innovation, and positive impact across Africa and beyond by providing mentorship, training, and networking opportunities aligned with the UN Sustainable Development Goals.

This repository contains the official website source code for EGA Mentorship International, built with modern web technologies for optimal performance and user experience.

---

## ✨ Key Features

### 🌐 Multi-Page Architecture
- **Home** — Landing page with hero section and value proposition
- **About** — Mission, vision, and organizational impact overview
- **Services** — Comprehensive mentorship programs and training offerings
- **SDGs** — All 17 UN Sustainable Development Goals aligned initiatives
- **Team** — Leadership, mentors, and global network overview
- **Education** — Detailed learning programs and training modules
- **Contact** — Contact form with submission tracking
- **Analytics Dashboard** — Real-time website performance and user engagement metrics

### 📊 Advanced Analytics
- **Client-Side Tracking** — Page views, user events, and session management
- **LocalStorage Persistence** — Analytics data survives page reloads
- **CSV Export** — Export analytics reports for further analysis
- **Real-Time Dashboard** — Live metrics display with 5-second auto-refresh
- **Activity Log** — Track user interactions and browsing patterns

### 🎨 Design Excellence
- **Responsive Layout** — Mobile-first design optimized for all devices
- **Modern UI/UX** — Gold and navy color scheme with smooth animations
- **Accessibility** — Semantic HTML and keyboard navigation support
- **Custom Typography** — Playfair Display (serif) and DM Sans (sans-serif) fonts
- **Performance Optimized** — Fast load times and smooth interactions

### 🔗 Full Navigation Integration
- Seamless page linking across all 8 pages
- Active page indicators in navigation bar
- Mobile hamburger menu with smooth transitions
- Persistent header with navigation and CTA button

---

## 🚀 Quick Start

### Prerequisites
- Python 3.7+ (for local development server)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Git (optional, for cloning)

### Local Development

1. **Clone or download the repository:**
   ```bash
   git clone https://github.com/yourusername/egawebsite.git
   cd egawebsite
   ```

2. **Start a local web server:**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Or using Node.js (if installed)
   npx http-server
   ```

3. **Open in browser:**
   ```
   http://localhost:8000/home.html
   ```

### Navigation
- **Home**: http://localhost:8000/home.html
- **About**: http://localhost:8000/about.html
- **Services**: http://localhost:8000/services.html
- **SDGs**: http://localhost:8000/sdgs.html
- **Team**: http://localhost:8000/team.html
- **Education**: http://localhost:8000/education.html
- **Contact**: http://localhost:8000/contact.html
- **Analytics**: http://localhost:8000/analytics.html

---

## 📁 Project Structure

```
egawebsite/
├── home.html              # Landing page
├── about.html             # Organization information
├── services.html          # Programs and services
├── sdgs.html              # UN SDGs alignment
├── team.html              # Team members and mentors
├── education.html         # Learning programs
├── contact.html           # Contact form
├── analytics.html         # Analytics dashboard
├── styles.css             # Global styles & responsive design
├── scripts.js             # Navigation & interactivity
├── analytics.js           # Analytics tracking engine
├── main.py                # Flask backend (optional)
├── requirements.txt       # Python dependencies
├── vercel.json            # Vercel deployment config
├── README.md              # This file
└── .gitignore             # Git ignore rules
```

---

## 🛠 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| **Styling** | Custom CSS with CSS Variables |
| **Analytics** | Client-side localStorage tracking |
| **Backend** | Python Flask (optional) |
| **Fonts** | Google Fonts (Playfair Display, DM Sans) |
| **Deployment** | Vercel |

---

## 📊 Analytics System

The built-in analytics system tracks user behavior without requiring backend infrastructure:

### Tracked Metrics
- **Page Views** — Count per page with timestamps
- **Session Tracking** — Unique session IDs and duration
- **User Events** — Button clicks, form submissions, scroll depth
- **Activity Log** — Last 20 tracked page views

### How It Works
1. `analytics.js` initializes on page load
2. `AnalyticsManager` class tracks interactions
3. Data stored in browser's localStorage
4. Analytics dashboard displays real-time metrics
5. Export functionality available for CSV reports

### Key Functions
```javascript
analytics.trackPageView()      // Track page navigation
analytics.trackEvent()         // Track custom events
analytics.trackFormSubmit()    // Track form submissions
analytics.trackScrollDepth()   // Track scroll behavior
analytics.exportAsCSV()        // Export analytics as CSV
```

---

## 🎨 Design System

### Color Palette
- **Navy** — `#0D1B3E` (Primary brand color)
- **Gold** — `#C9A84C` (Accent and highlights)
- **White** — `#FFFFFF` (Background)
- **Off-White** — `#F8F6F1` (Secondary background)

### Typography
- **Headings** — Playfair Display (serif) 400–900 weight
- **Body** — DM Sans (sans-serif) 300–600 weight

### Responsive Breakpoints
- **Desktop** — 1200px+
- **Tablet** — 769px–1199px
- **Mobile** — 320px–768px

---

## 🚢 Deployment

### Deploy to Vercel

1. **Connect GitHub repository to Vercel**
2. **Configure build settings:**
   - No build step required (static site)
   - Public directory: `.`

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Environment Variables (if using Flask backend)
```
FLASK_ENV=production
FLASK_DEBUG=false
```

---

## 📈 Performance

- **Lighthouse Score** — Optimized for Core Web Vitals
- **Load Time** — < 2 seconds on 4G
- **Page Size** — Lightweight without external dependencies
- **SEO Optimized** — Semantic HTML and meta tags

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Use semantic HTML
- Follow CSS naming conventions
- Add comments for complex JavaScript logic
- Maintain mobile-first responsive design

---

## 🐛 Known Issues & Roadmap

### Current Limitations
- Analytics stored locally (not synced across devices)
- Contact form requires backend integration for email

### Planned Features
- [ ] User authentication system
- [ ] Backend database for persistent analytics
- [ ] Email notifications for form submissions
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] Advanced user segmentation

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact

For questions, issues, or collaboration inquiries:

- **Email**: hello@egamentorship.org
- **Website**: https://egamentorship.org
- **Facebook**: @EGAMentorship
- **Twitter**: @EGAMentorship
- **LinkedIn**: EGA Mentorship International

---

## 🙏 Acknowledgments

- **UN Sustainable Development Goals** — Framework for impact initiatives
- **Google Fonts** — Typography resources
- **Vercel** — Fast and reliable hosting platform
- **Community Mentors** — Guiding the next generation of leaders

---

## 📚 Resources

- [UN SDGs](https://sdgs.un.org/)
- [Vercel Documentation](https://vercel.com/docs)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/)
- [Google Fonts](https://fonts.google.com/)

---

**Last Updated:** April 2026  
**Version:** 2.0 (Multi-page with Analytics)

---

<div align="center">

### ✨ Empowering Global Leaders for a Better World ✨

**[Visit Our Website](http://localhost:8000/home.html)** • **[Analytics Dashboard](http://localhost:8000/analytics.html)** • **[Get Involved](http://localhost:8000/contact.html)**

</div>