# Site Structure & Content Report

## 🎨 Global Design System
The site uses a cohesive **Dark Mode** aesthetic with the following key characteristics:
- **Theme**: "Cyberpunk/Modern" dark theme with deep blacks (`#050508`) and vibrant purple accents (`#8b5cf6`).
- **Typography**: `Inter` (UI) and `Poppins` (Headings).
- **Effects**: Extensive use of **Glassmorphism** (translucent panels using `backdrop-blur`), subtle gradients, and glow effects (`shadow-glow`).
- **Framework**: Built with **Next.js 14+ (App Router)** and **Tailwind CSS**.

---

## 📐 Layouts

### 1. Standard Layout (Global Wrapper)
**Applied to**: Marketing, Auth, Legal, Profile, Settings, Dashboard
- **Header**: Fixed Navbar with Logo and Navigation.
- **Content**: Centered container with top padding (`pt-24`) to account for fixed header.
- **Footer**: Global footer with links.
- **Background**: subtle radial gradient.

### 2. Studio Layout
**Applied to**: `/studio` routes
- **Header**: Inherits Global Navbar.
- **Sidebar**: Custom left sidebar with quick access to Editor, History, Settings.
- **Content**: Full-height, full-width application view (`100vh - header`).
- **Footer**: **Hidden**.
- **Style**: Optimized for heavy interaction, desktop-first app interface.

### 3. Admin Layout
**Applied to**: `/admin`
- **Base**: Inherits Standard Layout.
- **Extensions**: Adds extra background "blob" effects (Purple/Blue glows) and enforces Admin Role checks.

---

## 📂 Detailed Page Content Breakdown

### 🏠 Marketing Pages (Public)

#### **Landing Page** (`/`)
*File: `app/(marketing)/page.tsx`*
The main entry point designed to convert visitors.
- **Hero Section**:
    - "Master the Art of Prompt Engineering" Headline with gradient text.
    - Subtext: "Transform vague ideas into production-ready AI prompts..."
    - **Interactive Demo**: `InteractiveInputDemo` component showing real-time prompt enhancement.
    - **CTAs**: "Start Forging Free" (Primary) and "Playground" (Secondary).
- **Features Grid**:
    - 6 Cards: Intent Analysis, Granular Control, A/B Testing, Auto-Refinement, Enterprise Security, Model Agnostic.
- **Interactive Previews**:
    - **A/B Testing Arena**: Interactive component demonstrating prompt comparison.
    - **Granular Controls**: Interactive sliders demo.
- **Workflow Section**:
    - "Built for consistency" value proposition.
    - Abstract UI mockup showing a "IDE-like" interface.
- **FAQ Section**: Accordion-style questions about intent analysis, model support, and security.
- **Final CTA**: Large purple banner "Ready to master your AI?" with button.

#### **About Us** (`/about`)
*File: `app/(marketing)/about/page.tsx`*
- **Mission**: "Bridging Human Intent & AI Understanding".
- **Value Props**:
    - **Transparency**: "We don't hide the magic."
    - **Precision**: "Prompt engineering as a science."
    - **User-Centric**: "Built for developers."
- **Team Section**:
    - Profile card for **Anil Suthar** (Founder & CEO) with links to GitHub and LinkedIn.

#### **Features** (`/features`)
*File: `app/(marketing)/features/page.tsx`*
- **Intro**: "Tools designed to make you think better, not just type harder."
- **Mental Models** (Grouped Features):
    - **Understand**: Deep Intent Analysis, Security Consultant.
    - **Build**: Granular Controls, Version History.
    - **Compete**: A/B Testing Arena, The Playground.
- **Closing**: Simple CTA to explore the Playground.

#### **Pricing** (`/pricing`)
*File: `app/(marketing)/pricing/page.tsx`*
- Wraps `PricingPageClient` component.
- *Note: Content is client-side rendered.*

---

### 🛠️ App Core (Studio)

#### **Studio Editor** (`/studio`)
*File: `app/studio/page.tsx`*
The primary functional interface for the application.
- **Layout**: Split-screen (Desktop) or Stacked (Mobile).
- **Left Panel (Input)**:
    - **PromptEditor**: Main text area for entering raw prompts.
    - **Controls**: `GranularOptions` (Temperature, Top P, Top K).
    - **Actions**: "Generate" button, "Audit" button.
- **Right Panel (Output)**:
    - **PromptResult**: Displays the enhanced/refined prompt.
    - **CognitiveStatus**: Animated loader showing "thinking" steps during generation.
- **Modals**:
    - **VersionComparator**: Diff view to compare prompt versions.
    - **AuditModal**: Security and quality report for a prompt.
    - **UpgradeModal**: Upsell trigger when limits are reached.
- **State**: Manages `prompt`, `versions`, `granularOptions`, and `subscriptionTier`.

#### **User Dashboard** (`/dashboard`)
*File: `app/dashboard/page.tsx`*
Post-login hub for users.
- **Header**: "Welcome back, [Name]".
- **Stats Grid**:
    - **Feature Card**: Large "Prompt Studio" card to launch the editor.
    - **Profile Card**: Shows User Tier (Free/Pro) and status.
    - **Plan Status**: Shows active plan and renewal date.
- **Recent Activity**:
    - Grid of `Recent Projects` cards.
    - Displays Model used, Date, and snippet of the prompt.
    - Empty State placeholder if no prompts exist.

---

### 🔐 Admin Area

#### **Admin Dashboard** (`/admin`)
*File: `app/admin/page.tsx`*
Restricted access area for system management.
- **Dashboard View**:
    - **KPI Cards**: Total Users, Active Messages, Pending Reviews, System Health.
    - **Quick Actions**: "Broadcast" form to send global notifications.
    - **System Monitor**: Real-time dummy metrics for API Gateway and Database.
- **Users View**:
    - Table listing all registered users, status, and join date.
    - "Edit" action to modify user details.
- **Inbox View**:
    - List of contact form messages.
    - Read/Unread status toggles.
    - **Reply Functionality**: Built-in email reply modal using Resend.

---

### 🎮 Gamification

#### **Playground** (`/playground`)
*File: `app/playground/page.tsx`*
- Wraps `PlaygroundClient`.
- A gamified environment distinct from the Studio for practicing prompt engineering skills.

---

### ⚖️ Legal
- **Privacy Policy**: `app/(legal)/privacy/page.tsx`
- **Terms of Service**: `app/(legal)/terms/page.tsx`
- *Both use a clean, document-focused layout with a sticky sidebar.*
