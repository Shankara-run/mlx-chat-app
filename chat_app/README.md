# MLX Chat Web App

A personal AI companion web app with chat and notes functionality, powered by a local MLX LLM model (Gemma 3 4B IT 4-bit).

## Features

- **Dark Mode UI**: Modern, eye-friendly dark theme with chat bubbles
- **AI Chat**: Multi-turn conversations with markdown support and copyable code blocks
- **Notes System**: Save and view personal notes with persistence
- **Real-time Interaction**: AJAX-powered chat for smooth user experience
- **Persistent Storage**: SQLite database for chat history and notes
- **Local LLM**: Runs entirely on your machine using MLX framework

## Prerequisites

- Python 3.8 or higher
- macOS (for MLX compatibility)
- At least 8GB RAM recommended

## Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd chat_app
   ```
3. Create a virtual environment (recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

1. Run the application:
   ```bash
   python app.py
   ```
2. Open your browser and navigate to `http://localhost:5000`

### Chat Tab
- Type your message in the input field
- Press Enter or click Send to chat with the AI
- Messages support markdown formatting (bold, italic, code blocks, lists, etc.)
- Code blocks include copy buttons for easy copying

### Notes Tab
- Write notes in the textarea
- Click "Save Note" to store them
- View all saved notes below the input area

## Model Information

- **Model**: `mlx-community/gemma-3-4b-it-4bit`
- **Framework**: MLX (Apple's machine learning framework)
- **Size**: 4-bit quantized for efficient local inference
- **Capabilities**: Text generation, conversation, code assistance

## Project Structure

```
chat_app/
├── app.py                 # Flask backend application
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── .gitignore            # Git ignore rules
├── chat_history.db       # SQLite database (auto-generated)
├── templates/
│   └── index.html        # Main HTML template
└── static/
    ├── css/
    │   └── styles.css    # Dark mode styling
    └── js/
        └── chat.js       # Frontend JavaScript
```

## API Endpoints

- `GET /`: Main page
- `POST /chat`: Send message and get AI response
- `GET /notes`: Retrieve saved notes
- `POST /notes`: Save a new note

## Customization

- **Model**: Change the model in `app.py` by modifying the `load()` call
- **Styling**: Edit `static/css/styles.css` for theme customization
- **Features**: Extend functionality by adding new routes and UI elements

## Troubleshooting

- **Model Loading Issues**: Ensure you have sufficient RAM and the model files are accessible
- **Port Conflicts**: Change the port in `app.py` if 5000 is in use
- **Dependencies**: Use `pip install --upgrade` if you encounter version conflicts

## License

This project is open source. Feel free to modify and distribute.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.
