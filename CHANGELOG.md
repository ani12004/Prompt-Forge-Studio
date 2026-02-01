# Changelog

All notable changes to the **PromptForge AI** project will be documented in this file.

## [1.0.0] - 2026-02-01

### 🚀 Major Features
- **AI Prompt Auditor**: Added a dedicated `AuditModal` and critique engine to analyze prompts for clarity and security risks.
- **A/B Benchmark Laboratory**: Completely redesigned the `VersionComparator` UI for side-by-side prompt testing.
    - Added split-view layout.
    - Improved Z-index layering and modal visuals.
    - Added heuristic winner declaration.
- **Studio Redesign**: 
    - Simplified `PromptEditor` header and toolbar.
    - Introduced "Cognitive Depth" segmented controls.
    - Added clean status indicators.
- **Admin & Pro Roles**:
    - Implemented `getUserRole` and `getUserSubscription` actions.
    - Added **Admin Crown Badge** to the Profile Page.
    - Added **Pro Plan** indicator to the User Menu.

### 🐛 Bug Fixes
- Fixed `user_id` vs `id` schema mismatch in `profiles` table.
- Fixed TypeScript errors in `StudioPage` regarding `onAudit` props.
- Fixed subscription status displaying "Free Plan" for Pro users (case-sensitivity fix).
- Fixed Z-index collision in Benchmark overlay.

### 🔧 Infrastructure
- Updated `package.json` version to `1.0.0`.
- Added `v3_fix_profiles.sql` migration for RLS policies.
- Optimized `generate.ts` for better error handling during streaming.

---

## [0.9.0] - 2026-01-25
- Initial Beta Release.
- Basic Prompt Generation.
- History Sidebar.
- Clerk Authentication.
