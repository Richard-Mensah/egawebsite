"""
EGA Mentorship Website - Vercel Serverless API Handler
Handles all backend operations in serverless environment
"""

from flask import Flask, send_file, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os
import sys
import tempfile

# Configure app for serverless
app = Flask(__name__, static_folder='..', static_url_path='')

# ============================================================
# CONFIGURATION FOR SERVERLESS
# ============================================================

# Use temporary directory for database (Vercel ephemeral storage)
# In production, consider using: MongoDB Atlas, Firebase, Supabase, etc.
try:
    DB_PATH = f'sqlite:///{tempfile.gettempdir()}/ega_data.db'
except:
    DB_PATH = 'sqlite:////tmp/ega_data.db'

app.config['SQLALCHEMY_DATABASE_URI'] = DB_PATH
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_pre_ping': True,
    'pool_recycle': 300,
    'pool_size': 1,
    'max_overflow': 0,
}
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['JSON_SORT_KEYS'] = False

# Admin Configuration
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')

# Initialize extensions
db = SQLAlchemy(app)
CORS(app, supports_credentials=True)

# ============================================================
# DATABASE MODELS
# ============================================================

class ContactSubmission(db.Model):
    """Contact form submissions"""
    __tablename__ = 'contact_submission'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    user_agent = db.Column(db.String(500))
    ip_address = db.Column(db.String(50))
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='new')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'subject': self.subject,
            'message': self.message,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None,
            'status': self.status
        }

class AnalyticsLog(db.Model):
    """Analytics tracking"""
    __tablename__ = 'analytics_log'
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(100))
    page = db.Column(db.String(100))
    event_type = db.Column(db.String(50))
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
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }

# ============================================================
# DATABASE INITIALIZATION (Lazy - on first request)
# ============================================================

_db_initialized = False

def ensure_db():
    """Initialize database on first request"""
    global _db_initialized
    if not _db_initialized:
        try:
            with app.app_context():
                db.create_all()
            _db_initialized = True
        except Exception as e:
            print(f"[WARNING] Database initialization: {e}")
            _db_initialized = True  # Don't retry on every request

# ============================================================
# HELPER FUNCTIONS
# ============================================================

def get_client_ip():
    """Get client IP address"""
    if request.headers.get('X-Forwarded-For'):
        return request.headers.get('X-Forwarded-For').split(',')[0].strip()
    return request.remote_addr or '0.0.0.0'

def check_admin():
    """Check admin password - returns True if authorized"""
    try:
        password = None
        if request.method == 'GET':
            password = request.args.get('password')
        elif request.is_json:
            data = request.get_json() or {}
            password = data.get('password')
        return password and password == ADMIN_PASSWORD
    except:
        return False

# ============================================================
# BEFORE REQUEST - Initialize DB
# ============================================================

@app.before_request
def before_request():
    ensure_db()

# ============================================================
# STATIC FILE ROUTES
# ============================================================

@app.route('/')
def index():
    """Serve home page"""
    try:
        return send_file('../home.html', mimetype='text/html')
    except Exception as e:
        return jsonify({'error': 'Home page not found', 'details': str(e)}), 404

@app.route('/<path:path>')
def serve_file(path):
    """Serve static files (HTML, CSS, JS, etc.)"""
    if not path:
        return index()
    
    try:
        file_path = f'../{path}'
        
        # Determine MIME type
        if path.endswith('.html'):
            return send_file(file_path, mimetype='text/html')
        elif path.endswith('.css'):
            return send_file(file_path, mimetype='text/css')
        elif path.endswith('.js'):
            return send_file(file_path, mimetype='application/javascript')
        elif path.endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg')):
            return send_file(file_path)
        else:
            return send_file(file_path)
            
    except FileNotFoundError:
        try:
            # Try serving as HTML for client-side routing
            return send_file('../home.html', mimetype='text/html')
        except:
            return jsonify({'error': 'Not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================
# CONTACT FORM API
# ============================================================

@app.route('/api/contact', methods=['POST', 'OPTIONS'])
def submit_contact_form():
    """Handle contact form submissions"""
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        data = request.get_json() or {}
        
        # Validate required fields
        required_fields = ['name', 'email', 'subject', 'message']
        missing = [f for f in required_fields if f not in data or not data[f]]
        if missing:
            return jsonify({'error': f'Missing fields: {", ".join(missing)}'}), 400
        
        # Create contact submission
        submission = ContactSubmission(
            name=str(data['name']).strip()[:120],
            email=str(data['email']).strip()[:120],
            subject=str(data['subject']).strip()[:200],
            message=str(data['message']).strip(),
            user_agent=request.headers.get('User-Agent', '')[:500],
            ip_address=get_client_ip()[:50]
        )
        
        db.session.add(submission)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Message received! We will get back to you soon.',
            'submission_id': submission.id
        }), 201
        
    except Exception as e:
        try:
            db.session.rollback()
        except:
            pass
        return jsonify({'error': str(e)}), 500

@app.route('/api/contact/<int:submission_id>', methods=['GET'])
def get_contact_submission(submission_id):
    """Get a specific contact submission"""
    try:
        submission = ContactSubmission.query.get(submission_id)
        if not submission:
            return jsonify({'error': 'Submission not found'}), 404
        return jsonify(submission.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================
# ANALYTICS API
# ============================================================

@app.route('/api/analytics/track', methods=['POST', 'OPTIONS'])
def track_analytics():
    """Track user analytics events"""
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        data = request.get_json() or {}
        
        log = AnalyticsLog(
            session_id=str(data.get('session_id', ''))[:100],
            page=str(data.get('page', ''))[:100],
            event_type=str(data.get('event_type', ''))[:50],
            event_data=data.get('event_data'),
            user_agent=request.headers.get('User-Agent', '')[:500],
            ip_address=get_client_ip()[:50]
        )
        
        db.session.add(log)
        db.session.commit()
        
        return jsonify({'success': True}), 201
        
    except Exception as e:
        try:
            db.session.rollback()
        except:
            pass
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/summary', methods=['GET'])
def get_analytics_summary():
    """Get analytics summary"""
    if not check_admin():
        return jsonify({'error': 'Unauthorized'}), 401
    
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
def get_all_submissions():
    """Get all contact submissions"""
    if not check_admin():
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        submissions = ContactSubmission.query.order_by(ContactSubmission.submitted_at.desc()).all()
        return jsonify([s.to_dict() for s in submissions]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/submissions/<int:submission_id>/status', methods=['PUT', 'OPTIONS'])
def update_submission_status(submission_id):
    """Update submission status"""
    if request.method == 'OPTIONS':
        return '', 204
    
    if not check_admin():
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        submission = ContactSubmission.query.get(submission_id)
        if not submission:
            return jsonify({'error': 'Submission not found'}), 404
        
        data = request.get_json() or {}
        if 'status' in data:
            submission.status = str(data['status']).strip()[:20]
            db.session.commit()
        
        return jsonify(submission.to_dict()), 200
        
    except Exception as e:
        try:
            db.session.rollback()
        except:
            pass
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/dashboard', methods=['GET'])
def admin_dashboard():
    """Admin dashboard data"""
    if not check_admin():
        return jsonify({'error': 'Unauthorized'}), 401
    
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

@app.route('/api/health', methods=['GET', 'OPTIONS'])
def health_check():
    """Health check endpoint"""
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'database': 'connected'
        }), 200
    except Exception as e:
        return jsonify({'status': 'unhealthy', 'error': str(e)}), 500

# ============================================================
# ERROR HANDLERS
# ============================================================

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    try:
        return send_file('../home.html', mimetype='text/html')
    except:
        return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(error):
    """Handle 500 errors"""
    return jsonify({
        'error': 'Internal server error',
        'type': type(error).__name__,
        'message': str(error)
    }), 500

# ============================================================
# WSGI EXPORT FOR VERCEL
# ============================================================

# This is what Vercel looks for
application = app

    except Exception as e:
        print(f"Database initialization warning: {e}")

# Initialize on startup
init_db()

# ============================================================
# HELPER FUNCTIONS
# ============================================================

def get_client_ip():
    """Get client IP address"""
    return request.headers.get('X-Forwarded-For', request.remote_addr).split(',')[0].strip()

def check_admin(f):
    """Check admin password"""
    password = None
    if request.method == 'GET':
        password = request.args.get('password')
    elif request.is_json:
        password = request.get_json().get('password')
    
    if not password or password != ADMIN_PASSWORD:
        return False
    return True

# ============================================================
# STATIC FILE ROUTES
# ============================================================

@app.route('/')
def index():
    """Serve home page"""
    try:
        return send_file('../home.html', mimetype='text/html')
    except:
        return jsonify({'error': 'Home page not found'}), 404

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files"""
    try:
        if path.endswith('.html'):
            return send_file(f'../{path}', mimetype='text/html')
        elif path.endswith('.css'):
            return send_file(f'../{path}', mimetype='text/css')
        elif path.endswith('.js'):
            return send_file(f'../{path}', mimetype='application/javascript')
        else:
            return send_file(f'../{path}')
    except FileNotFoundError:
        # Try to serve as HTML for client-side routing
        try:
            return send_file('../home.html', mimetype='text/html')
        except:
            return jsonify({'error': 'Not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================
# CONTACT FORM API
# ============================================================

@app.route('/api/contact', methods=['POST', 'OPTIONS'])
def submit_contact_form():
    """Handle contact form submissions"""
    if request.method == 'OPTIONS':
        return '', 200
    
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
        try:
            db.session.rollback()
        except:
            pass
        return jsonify({'error': str(e)}), 500

@app.route('/api/contact/<int:submission_id>', methods=['GET'])
def get_contact_submission(submission_id):
    """Get a specific contact submission"""
    try:
        submission = ContactSubmission.query.get(submission_id)
        if not submission:
            return jsonify({'error': 'Submission not found'}), 404
        return jsonify(submission.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================
# ANALYTICS API
# ============================================================

@app.route('/api/analytics/track', methods=['POST', 'OPTIONS'])
def track_analytics():
    """Track user analytics events"""
    if request.method == 'OPTIONS':
        return '', 200
    
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
        try:
            db.session.rollback()
        except:
            pass
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/summary', methods=['GET'])
def get_analytics_summary():
    """Get analytics summary"""
    if not check_admin(None):
        return jsonify({'error': 'Unauthorized'}), 401
    
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
def get_all_submissions():
    """Get all contact submissions"""
    if not check_admin(None):
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        submissions = ContactSubmission.query.order_by(ContactSubmission.submitted_at.desc()).all()
        return jsonify([s.to_dict() for s in submissions]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/submissions/<int:submission_id>/status', methods=['PUT', 'OPTIONS'])
def update_submission_status(submission_id):
    """Update submission status"""
    if request.method == 'OPTIONS':
        return '', 200
    
    if not check_admin(None):
        return jsonify({'error': 'Unauthorized'}), 401
    
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
        try:
            db.session.rollback()
        except:
            pass
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/dashboard', methods=['GET'])
def admin_dashboard():
    """Admin dashboard data"""
    if not check_admin(None):
        return jsonify({'error': 'Unauthorized'}), 401
    
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

@app.route('/api/health', methods=['GET', 'OPTIONS'])
def health_check():
    """Health check endpoint"""
    if request.method == 'OPTIONS':
        return '', 200
    
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
        return send_file('../home.html', mimetype='text/html')
    except:
        return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

# ============================================================
# EXPORT FOR VERCEL
# ============================================================

# For local development
if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 3000)))
