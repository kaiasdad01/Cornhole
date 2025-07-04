---

## File 1: v0-design-mockup.md

# EasyBracket – Tournament Manager Web App (Design Mockup Prompt for V0)

I’m designing a mobile-friendly web app called **EasyBracket** to help manage casual sports tournaments, starting with Cornhole and Pickleball. I need a **Figma-level UI mockup** that’s clean, fun, and intuitive for mobile and desktop.

## 🧠 Design Goals
- Clean UI, fast to use
- Mobile-first responsive design
- Admin-focused input, viewer-focused output
- Light and playful visual aesthetic (family/friends casual vibe)

## 📋 Pages & Components

### 1. Home / Landing
- Tournament Name
- Dates and Location
- "Create Tournament" button (Admin)

### 2. Team Entry
- Form to enter player names, assign to team
- Auto-group solo players from pool
- Live team list/tracker
- Default team name: “Player 1 / Player 2”
- Option to customize team name

### 3. Bracket Builder
- "Create Bracket" button
- Bracket types: Single Elimination, Double Elimination, Group Stage
- Auto-seed teams with manual re-seed capability
- Optional Bracket Regions: “Inlet Rd”, “Yarmouth Ct”, “The WooHoo”, “Delaware Bay Oyster House”

### 4. Live Tournament Dashboard
- Bracket display (with scores, point differential)
- "Current Matches" section
- "Previous Results" section
- Charts and graphs (upsets, point diff, etc.)
- “Projected Winners” (based on basic ML prediction)

### 5. Admin Portal
- Simple mobile-first interface
- Match score entry
- Editable match data (time, weather, notes)

### 6. Post-Tournament Report
- Full final bracket
- Game-by-game breakdown
- Charts: top team, biggest upset, point differential, etc.
- Option to share via text/email

## 🛠 Design Considerations
- Easy to use on a phone
- Read-only view for participants
- Visually engaging charts for post-tournament fun

---

## File 2: build-deploy-cursor.md

# EasyBracket – Build and Deploy a Tournament Manager App (Prompt for Cursor / Claude)

I’m building a web app called **EasyBracket** for managing casual sports tournaments like Cornhole and Pickleball. The MVP (v1) will be admin-facing for setup and scorekeeping, and public-facing as a read-only dashboard.

## 🌟 Goals
- Admin can enter teams, scores, and manage brackets
- Public users can view tournament data
- Hosted on a public URL, mobile-friendly

## 💻 Tech Stack (simple to deploy & maintain)
- **Frontend:** Next.js with TailwindCSS (host on Vercel)
- **Backend:** Supabase (for DB + Auth + Realtime)
- **ML:** Lightweight regression logic, can be mocked for now
- **Charts:** Recharts or Chart.js for visualization
- **Report:** Use html2pdf.js to generate reports client-side

## 🧰 Features to Build

### Team Entry
- Form to input player names and assign to teams
- Pool of solo players with "Auto-Pair" randomization
- Default team name = Player 1 / Player 2
- Option to customize team name
- Display live team list

### Bracket Creation
- Button to generate bracket
- Bracket types: single/double elimination, group stage
- Auto-seed logic, with manual override
- Optional bracket regions (e.g., Inlet Rd, Yarmouth Ct)

### Live Tournament Dashboard
- Live view of bracket with scores
- Current matches section
- History of match results
- ML-based "Projected Winners" with win probability
- Charts: point diff, upsets, team performance trends

### Admin Panel
- Authenticated view (Supabase roles)
- Easy score entry UI
- Editable match time, notes, and weather
- Optimized for mobile

### Post-Tournament Summary
- Generate a summary view + downloadable PDF
- Full final bracket with match data
- Stats & charts: top teams, biggest upsets, point diff trends
- Share via SMS or email

## 🔒 Hosting + Access
- Host on **Vercel** (frontend) + **Supabase** (backend/db)
- Mobile-optimized
- Public read-only view
- Admin-only data modification

## 📄 Setup Simplicity
- Prioritize no-code/low-code where possible
- Minimize infra complexity
- Use Supabase as single backend for DB + auth + realtime
- Deploy to Vercel for instant frontend setup

## ✏️ Notes
- Tournament rules = standard cornhole (to 21)
- Schema should support other sports in future (e.g., Pickleball)
- No player login needed in v1 (admin only)
- Public users just view tournament progress

