from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)
MUSIC_FOLDER = os.path.join(os.path.dirname(__file__), 'music')

@app.route('/')
def index():
    # List all mp3 files
    songs = [f for f in os.listdir(MUSIC_FOLDER) if f.endswith('.mp3')]
    return render_template('index.html', songs=songs)

@app.route('/music/<filename>')
def serve_music(filename):
    return send_from_directory(MUSIC_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True)
    