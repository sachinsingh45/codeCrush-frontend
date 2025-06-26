# CodeCrush - Frontend

CodeCrush is a platform where coders and developers can **connect and communicate** in real-time. The frontend is built using **React.js**, powered by **Vite** for fast development, and styled with **Tailwind CSS**. The backend is built with **Node.js** and **Express**, using **MongoDB** for data storage and **Socket.io** for real-time interactions.

## Features 🚀

### 🔐 Authentication & User Management
- **User Registration & Login** with form validation
- **Profile Management** with editable user information
- **Profile Pictures** using RoboHash API for unique avatars
- **User Skills & About** sections for professional networking
- **Edit Profile** functionality with form controls

### 💬 Real-time Communication
- **Socket.io-powered Chat** for instant messaging
- **Private Chat Rooms** with secure room generation
- **Message Persistence** with chat history
- **Chat with Connections** - only connected users can chat
- **Message Timestamps** and sender information
- **Real-time Message Updates** via WebSocket

### 👥 Social Networking
- **Connection System** - send and receive connection requests
- **User Discovery** - find new developers to connect with
- **Connection Status** tracking (pending, connected, none)
- **User Feed** - discover developers not yet connected
- **Public User Profiles** with detailed information
- **Connection Management** - view all your connections
- **User Cards** with connection actions

### 📝 Blog Platform
- **Blog Creation** with title, content, and tags
- **Blog Publishing System** with draft/published status
- **Tag-based Categorization** for easy discovery
- **Blog Search & Filtering** by tags, author, and content
- **Blog Interactions** - like, comment, and share functionality
- **Nested Comments** with like system
- **Read Time Calculation** for better user experience
- **Featured Images** support for blog posts
- **Blog Analytics** - view counts, engagement metrics
- **Blog Details** with full content display
- **Edit Blog** functionality for authors
- **Trending Blogs** section for popular content

### 🔍 Code Review System
- **Code Snippet Submission** with language detection
- **Peer Code Review** system for collaborative learning
- **Review Upvoting** to highlight quality feedback
- **AI-Powered Summaries** of top reviews (requires 3+ reviews)
- **Code Highlighting** with syntax highlighting
- **Review Statistics** and user performance tracking
- **Code Snippet Management** - edit and update submissions
- **Code Review Details** with full snippet and review display

### 🎨 User Interface & Experience
- **Responsive Design** optimized for all devices
- **Modern UI Components** with Tailwind CSS & DaisyUI
- **Smooth Animations** using Framer Motion
- **Loading States** and skeleton screens
- **Toast Notifications** for user feedback
- **Error Handling** with user-friendly messages
- **Navigation Bar** with user menu and notifications
- **Landing Page** with feature showcase and testimonials

## Screenshots 🖼️

### Home Page:

<img src="https://github.com/user-attachments/assets/ecf3c3ee-da81-4cf1-98cb-6b9ed969610f" width="600"/>

### Login Page:
<img src="https://github.com/user-attachments/assets/e235840a-82b9-4566-b31a-67f7f2324cc3" width="600"/>

### Chat Interface:
<img src="https://github.com/user-attachments/assets/24018b3c-974b-4c9e-bb2d-d00f6b58a885" width="600"/>

### User Profile:
<img src="https://github.com/user-attachments/assets/67b28908-4079-43a0-a4ea-b84c6d093f5f" width="600"/>

### Blogs:
<img src="https://github.com/user-attachments/assets/beb43cc4-4303-4201-920f-524e4316eb63" width="600"/>

### Code Snippet Review:
<img src="https://github.com/user-attachments/assets/d97616c0-f275-4c73-b927-bde0542da4cf" width="600"/>

### Reviews Summary by AI:
<img src="https://github.com/user-attachments/assets/8dfdbd1e-e920-440d-acfa-22c2882c5af7" width="600"/>

### Connection Page:
<img src="https://github.com/user-attachments/assets/55beea5f-7815-4da5-b653-020bdfa12630" width="600"/>

## Tech Stack 🛠️

### Frontend:
- **React.js** (v19) - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** & **DaisyUI** - For UI styling
- **React Router** (v7) - For navigation
- **Redux Toolkit** - For state management
- **Framer Motion** - For animations
- **Socket.io-client** - For real-time communication
- **React Toastify** - For notifications
- **React Markdown** - Markdown rendering
- **Prism React Renderer** - Code syntax highlighting
- **DOMPurify** - XSS protection
- **React Icons** - Icon library
- **date-fns** - Date manipulation
- **axios** - HTTP client

## Component Structure 📁

### Core Components
- **App.jsx** - Main application component with Redux provider
- **AppRoutes.jsx** - Route configuration and authentication guards
- **Body.jsx** - Layout wrapper with navigation
- **NavBar.jsx** - Navigation bar with user menu
- **LandingPage.jsx** - Homepage with feature showcase

### Authentication & Profile
- **Login.jsx** - User login form
- **Profile.jsx** - User profile display and management
- **EditProfile.jsx** - Profile editing form
- **UserProfile.jsx** - Public user profile view

### Social Features
- **DiscoverUsers.jsx** - User discovery and connection
- **Connections.jsx** - Manage user connections
- **Requests.jsx** - Handle connection requests
- **UserCard.jsx** - User card component with actions

### Communication
- **Chat.jsx** - Real-time chat interface
- **Socket Integration** - WebSocket connection management

### Blog System
- **BlogPage.jsx** - Blog listing with pagination
- **BlogDetails.jsx** - Individual blog post view
- **CreateBlog.jsx** - Blog creation form
- **EditBlog.jsx** - Blog editing form
- **TrendingBlogs.jsx** - Popular blogs display
- **MarkdownWithHighlight.jsx** - Markdown content renderer

### Code Review
- **CodeReviewPage.jsx** - Code snippet listing
- **CodeReviewDetails.jsx** - Individual snippet with reviews

### Utility Components
- **Spinner.jsx** - Loading spinner
- **Footer.jsx** - Application footer

## State Management 🔄

### Redux Store Structure
- **userSlice** - User authentication and profile state
- **feedSlice** - User discovery and feed state
- **requestSlice** - Connection request management
- **connectionSlice** - User connections state

### Key State Features
- **User Authentication** - Login/logout state management
- **Real-time Updates** - Socket connection state
- **Form Management** - Form state and validation
- **Navigation State** - Route protection and guards

## Installation & Setup 🛠️

### Frontend Setup:
```bash
# Clone the frontend repository
git clone https://github.com/sachinsingh45/codeCrush-frontend.git
cd codeCrush-frontend

# Install dependencies
npm install

# Create .env file for API configuration
VITE_API_BASE_URL=http://localhost:7777

# Run the development server
npm run dev
```

### Backend Setup: [CodeCrush-backend](https://github.com/sachinsingh45/codeCrush)
```bash
# Clone the backend repository
git clone https://github.com/sachinsingh45/codeCrush.git
cd codeCrush

# Install dependencies
npm install

# Create a .env file and configure your environment variables
PORT=7777
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region

# Start the backend server
npm run dev
```

## Environment Variables 🔧

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:7777
```

## Features in Detail 📱

### Real-time Chat System
- **Secure Room Generation**: Uses SHA-256 hashing for private chat rooms
- **Message Persistence**: All messages stored and retrieved from backend
- **Connection Validation**: Only connected users can chat
- **Real-time Updates**: Instant message delivery via Socket.io
- **Chat History**: Persistent message history across sessions
- **User Interface**: Clean chat interface with message bubbles

### Blog Platform Features
- **Content Support**: Blog creation with title, content, and tags
- **Advanced Filtering**: Search by title, content, tags, and author
- **Pagination**: Efficient loading of large blog collections
- **Engagement Tracking**: Like, comment, and share functionality
- **Author Controls**: Full CRUD operations for blog authors
- **Public/Private**: Draft and published status management
- **Markdown Rendering**: Rich content display with syntax highlighting

### Code Review System
- **Multi-language Support**: Automatic language detection
- **Quality Metrics**: Upvote-based review quality system
- **AI Integration**: Automated summary generation for top reviews
- **Peer Learning**: Collaborative code improvement platform
- **Performance Tracking**: User statistics and leaderboards
- **Code Highlighting**: Syntax highlighting for code snippets

### Social Networking
- **Smart Discovery**: Intelligent user recommendation system
- **Connection Management**: Comprehensive request handling
- **Profile Customization**: Rich user profiles with skills and bio
- **Professional Networking**: LinkedIn-style connection features
- **User Cards**: Interactive user cards with connection actions

### User Interface Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Modern Components**: Clean, professional UI with DaisyUI
- **Smooth Animations**: Engaging user experience with Framer Motion
- **Loading States**: Skeleton screens and spinners for better UX
- **Toast Notifications**: User feedback for actions
- **Error Handling**: Graceful error display and recovery

## Security Features 🔒

- **XSS Protection** using DOMPurify
- **Input Validation** with form controls
- **Authentication Guards** for protected routes
- **Secure API Communication** with axios
- **Environment Variable** protection

## Performance Optimizations 🎯

- **Vite Build** optimization for fast development
- **Code Splitting** with React Router
- **Redux State Management** for efficient data flow
- **Socket.io Optimization** for real-time features
- **Lazy Loading** of components where appropriate

## Usage ⚡
1. Ensure the **backend server** is running.
2. Start the **frontend** using `npm run dev`.
3. Open `http://localhost:5173/` (or the specified Vite port) in your browser.
4. Create an account and start **connecting with other developers**!

## Future Enhancements 🔥
- **1v1 Coding Battles** 🏆 (Mini LeetCode-style real-time challenges)
- **Code Collaboration (Live Coding Editor)**
- **AI-based code suggestions**
- **Leaderboard & Ranking System**
- **Spectator Mode for Code Battles**

## Contributing 🤝
We welcome contributions! Feel free to fork the repository and submit a pull request.

## License 📜
This project is licensed under the **MIT License**.

---
## 🧑‍💻 Contributors
- Sachin Singh - [GitHub](https://github.com/sachinsingh45)

---

🚀 Built with ❤️ by **Sachin Singh & Team**


