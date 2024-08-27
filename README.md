
---

### **Frontend README**

```markdown
# InteRact Frontend

Welcome to the **InteRact Frontend** repository! This is the frontend part of the InteRact application, a real-time communication platform that includes chat and video calling. The frontend is built with React, utilizing Redux for state management, and styled with Tailwind CSS.

## **Table of Contents**
- [Introduction](#introduction)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## **Introduction**
InteRact is designed to provide a seamless and interactive user experience for real-time communication. This frontend application interacts with the backend via REST APIs and WebSockets to deliver real-time messaging and video calling features.

## **Features**
- **User Authentication**: Sign-up, login, and session management using JWT.
- **Real-Time Chat**: Instant messaging with WebSocket integration.
- **Video Calling**: Integrated video call functionality using WebRTC.
- **Responsive Design**: Built with Tailwind CSS for a responsive user interface.

## **Project Structure**
- **`src/`**
  - **`components/`**: Contains reusable components organized by functionality.
    - `authentication/`: Handles login and registration.
    - `home/`: Manages chat components like `ChatItems`, `ChatList`, and more.
    - `videoCall/`: Components for video call interface.
  - **`pages/`**: Represents different pages such as `HomePage`, `LoginPage`, `RegisterPage`.
  - **`redux/`**: Manages global state using Redux with slices and thunks.
  - **`services/`**: Contains API service functions for authentication, chat, and WebSocket connections.
  - **`routes/`**: Defines public and protected routes.
  - **`hooks/`**: Custom hooks for reusable logic.
  - **`assets/`**: Contains static assets like images.

## **Installation**
### **Prerequisites**
- Node.js 14+
- npm 6+

### **Steps**
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sajal-techie/InteRact-frontend.git
   cd InteRact-frontend
   ```
2. **Install dependencies**
    ```bash
    npm install
    ```
3. **npm run dev**
    ```bash
    npm run dev
    ```