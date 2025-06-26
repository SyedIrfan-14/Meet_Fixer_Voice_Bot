# Voice-Controlled Meeting Scheduler

This is a full-stack voice-controlled meeting scheduling assistant built using React (Vite), Node.js, OpenRouter's LLaMA 3 model, n8n, and Twilio.

## Project Overview

The project lets users speak into a browser, transcribes their voice into text, extracts intent and details using an LLM (LLaMA 3 via OpenRouter), and schedules a meeting by making a phone call using Twilio.

---

## Folder Structure

```
voice-meeting-bot/
├── server/                 # Node.js backend
│   ├── index.js           # Express server entry point
│   └── parseIntent.js     # Function that queries LLaMA 3 to extract intent, contact, and datetime
|                # React (Vite) frontend
├── src/
│  └── App.jsx        # Voice-to-text UI and webhook POST
└── vite.config.js
```

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/voice-meeting-bot.git
cd voice-meeting-bot
```

### 2. Install Backend (server)

```bash
cd server
npm install express cors dotenv axios
```

#### Add `.env` file in `server/`

```
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

#### Start Backend

```bash
node index.js
```

> Server will run at `http://localhost:4000`

### 3. Install Frontend (client)

```bash
cd client
npm install
npm run dev
```

> Starts on `http://localhost:5173` (or another Vite port)

---

## Frontend: Vite React App

* Captures user speech using the Web Speech API
* Transcribes and sends the text to n8n webhook:

```javascript
fetch('http://localhost:5678/webhook-test/speech-input', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: speechText })
})
```

---

## Backend: Node.js API

### index.js

* Accepts POST requests at `/intent`
* Sends text to `parseIntent.js`

### parseIntent.js

* Sends prompt to OpenRouter's LLaMA 3 (meta-llama/llama-3-8b-instruct)
* Parses structured JSON response containing:

  * `intent`
  * `contact`
  * `datetime`

---

## n8n Workflow Description

The automation is built using self-hosted n8n (via Docker):

### Nodes Used:

1. **Webhook Node**

   * Method: POST
   * Path: `/webhook-test/speech-input`
   * Input: `{ "text": "call Alex on Friday at 4pm" }`

2. **HTTP Request Node**

   * POST to `http://host.docker.internal:4000/intent`
   * Sends the `text` to Node.js API
   * Receives structured response: `{ intent, contact, datetime }`

3. **Function Node** (optional)

   * Parses output if needed or builds custom TwiML/fields

4. **Twilio Node**

   * Makes a voice call to the `contact`
   * Uses TwiML Bin URL (or dynamic TwiML) to speak message

5. **MySQL Node** (optional if used)

   * Logs the transcript or extracted intent into a database for recordkeeping

### Video Workflow Demo

Upload your workflow video to GitHub or a cloud link (e.g., Google Drive or Loom).
You can embed or link it in this README for demonstration.

---

## Example Flow

1. User speaks: "Call Sara and book a meeting on Sunday at 4pm"
2. Transcription is sent to webhook
3. Webhook triggers HTTP request to Node.js API
4. API returns:

```json
{
  "intent": "schedule_meeting",
  "contact": "Sara",
  "datetime": "Sunday 4pm"
}
```

5. Twilio makes a call: “You have a meeting scheduled with Sara at 4 PM on Sunday.”

---

## Technologies Used

* **React (Vite)** – Frontend UI
* **Node.js + Express** – API server
* **n8n** – Automation workflow
* **OpenRouter LLaMA 3** – LLM for parsing intent
* **Twilio** – Voice call service
* **MySQL (Optional)** – Data logging

---

## Credits

* Built by Syed Irfan S R and Vtswamy
* Speech Recognition: Web Speech API
* LLM: OpenRouter + Meta LLaMA 3
* Orchestration: n8n

---

## Future Improvements

* Replace voice call with WhatsApp or SMS
* Add calendar integration (Google or Outlook)
* Admin panel to manage contacts and meetings
* Deploy with Railway or Render

---


