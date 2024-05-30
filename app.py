from flask import Flask, request, jsonify
import cv2
import numpy as np
from collections import Counter

app = Flask(__name__)

def get_dominant_colors(image, k=5):
    # Convert the image to RGB
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    # Reshape the image to be a list of pixels
    pixels = image.reshape(-1, 3)
    # Convert to float type for k-means
    pixels = np.float32(pixels)
    # Define criteria and apply k-means
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.2)
    _, labels, palette = cv2.kmeans(pixels, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
    # Count each label
    _, counts = np.unique(labels, return_counts=True)
    # Get the index of the most frequent colors
    dominant_colors = [palette[i] for i in np.argsort(counts)[::-1]]
    return dominant_colors

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected for uploading"}), 400
    # Read the image file
    image = np.fromstring(file.read(), np.uint8)
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    # Get dominant colors
    colors = get_dominant_colors(image)
    # Convert colors to JSON-serializable format
    colors_list = [{"r": int(c[0]), "g": int(c[1]), "b": int(c[2])} for c in colors]
    return jsonify({"dominant_colors": colors_list})

@app.route('/')
def home():
    return "Welcome to the Color Detection API!"

if __name__ == '__main__':
    app.run(debug=True)
