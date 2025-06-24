from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# In-memory storage for the music player
playlist = []
current_song_index = 0

@app.route('/')
def home():
    return render_template('music_player.html', playlist=playlist, current_index=current_song_index)

@app.route('/api/playlist', methods=['GET'])
def get_playlist():
    return jsonify({
        'playlist': playlist,
        'current_index': current_song_index
    })

@app.route('/api/add_song', methods=['POST'])
def add_song():
    global playlist
    data = request.get_json()
    
    if not data or 'song_name' not in data or 'song_url' not in data:
        return jsonify({'success': False, 'error': 'Missing song name or URL'})
    
    song_name = data['song_name'].strip()
    song_url = data['song_url'].strip()
    
    if not song_name or not song_url:
        return jsonify({'success': False, 'error': 'Song name and URL cannot be empty'})
    
    new_song = {
        'name': song_name,
        'url': song_url
    }
    
    playlist.append(new_song)
    return jsonify({'success': True, 'playlist': playlist})

@app.route('/api/remove_song', methods=['POST'])
def remove_song():
    global playlist, current_song_index
    data = request.get_json()
    
    if not data or 'index' not in data:
        return jsonify({'success': False, 'error': 'Missing index'})
    
    index = data['index']
    
    if index < 0 or index >= len(playlist):
        return jsonify({'success': False, 'error': 'Invalid index'})
    
    playlist.pop(index)
    
    # Adjust current song index if necessary
    if current_song_index >= len(playlist) and len(playlist) > 0:
        current_song_index = len(playlist) - 1
    elif len(playlist) == 0:
        current_song_index = 0
    elif current_song_index > index:
        current_song_index -= 1
    
    return jsonify({
        'success': True,
        'playlist': playlist,
        'current_index': current_song_index
    })

@app.route('/api/set_current', methods=['POST'])
def set_current_song():
    global current_song_index
    data = request.get_json()
    
    if not data or 'index' not in data:
        return jsonify({'success': False, 'error': 'Missing index'})
    
    index = data['index']
    
    if index < 0 or index >= len(playlist):
        return jsonify({'success': False, 'error': 'Invalid index'})
    
    current_song_index = index
    return jsonify({'success': True, 'current_index': current_song_index})

@app.route('/api/next_song', methods=['POST'])
def next_song():
    global current_song_index
    
    if len(playlist) == 0:
        return jsonify({'success': False, 'error': 'No songs in playlist'})
    
    current_song_index = (current_song_index + 1) % len(playlist)
    return jsonify({'success': True, 'current_index': current_song_index})

@app.route('/api/previous_song', methods=['POST'])
def previous_song():
    global current_song_index
    
    if len(playlist) == 0:
        return jsonify({'success': False, 'error': 'No songs in playlist'})
    
    current_song_index = (current_song_index - 1) % len(playlist)
    return jsonify({'success': True, 'current_index': current_song_index})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
