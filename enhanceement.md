# Vemo: The Next-Generation Video Collaboration Platform

**Vision:** To build a video messaging and collaboration tool that is faster, more intuitive, and more powerful than Microsoft Loom, focusing on team productivity and client outreach.

---

## Project Status & Roadmap

This document tracks our development progress. The project is divided into three core phases:

1.  **Phase 1: Audit & Verification** - Testing all existing features to establish a stable baseline.
2.  **Phase 2: Monorepo Migration** - Merging the Web, Server, and Desktop apps into a single repository for better maintainability and scalability.
3.  **Phase 3: Enhancement & New Features** - Implementing Pro-tier features and improving the overall product.

---

### Phase 1: Feature Audit Checklist

Here is the list of existing features we need to verify. We will test each one to ensure it's working as expected before the monorepo migration.

| # | Feature | Status | Notes / Bugs Found |
| :-- | :--- | :--- | :--- |
| 1 | **Real-time Recording & Streaming** | 🟡 **Untested** | Electron app should stream to Express server. |
| 2 | **User Authentication & Onboarding** | 🟡 **Untested** | Clerk sign-up/sign-in and new user setup. |
| 3 | **Workspace & Team Invites** | 🟡 **Untested** | Creating workspaces and inviting/accepting members. |
| 4 | **Folder & Video Management** | 🟡 **Untested** | Creating folders, renaming them, moving videos. |
| 5 | **Video Upload & Processing** | 🟡 **Untested** | Direct upload to Cloudinary and DB entry creation. |
| 6 | **AI Transcription** | 🟡 **Untested** | Video transcription via AssemblyAI/Gemini. |
| 7 | **AI Summary & Title** | 🟡 **Untested** | Generating summary/title via Gemini. |
| 8 | **AI Credit System** | 🟡 **Untested** | Free users should have 3 credits; credits should decrement. |
| 9 | **Video Playback & Sharing** | 🟡 **Untested** | Preview page, copy link, and embedded link functionality. |
| 10 | **Commenting System** | 🟡 **Untested** | Adding and viewing comments on a video. |
| 11 | **First-View Email Notification** | 🟡 **Untested** | Email should be sent on the first view of a video. |
| 12 | **Subscription & Billing** | 🟡 **Untested** | Razorpay integration for Pro plan subscription. |
| 13 | **Desktop App Device Selection** | 🟡 **Untested** | Selecting screen/mic and saving presets. |
| 14 | **Dynamic Recording Limits** | 🟡 **Untested** | Free plan should be limited to 5 minutes. |

---

### Phase 2 & 3: Enhancement Backlog

This is our list of ideas and improvements to work on after the audit and merge.

-   [ ] **Architectural:** Migrate to a Monorepo using Bun Workspaces.
-   [ ] **Architectural:** Create a shared `packages/db` for the Prisma client.
-   [ ] **Pro Feature:** Build a detailed Video Analytics Dashboard.
-   [ ] **Pro Feature:** Implement Custom Branding (White-labeling) options.
-   [ ] **Pro Feature:** Add in-video Call-to-Action (CTA) buttons.
-   [ ] **Pro Feature:** Introduce advanced Team Roles & Permissions.
-   [ ] **Enhancement:** Improve streaming resilience to handle network drops.
-   [ ] **Enhancement:** Refactor the Icon component system.
-   [ ] **Enhancement:** Implement a centralized configuration management system for the Express server.