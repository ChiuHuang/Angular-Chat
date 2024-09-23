const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
  <html lang="en">
    <head>
      <title>Building</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charset="UTF-8" />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="https://unpkg.com/mdui@2/mdui.css" />
      <script src="https://unpkg.com/mdui@2/mdui.global.js"></script>
      <style>
        body {
          background-color: #faf9fd;
        }
        body {
          overflow: hidden; /* Hide scrollbars */
        }
        .loading-container {
          text-align: center;
  
          font-family: 'Roboto', sans-serif;
          margin: 0;
          padding: 0;
          height: 100vh;
        }
      </style>
    </head>
    <body>
      <app-root>
        <div class="loading-container">
        <h4>Please wait a moment</h4>
          <h3>Building...</h3>
          <mdui-circular-progress></mdui-circular-progress>
        </div>
      </app-root>
    </body>
  </html>
  `);
});
// Store the chat history
let chatHistory = [];

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send the chat history to the newly connected client, one message at a time
  chatHistory.forEach((message) => {
    ws.send(
      JSON.stringify({
        text: message.text,
        sender: message.sender,
        timestamp: message.timestamp,
      })
    );
  });

  ws.on('message', (message) => {
    console.log('Received:', message.toString());

    const parsedMessage = JSON.parse(message);

    // Create a new message object
    const newMessage = {
      text: parsedMessage.text,
      sender: parsedMessage.sender,
      timestamp: new Date(),
    };

    // Add the new message to the chat history
    chatHistory.push(newMessage);

    // Broadcast the new message to all connected clients except the sender
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            text: newMessage.text,
            sender: newMessage.sender,
            timestamp: newMessage.timestamp,
          })
        );
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
