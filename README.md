# 🏢 Professional Business Website with PostgreSQL Integration

A modern, responsive, full-stack business and portfolio web application built with **HTML5, CSS3, JavaScript, Node.js, Express, and PostgreSQL**. Designed for businesses, consultants, and service providers to showcase offerings and securely collect client inquiries.

---

## 🌟 Key Features

- **Responsive & Modern Design**: Polished layout using *Plus Jakarta Sans* typography, deep executive color scheme, and mobile-friendly grids.
- **Hero & Services Showcase**: Clean sections for company introduction, statistics counters, and core service offerings.
- **Contact & Inquiry System**: Client inquiry form connected directly to a PostgreSQL database via a secure REST API.
- **Admin Dashboard (`/admin`)**: Built-in dashboard to view, review, and filter incoming customer inquiries and timestamps in real time.
- **Cloud & Production Ready**: Pre-configured with `render.yaml` for 1-click zero-config deployment to Render with managed PostgreSQL.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Semantic CSS3 (CSS Grid & Flexbox), Vanilla JavaScript (ES6+ Fetch API)
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (managed via `pg` connection pool)
- **Deployment**: Render Blueprint (`render.yaml`) / GitHub

---

## 📁 Project Structure

```text
├── furst.html          # Starter / alternate homepage
├── index.html          # Main homepage template
├── style.css           # Modular stylesheet and responsive rules
├── script.js           # Client-side form handler & smooth scrolling
├── admin.html          # Visual admin message & inquiries dashboard
├── server.js           # Node.js Express server & PostgreSQL API endpoints
├── render.yaml         # Cloud blueprint for automated deployment
├── package.json        # Project metadata and dependencies
├── .env                # Local environment variables (ignored in git)
└── .gitignore          # Git exclusion rules
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) (Local installation or free cloud instance like Neon / Supabase)

### 1. Clone the repository
```bash
git clone https://github.com/cm501633-coder/fathers-website.git
cd fathers-website
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3000

# Local PostgreSQL Configuration
PGUSER=postgres
PGHOST=localhost
PGDATABASE=father_website
PGPASSWORD=your_password
PGPORT=5432

# Or provide a full connection string:
# DATABASE_URL=postgresql://user:password@localhost:5432/father_website
```

### 4. Start the Application
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📊 Database Schema

The application automatically creates the `messages` table upon server launch:

```sql
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(50),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Serves the main landing page (`index.html`) |
| `GET` | `/admin` | Serves the admin inquiries dashboard (`admin.html`) |
| `POST` | `/api/contact` | Receives and stores customer inquiries in PostgreSQL |
| `GET` | `/api/messages` | Returns all messages in JSON format |

---

## ☁️ Deployment

This project includes a `render.yaml` blueprint. To deploy for free:
1. Push your changes to GitHub.
2. In [Render Dashboard](https://dashboard.render.com/), choose **New + > Blueprint**.
3. Select this repository and click **Apply**.
4. Both the web service and the PostgreSQL database will be deployed and connected automatically!
