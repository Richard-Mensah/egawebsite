"""
EGA Mentorship Website - Backend Server
Handles contact submissions, analytics, and admin dashboard
"""

from flask import Flask, send_file, request, jsonify, render_template_string
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os
import json
from functools import wraps

app = Flask(__name__)

# ============================================================
# CONFIGURATION
# ============================================================

# Database Configuration
DATABASE_PATH = os.environ.get('DATABASE_PATH', 'ega_data.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DATABASE_PATH}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# Admin Configuration
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')

# Initialize Database
db = SQLAlchemy(app)
CORS(app)

# ============================================================
# DATABASE MODELS
# ============================================================

class ContactSubmission(db.Model):
    """Contact form submissions"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    user_agent = db.Column(db.String(500))
    ip_address = db.Column(db.String(50))
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='new')  # new, replied, archived
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'subject': self.subject,
            'message': self.message,
            'submitted_at': self.submitted_at.isoformat(),
            'status': self.status
        }

class AnalyticsLog(db.Model):
    """Analytics tracking"""
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(100))
    page = db.Column(db.String(100))
    event_type = db.Column(db.String(50))  # page_view, button_click, form_submit, etc.
    event_data = db.Column(db.JSON)
    user_agent = db.Column(db.String(500))
    ip_address = db.Column(db.String(50))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'page': self.page,
            'event_type': self.event_type,
            'event_data': self.event_data,
            'timestamp': self.timestamp.isoformat()
        }

# ============================================================
# HELPER FUNCTIONS
# ============================================================

def admin_required(f):
    """Decorator to protect admin routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        password = request.args.get('password') or request.json.get('password') if request.is_json else None
        if not password or password != ADMIN_PASSWORD:
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated_function

def get_client_ip():
    """Get client IP address"""
    return request.headers.get('X-Forwarded-For', request.remote_addr).split(',')[0].strip()

# ============================================================
# STATIC FILE ROUTES
# ============================================================

@app.route('/')
def home():
    """Serve home page"""
    return send_file('home.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files and HTML pages"""
    try:
        return send_file(filename)
    except FileNotFoundError:
        return send_file('home.html')

# ============================================================
# CONTACT FORM API
# ============================================================

@app.route('/api/contact', methods=['POST'])
def submit_contact_form():
    """Handle contact form submissions"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'subject', 'message']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Create contact submission
        submission = ContactSubmission(
            name=data['name'],
            email=data['email'],
            subject=data['subject'],
            message=data['message'],
            user_agent=request.headers.get('User-Agent', ''),
            ip_address=get_client_ip()
        )
        
        db.session.add(submission)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Message received! We will get back to you soon.',
            'submission_id': submission.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/contact/<int:submission_id>', methods=['GET'])
def get_contact_submission(submission_id):
    """Get a specific contact submission"""
    submission = ContactSubmission.query.get(submission_id)
    if not submission:
        return jsonify({'error': 'Submission not found'}), 404
    return jsonify(submission.to_dict()), 200

# ============================================================
# ANALYTICS API
# ============================================================

@app.route('/api/analytics/track', methods=['POST'])
def track_analytics():
    """Track user analytics events"""
    try:
        data = request.get_json()
        
        log = AnalyticsLog(
            session_id=data.get('session_id'),
            page=data.get('page'),
            event_type=data.get('event_type'),
            event_data=data.get('event_data'),
            user_agent=request.headers.get('User-Agent', ''),
            ip_address=get_client_ip()
        )
        
        db.session.add(log)
        db.session.commit()
        
        return jsonify({'success': True}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/summary', methods=['GET'])
@admin_required
def get_analytics_summary():
    """Get analytics summary"""
    try:
        total_views = AnalyticsLog.query.filter_by(event_type='page_view').count()
        unique_sessions = db.session.query(AnalyticsLog.session_id).distinct().count()
        total_events = AnalyticsLog.query.count()
        
        page_views = db.session.query(
            AnalyticsLog.page,
            db.func.count(AnalyticsLog.id).label('count')
        ).filter_by(event_type='page_view').group_by(AnalyticsLog.page).all()
        
        return jsonify({
            'total_views': total_views,
            'unique_sessions': unique_sessions,
            'total_events': total_events,
            'page_views': {page[0]: page[1] for page in page_views}
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================
# ADMIN DASHBOARD API
# ============================================================

@app.route('/api/admin/submissions', methods=['GET'])
@admin_required
def get_all_submissions():
    """Get all contact submissions"""
    submissions = ContactSubmission.query.order_by(ContactSubmission.submitted_at.desc()).all()
    return jsonify([s.to_dict() for s in submissions]), 200

@app.route('/api/admin/submissions/<int:submission_id>/status', methods=['PUT'])
@admin_required
def update_submission_status(submission_id):
    """Update submission status"""
    try:
        submission = ContactSubmission.query.get(submission_id)
        if not submission:
            return jsonify({'error': 'Submission not found'}), 404
        
        data = request.get_json()
        if 'status' in data:
            submission.status = data['status']
            db.session.commit()
        
        return jsonify(submission.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/dashboard', methods=['GET'])
@admin_required
def admin_dashboard():
    """Admin dashboard data"""
    try:
        total_submissions = ContactSubmission.query.count()
        new_submissions = ContactSubmission.query.filter_by(status='new').count()
        total_analytics_events = AnalyticsLog.query.count()
        
        recent_submissions = ContactSubmission.query.order_by(
            ContactSubmission.submitted_at.desc()
        ).limit(10).all()
        
        return jsonify({
            'total_submissions': total_submissions,
            'new_submissions': new_submissions,
            'total_events': total_analytics_events,
            'recent_submissions': [s.to_dict() for s in recent_submissions]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================
# HEALTH CHECK
# ============================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'database': 'connected'
    }), 200

# ============================================================
# ERROR HANDLERS
# ============================================================

@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors"""
    try:
        return send_file('home.html')
    except:
        return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500

# ============================================================
# DATABASE INITIALIZATION
# ============================================================

def init_database():
    """Initialize database tables"""
    with app.app_context():
        db.create_all()
        print("✅ Database initialized!")

# ============================================================
# MAIN
# ============================================================

if __name__ == '__main__':
    # Initialize database
    init_database()
    
    # Run server
    debug_mode = os.environ.get('FLASK_ENV') == 'development'
    port = int(os.environ.get('PORT', 3000))
    
    print(f"🚀 Starting EGA Mentorship Backend Server on port {port}")
    print(f"📊 Admin Dashboard: http://localhost:{port}/admin?password={ADMIN_PASSWORD}")
    
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
