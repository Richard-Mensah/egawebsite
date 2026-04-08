"""
EGA Mentorship Website - Vercel Deployment Handler
Serves the static HTML website on Vercel
"""

from flask import Flask, send_file
import os

app = Flask(__name__)

@app.route('/')
def home():
    """Serve the main HTML file"""
    return send_file('EGA_Website_index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files (images, etc.)"""
    try:
        return send_file(filename)
    except FileNotFoundError:
        # If file not found, serve the main HTML (for client-side routing)
        return send_file('EGA_Website_index.html')

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 3000)))
