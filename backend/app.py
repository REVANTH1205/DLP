from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enables CORS for all routes

UPLOAD_FOLDER = 'uploaded_files'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# In-memory storage for audit logs and alerts
audit_logs = []
alerts = []

# Initialize a dictionary to store file metadata, including sensitivity
file_metadata = {}

@app.route('/files', methods=['GET'])
def list_files():
    try:
        files = []
        for filename in os.listdir(app.config['UPLOAD_FOLDER']):
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            if os.path.isfile(filepath):
                files.append({
                    'filename': filename,
                    'size': os.path.getsize(filepath),
                    'sensitivity': file_metadata.get(filename, 'low')  # Default sensitivity is low
                })
        return jsonify(files)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        file = request.files['file']
        sensitivity = request.form.get('sensitivity', 'low')
        user = request.form.get('user', 'admin')
        role = request.form.get('role', 'admin')

        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)

        file_metadata[file.filename] = sensitivity

        log_action('upload', user, f'Uploaded file {file.filename}', role)

        return jsonify({'message': 'File uploaded successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/files/<filename>', methods=['GET'])
def download_file(filename):
    user = request.headers.get('user', 'admin')
    role = request.headers.get('role', 'admin')
    try:
        log_action('download', user, f'Downloaded file {filename}', role)
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)
    except Exception as e:
        log_alert('Unauthorized Access', f'{user} attempted to download file {filename} without permission')
        return jsonify({'error': str(e)}), 404

@app.route('/files/<filename>', methods=['DELETE'])
def delete_file(filename):
    user = request.headers.get('user', 'unknown')
    role = request.headers.get('role', 'unknown')
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404

    if role != 'admin':
        log_action('unauthorized-delete', user, f'Tried to delete file {filename}', role)
        log_alert('Unauthorized Access', f'{user} with role {role} tried to delete file {filename}')
        return jsonify({'error': 'Unauthorized delete attempt'}), 403

    try:
        os.remove(filepath)
        log_action('delete', user, f'Deleted file {filename}', role)
        return jsonify({'message': f'File {filename} deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/audit-logs', methods=['GET'])
def get_audit_logs():
    return jsonify(audit_logs)

@app.route('/alerts', methods=['GET'])
def get_alerts():
    return jsonify(alerts)

def log_action(action, user, details, role):
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    audit_logs.append({
        'timestamp': timestamp,
        'action': action,
        'user': user,
        'role': role,
        'details': details
    })

def log_alert(alert_type, message):
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    alerts.append({
        'timestamp': timestamp,
        'type': alert_type,
        'message': message
    })

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True, port=5000)
