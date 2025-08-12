<div align="center">
<img src="http://googleusercontent.com/file_content/9" alt="Opal Banner" width="800"/>
</div>

<h1 align="center">Opal (Now VEMO): A Screen Recording and Collaborative Platform</h1>

<p align="center">
Opal is a comprehensive application designed to streamline screen recording and video collaboration workflows. It consists of three integrated components: a Next.js web application, an Electron.js-based desktop application, and an Express.js server for video processing.
</p>

Problem Statement
Traditional text-based communication and follow-ups in business interactions are often inefficient, leading to miscommunication and lost opportunities. Existing video recording and sharing solutions either rely on third-party libraries, lack real-time engagement features, or are too complex for seamless integration into workflows. There is a need for a streamlined, high-quality video messaging platform that enables users to record, share, and manage videos effortlessly. Opal aims to enhance business communication by providing real-time video recording, AI-powered summaries, collaboration tools, and instant sharing capabilities, improving outreach, engagement, and productivity.

Live Demo & Screenshots
Dashboard and Workspaces
Here's a look at the main dashboard, showcasing folder organization and workspace management.

https://github.com/user-attachments/assets/0e5959b3-286e-4b15-a752-3fd26e490a1c

Recording Interface
A clean and intuitive interface for screen, camera, and audio recording.

<div align="center">
<img src="http://googleusercontent.com/file_content/4" alt="Recording Interface" width="700"/>
</div>

Opal Workspace
Easily manage your projects and collaborate with your team in a dedicated workspace.

<div align="center">
<img src="http://googleusercontent.com/file_content/5" alt="Opal Workspace" width="700"/>
</div>

Folder Organisation
Keep your video projects neatly organized within folders for quick access.

<div align="center">
<img src="http://googleusercontent.com/file_content/3" alt="Folder Organisation" width="700"/>
</div>

AI Features
Leverage AI to get summaries and insights from your video recordings, enhancing productivity.

<div align="center">
<img src="http://googleusercontent.com/file_content/2" alt="AI Features" width="700"/>
<img src="http://googleusercontent.com/file_content/1" alt="AI Features" width="700"/>
</div>

Features
Web Application (Next.js)
Workspace Management:

Create and manage workspaces.

Invite collaborators to workspaces and grow.

Folder Organization:

Create and organize folders for video projects.

Video Management:

Preview and share videos seamlessly.

Real-Time Updates:

Videos recorded on the desktop app are uploaded and updated in real time.

Desktop Application (Electron.js)
Screen Recording:

Capture high-quality screen recordings.

Include audio and camera feeds during recording.

Real-Time Uploads:

Videos are uploaded to the web app while recording.

Video Processing Server (Express.js)
Video Handling:

Processes and stores videos from the desktop app.

Updates video details on the Next.js web application.

Project Repositories
Web Application
VEMO (formerly Opal-webprodigies): Contains the Next.js application for video management, video access and collaboration.

Desktop Application
VEMO-Desktop (formerly Opal-electron-desktop-app): Contains the Electron.js desktop app for screen recording and real-time uploads.

Video Processing Server
VEMO-Express (formerly Opal-express): Contains the Express.js server for processing and updating video data.

Tech Stack
Client: Next.js, Redux, TailwindCSS

Server: Node.js, Express.js

Desktop: Electron.js

Run Locally
Clone the project

Bash

  git clone https://github.com/rahulstox/VEMO.git
Go to the project directory

Bash

  cd VEMO
Install dependencies

Bash

  bun install
Start the server

Bash

  bun run dev
Add .env file in the root of your folder
Create a .env file in the root of your project and add the following environment variables:

Bash

DATABASE_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_STRIPE_PUBLISH_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/auth/callback
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/auth/callback

OPEN_AI_KEY=

NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

MAILER_PASSWORD=
MAILER_EMAIL=

CLOUD_WAYS_POST=
