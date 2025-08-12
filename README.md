Opal (now VEMO)
<p align="center">
<img src="https://github.com/user-attachments/assets/0e5959b3-286e-4b15-a752-3fd26e490a1c" alt="VEMO Banner" width="800"/>
</p>

<p align="center">
<strong>VEMO: Video Editing & Management Optimization</strong>
<br />
A comprehensive platform designed to streamline screen recording, AI-powered analysis, and collaborative video workflows.
</p>

<p align="center">
<a href="https://github.com/faiz7077/Opal-web/issues">Report Bug</a>
·
<a href="https://github.com/faiz7077/Opal-web/issues">Request Feature</a>
</p>

The Problem
In today's fast-paced business environment, traditional text-based communication is often inefficient, leading to misinterpretations, delayed feedback, and lost opportunities. While video messaging is a powerful alternative, existing solutions can be clunky. They might rely on unstable third-party libraries, lack real-time engagement features, or are too complex to integrate seamlessly into daily workflows.

The Solution: VEMO
VEMO addresses these challenges head-on. It's a streamlined, high-quality video messaging platform that empowers users to record, share, and manage video content effortlessly. By integrating real-time recording, AI-powered summaries, and intuitive collaboration tools, VEMO enhances business communication, boosts outreach, and drives productivity.

✨ Key Features
🌐 Web Application (Next.js)
🚀 Workspace Management: Create dedicated workspaces for different teams or projects. Invite collaborators and grow your team seamlessly.

📁 Smart Folder Organization: Keep your video projects tidy and accessible with a simple and powerful folder structure.

🎥 Instant Video Management: Preview, manage, and share your video recordings with a single click.

⚡ Real-Time Updates: Videos recorded on the desktop app appear in your web workspace instantly, ready for collaboration.

💻 Desktop Application (Electron.js)
🔴 High-Fidelity Recording: Capture your screen, camera feed, and audio in high quality.

☁️ Real-Time Uploads: Your recording is securely uploaded to the VEMO cloud as you record, eliminating wait times.

⚙️ Video Processing Server (Express.js)
🛠️ Robust Video Handling: A dedicated backend that processes, transcodes, and securely stores all video streams from the desktop application.

🔄 Seamless Synchronization: Ensures video details and statuses are updated in real-time on the web application.

🛠️ Tech Stack
Category	Technologies
Frontend	Next.js, React, Redux Toolkit, Tailwind CSS
Backend	Node.js, Express.js
Desktop App	Electron.js
Authentication	Clerk
Payments	Stripe
AI & Services	OpenAI API
Cloud & CDN	Cloudinary (Storage), AWS CloudFront (Streaming), Mailgun/Nodemailer (Email)
Database	Prisma (ORM) with PostgreSQL (or your preferred SQL DB)

Export to Sheets
🏛️ System Architecture
VEMO operates as a cohesive system with three core components:

Record: The Electron Desktop App captures the user's screen, camera, and audio.

Process: The app streams the recording in real-time to the Express.js Server, which processes the video, stores it, and prepares it for streaming.

Collaborate: The Next.js Web App is notified of the new video, allowing the user and their team to immediately view, share, and collaborate on the content.

📂 Project Repositories
This project is split into three repositories to maintain a clean separation of concerns:

🌐 VEMO Web App: The Next.js frontend for video management and collaboration.

💻 VEMO Desktop App: The Electron.js app for screen recording.

⚙️ VEMO Server: The Express.js backend for video processing.

🚀 Getting Started
To get the web application running locally, follow these steps.

Prerequisites
Node.js (v18 or later)

bun package manager (npm install -g bun)

Installation & Setup
Clone the Web App repository:

Bash

git clone https://github.com/faiz7077/Opal-web.git
Navigate to the project directory:

Bash

cd Opal-web
Install dependencies:

Bash

bun install
Set up your environment variables:
Create a .env file in the root of the Opal-web directory and populate it with your credentials. See the section below for details.

Start the development server:

Bash

bun run dev
Your application should now be running on http://localhost:3000.

Environment Variables (.env)
You will need to create a .env file in the root of your project and add the following variables.

Code snippet

# Prisma Database Connection URL
# Example: postgresql://user:password@host:port/database
DATABASE_URL=

# Clerk Authentication Keys (https://clerk.dev/)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Clerk Redirect URLs (update if your domain changes)
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/auth/callback
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/auth/callback

# Stripe Payment Gateway Keys (https://stripe.com/)
NEXT_PUBLIC_STRIPE_PUBLISH_KEY=

# OpenAI API Key (for AI-powered features)
OPEN_AI_KEY=

# Cloudinary & AWS CloudFront Details (for video storage and streaming)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL=

# Email Service Credentials (for sending notifications, invites, etc.)
MAILER_EMAIL=
MAILER_PASSWORD=

# (Optional) Cloudways Post variable if needed for your deployment
CLOUD_WAYS_POST=
Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

License
Distributed under the MIT License. See LICENSE for more information.
