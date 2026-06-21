# 🏥 MediCare Hospital Website

A full-stack hospital management website built for patients to view doctors and book appointments, with a complete admin dashboard.

## 🔗 Live Demo
**Website:** https://medicare-hospital-ri6m.onrender.com
**Admin Panel:** https://medicare-hospital-ri6m.onrender.com/admin/login.html
**Admin Login:** `admin` / `admin123` *(demo credentials — see Security Note below)*

> ⚠️ **Security Note:** This is a portfolio/demo project. The admin password above is intentionally simple for demonstration purposes. In a production deployment, this would be replaced with a strong, unique password and the session secret would be rotated and stored as a platform secret rather than committed to the repository.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Bootstrap 5 (via CDN), Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | sqlite3 (Relational DB — same SQL syntax as MySQL/PostgreSQL, chosen for zero-config free deployment) |
| Session Storage | connect-sqlite3 (persistent session store backed by SQLite) |
| Authentication | express-session, bcryptjs (password encryption) |
| Validation | express-validator (server-side form validation) |
| Version Control | Git + GitHub |
| Deployment | Render.com (Free Tier) |

> **Note:** The project was built using SQLite instead of MySQL/PostgreSQL as specified in the requirements. SQLite is a fully relational database with identical SQL syntax and structure. It was chosen to enable zero-configuration free deployment on Render.com. The database schema (doctors, appointments tables) can be migrated to MySQL/PostgreSQL with no code changes required.

## 📋 Features

### 🌐 Patient Side (Frontend)
- 🏠 **Home Page** — Hospital introduction, banner, services overview
- 👨‍⚕️ **Doctors Page** — List of doctors with name, specialization, available days, search & filter
- 📅 **Appointment Page** — Booking form with full validation (name, phone, email, doctor, date, message), validated server-side with express-validator
- 📞 **Contact Page** — Hospital address, phone, email, contact form

### 🔐 Admin Dashboard
- Secure login with bcryptjs-encrypted passwords
- Persistent sessions backed by connect-sqlite3, so admin login survives server restarts
- 📊 Dashboard with live stats (total doctors, appointments, pending, messages)
- ➕ Add / Edit / Delete doctors
- 📋 View all appointments with status management (Pending / Confirmed / Cancelled)
- 🗑️ Delete appointments
- 🔍 Search and filter appointments

## 🗄️ Database File

The complete database schema is available in [`database.sql`](./database.sql) in the root of the project.
It includes all table definitions (doctors, appointments, admins, contacts) and sample doctor data.

## 🔒 Security & Configuration

- Environment variables (`PORT`, `SESSION_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`) are loaded via a `.env` file.
- **For local development:** copy `.env.example` (if present) or create your own `.env` with your own values — do not reuse the demo session secret in any deployment you intend to keep private.
- **Recommended hardening for production use:** rotate `SESSION_SECRET`, set a strong `ADMIN_PASSWORD`, and ensure `.env` is excluded via `.gitignore` (it is excluded going forward; historical commits should be scrubbed with a tool like `git filter-repo` if this repo is reused beyond a portfolio demo).

## 👩‍💻 Author

**Dhanalaxmi Devunoori** — [LinkedIn](https://linkedin.com/in/dhanadevunoori-b295a9293) · [GitHub](https://github.com/dhanadevunoori)
📧 dhanadevunoori@gmail.com
