const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Authentication Middleware
const basicAuth = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) return res.sendStatus(401);
    const [username, password] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
    if (username === process.env.USERNAME && password === process.env.PASSWORD) {
        next();
    } else {
        res.sendStatus(403);
    }
};

// OpenAI API Configuration
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Streaming chatbot endpoint
app.post('/api/chat', basicAuth, async (req, res) => {
    const messages = req.body.messages;
    const stream = openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: messages,
        stream: true,
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const part of stream) {
        res.write(`data: ${JSON.stringify(part)}\n\n`);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
