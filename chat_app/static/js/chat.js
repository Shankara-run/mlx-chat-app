document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatContainer = document.getElementById('chat-container');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const notesTextarea = document.getElementById('notes-textarea');
    const saveNotesButton = document.getElementById('save-notes-button');
    const notesList = document.getElementById('notes-list');

    function addMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', role + '-message');

        // Parse markdown and render HTML
        messageDiv.innerHTML = marked.parse(content);

        // Add copy buttons to code blocks
        const codeBlocks = messageDiv.querySelectorAll('pre code');
        codeBlocks.forEach(codeBlock => {
            const pre = codeBlock.parentElement;
            const copyButton = document.createElement('button');
            copyButton.textContent = 'Copy';
            copyButton.classList.add('copy-button');
            copyButton.addEventListener('click', function() {
                navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = 'Copy';
                    }, 2000);
                });
            });
            pre.insertBefore(copyButton, codeBlock);
        });

        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message === '') return;

        addMessage('user', message);
        messageInput.value = '';

        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.response) {
                addMessage('assistant', data.response);
            } else if (data.error) {
                addMessage('assistant', 'Error: ' + data.error);
            }
        })
        .catch(error => {
            addMessage('assistant', 'Error: ' + error.message);
        });
    }

    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(tab + '-tab').classList.add('active');
        });
    });

    // Notes functionality
    function saveNote() {
        const note = notesTextarea.value.trim();
        if (note === '') return;

        fetch('/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ note: note }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                notesTextarea.value = '';
                loadNotes();
            } else if (data.error) {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            alert('Error: ' + error.message);
        });
    }

    function loadNotes() {
        fetch('/notes')
        .then(response => response.json())
        .then(data => {
            notesList.innerHTML = '';
            data.notes.forEach(note => {
                const noteDiv = document.createElement('div');
                noteDiv.textContent = note;
                notesList.appendChild(noteDiv);
            });
        })
        .catch(error => {
            console.error('Error loading notes:', error);
        });
    }





    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    saveNotesButton.addEventListener('click', saveNote);

    // Load initial data
    loadNotes();
});
