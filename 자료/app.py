from flask import Flask, request, jsonify
import os

app = Flask(__name__)

UPLOAD_FOLDER = 'C:/Users/Y/Desktop/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the directory exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/api/upload-csv', methods=['POST'])
def upload_csv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Save the file to the desired location
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    
    # Save with UTF-8 encoding
    with open(file_path, 'wb') as f:
        f.write(file.read())

    # Generate multiple file URLs
    file_urls = [
        f"http://localhost:5000/files/{file.filename}",     # First file URL
        f"http://localhost:5000/files/file2.csv",           # Second file URL (example)
        f"http://localhost:5000/files/file3.csv",           # Third file URL (example)
        f"http://localhost:5000/files/file4.csv"            # Fourth file URL (example)
    ]

    return jsonify(file_urls), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
