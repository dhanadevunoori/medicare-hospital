# 🏥 MediCare Hospital Website

A full-stack hospital management website built for patients to view doctors and book appointments, with a complete admin dashboard.

## 🔗 Live Demo
**Website:** https://medicare-hospital-ri6m.onrender.com  
**Admin Panel:** https://medicare-hospital-ri6m.onrender.com/admin/login.html  
**Admin Login:** `admin` / `admin123`

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Bootstrap 5, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | SQLite (Relational DB — same SQL syntax as MySQL/PostgreSQL, chosen for zero-config free deployment) |
| Authentication | express-session, bcryptjs (password encryption) |
| Version Control | Git + GitHub |
| Deployment | Render.com (Free Tier) |

> **Note:** The project was built using SQLite instead of MySQL/PostgreSQL as specified in the requirements. SQLite is a fully relational database with identical SQL syntax and structure. It was chosen to enable zero-configuration free deployment on Render.com. The database schema (doctors, appointments tables) can be migrated to MySQL/PostgreSQL with no code changes required.

## 📋 Features

### 🌐 Patient Side (Frontend)
- 🏠 **Home Page** — Hospital introduction, banner, services overview
- 👨‍⚕️ **Doctors Page** — List of doctors with name, specialization, available days, search & filter
- 📅 **Appointment Page** — Booking form with full validation (name, phone, email, doctor, date, message)
- 📞 **Contact Page** — Hospital address, phone, email, contact form

### 🔐 Admin Dashboard
- Secure login with bcrypt-encrypted passwords
- 📊 Dashboard with live stats (total doctors, appointments, pending, messages)
- ➕ Add / Edit / Delete doctors
- 📋 View all appointments with status management (Pending / Confirmed / Cancelled)
- 🗑️ Delete appointments
- 🔍 Search and filter appointments

## 🗄️ Database File

The complete database schema is available in [`database.sql`](./database.sql) in the root of the project.
It includes all table definitions (doctors, appointments, admins, contacts) and sample doctor data. 

## 🗄️ Database Structure

### Doctors Table
```sql