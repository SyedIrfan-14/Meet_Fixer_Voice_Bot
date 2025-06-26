import { useState } from 'react';

function App() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Your browser does not support Speech Recognition');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setTranscript(speechText);
      console.log('🎙 Recognized:', speechText);

      
      fetch('http://localhost:5678/webhook-test/your-n8n-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: speechText }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Sent to n8n:', data);
        })
        .catch((err) => {
          console.error('Error sending to n8n:', err);
        });
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>🎤 Voice Assistant</h1>
      <button onClick={startListening} disabled={isListening}>
        {isListening ? 'Listening...' : 'Start Speaking'}
      </button>
      <p><strong>Transcript:</strong> {transcript}</p>
    </div>
  );
}

export default App;