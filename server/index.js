import express from "express";
import cors from "cors";
import { config } from "dotenv";
import parseIntent from "./parseIntent.js";

config();

const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json()); // This parses incoming JSON

// POST /intent route
app.post('/intent', async (req, res) => {
    try {
        console.log('Incoming request body:', req.body); // Debug log

        if (!req.body || !req.body.text) {
            return res.status(400).json({ error: "Missing 'text' in request body" });
        }

        const { text } = req.body;
        const result = await parseIntent(text);
        res.json(result);

    } catch (err) {
        console.error('Error processing /intent request:', err);
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(4000, () => {
    console.log('LLM API server running at http://localhost:4000');
});