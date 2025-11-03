from flask import Flask, request, jsonify, render_template
from mlx_lm import load, generate
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)

# Global models
chat_model = None
chat_tokenizer = None

def init_chat_model():
    global chat_model, chat_tokenizer
    if chat_model is None:
        chat_model, chat_tokenizer = load("mlx-community/gemma-3-4b-it-4bit")

def get_db_connection():
    conn = sqlite3.connect('chat_history.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute('''CREATE TABLE IF NOT EXISTS messages (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        role TEXT NOT NULL,
                        content TEXT NOT NULL,
                        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                    )''')
    conn.execute('''CREATE TABLE IF NOT EXISTS notes (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        content TEXT NOT NULL,
                        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                    )''')

    conn.commit()
    conn.close()

def save_message(role, content):
    conn = get_db_connection()
    conn.execute('INSERT INTO messages (role, content) VALUES (?, ?)', (role, content))
    conn.commit()
    conn.close()

def load_history():
    conn = get_db_connection()
    messages = conn.execute('SELECT role, content FROM messages ORDER BY timestamp').fetchall()
    conn.close()
    return [{'role': row['role'], 'content': row['content']} for row in messages]

def save_note(content):
    conn = get_db_connection()
    conn.execute('INSERT INTO notes (content) VALUES (?)', (content,))
    conn.commit()
    conn.close()

def load_notes():
    conn = get_db_connection()
    notes = conn.execute('SELECT content FROM notes ORDER BY timestamp DESC').fetchall()
    conn.close()
    return [row['content'] for row in notes]



@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    try:
        init_chat_model()

        # Load conversation history (limit to last 10 messages to avoid template issues)
        conversation = load_history()[-10:]
        conversation.append({'role': 'user', 'content': user_message})

        # Apply chat template
        prompt = chat_tokenizer.apply_chat_template(conversation, add_generation_prompt=True)

        # Generate response
        response = generate(chat_model, chat_tokenizer, prompt=prompt, max_tokens=4000, verbose=False)

        # Save user message and response
        save_message('user', user_message)
        save_message('assistant', response)

        return jsonify({'response': response})
    except Exception as e:
        return jsonify({'error': f'Chat error: {str(e)}'}), 500

@app.route('/notes', methods=['GET', 'POST'])
def notes():
    if request.method == 'POST':
        data = request.get_json()
        note_content = data.get('note', '')
        if note_content:
            save_note(note_content)
            return jsonify({'status': 'Note saved'})
        return jsonify({'error': 'No note provided'}), 400
    else:
        notes_list = load_notes()
        return jsonify({'notes': notes_list})





if __name__ == '__main__':
    init_db()
    try:
        app.run(debug=True, port=5000)
    except KeyboardInterrupt:
        print("Server shutting down...")
        # Perform any cleanup if needed
        pass
