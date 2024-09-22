# Angular Chat

## Overview

This is a simple chat application built with Angular, utilizing WebSockets for real-time communication. The application allows users to set their username and send messages to each other in real time.

## Features

- **Real-time messaging**: Users can send and receive messages instantly using WebSocket.
- **User-friendly UI**: The application is designed with Angular Material for a responsive and aesthetically pleasing interface.
- **Username management**: Users can enter their names and see them displayed in the chat.

## Technologies Used

- **Frontend**: Angular, Angular Material
- **Backend**: Node.js, Express, WebSocket
- **WebSocket**: For real-time communication between clients

## Installation

### Prerequisites

- Node.js (>= 14.x)
- Angular CLI (>= 12.x)

### Build/Host
## Method 1 (No install) (Online)
### This method is based on **Stackblitz**
1. **Open this project in your broswer**
    Here
2. **Done!**
## Method 2 (Local)
1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```


2. **Start the backend server**:

   Navigate to the server folder `/src` and run:

   ```bash
   node server.js
   ```

3. **Install dependencies And Start the Angular application**:

   In a separate terminal window, navigate to the Angular application folder **and edit the server URL** and run:

   ```bash
   npm install && npm start
   ```

5. **Open the application**:

   Open your browser and go to `http://localhost:4200`.

## Usage

- Upon loading the application, users will be prompted to enter their name via a dialog.
- After setting a name, users can send messages by typing in the input field and pressing Enter or clicking the Send button.
- All messages will be displayed in real-time in the chat area.

## Code Structure

### Frontend (Angular)

- **app.component.ts**: Main component for handling chat functionality.
- **name-dialog.component.ts**: Component for entering the username.
- **WebSocket**: Manages the connection to the server and handles incoming/outgoing messages.

### Backend (Node.js)

- **server.js**: Sets up an Express server and initializes a WebSocket server for handling client connections and message broadcasting.

## Contributing

Feel free to submit issues or pull requests. Any contributions are welcome!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Angular](https://angular.io/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

---
