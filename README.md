# 🚀 SwiftTasks - Micro Tasking and Earning Platform

SwiftTasks is a MERN-based platform where **Buyers** can create small tasks and **Workers** can earn coins by completing them. It also features an **Admin** role to oversee users, tasks, payments, and withdrawals. The platform emphasizes security, role-based access, and real-time user engagement with a notification system.

## 🌐 Live Site

🔗 [https://swift-tasks-87d89.web.app/](https://swift-tasks-87d89.web.app/)]
## 👨‍💼 Admin Credentials

- **Email:** tariqul21@gmail.com
- **Password:** 123456Ew!

---

## 🌟 Top 10 Features

1. 🔐 **Role-based Authentication** – Secure login/registration with Firebase (Email + Google).
2. 💼 **3 Roles** – Worker, Buyer, Admin – each with unique dashboards and access control.
3. 🪙 **Coin Economy** – Buyers purchase coins (via Stripe) to post tasks. Workers earn coins by completing tasks.
4. 📬 **Submission System** – Workers submit proof; Buyers review and approve/reject.
5. 💸 **Withdrawals** – Workers can request real money withdrawal (200+ coins = $10).
6. 📈 **Dashboard Stats** – Dynamic statistics per user role (tasks, coins, payments).
7. 🔔 **Notification System** – Real-time role-based notifications for task activity and earnings.
8. 🎨 **Responsive UI** – Optimized for desktop, tablet, and mobile views.
9. 🛡️ **JWT Authorization** – Firebase ID token used for protected routes with secure backend filtering.
10. 📁 **Image Upload** – ImageBB integration for profile pictures and task thumbnails.

---

## 🖥️ Technologies Used

### Client
- React.js
- Tailwind CSS + DaisyUI
- React Router DOM
- Firebase Auth
- Swiper.js (Sliders)
- Axios
- SweetAlert2

### Server
- Node.js
- Express.js
- MongoDB + Mongoose
- Stripe API (Payment Gateway)
- Firebase Admin SDK (JWT Token Verification)
- CORS, dotenv

---


---

## 🧪 Key Functionalities by Role

### 🧑 Worker
- View available tasks
- Submit proof for tasks
- View submission status
- Earn coins and withdraw when eligible
- View earning stats
- Get notified when submission is approved/rejected

### 👨‍💼 Buyer
- Add new tasks with coin deduction
- Review task submissions
- Approve/reject submissions (with coin/worker logic)
- Purchase coins (Stripe or dummy)
- View payment history
- Update/delete tasks

### 👮 Admin
- Approve withdrawal requests
- Manage users (change roles/remove)
- Delete tasks
- View platform-wide stats

---

## 🔐 Security Measures

- Firebase ID Token → Decoded and verified in backend
- Role-based middleware (Buyer, Worker, Admin)
- Unauthorized requests handled with status codes (401, 403)
- Environment variables for MongoDB, Firebase, Stripe

---

## 🛠️ Setup Instructions

### 🔑 Prerequisites
- Node.js, npm
- MongoDB URI
- Firebase project (with web app)
- Stripe account (test keys)
- imgBB API Key

### 🧭 Steps

#### 1. Clone Repositories
```bash
git clone https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-tariqul25
git clone https://github.com/Programming-Hero-Web-Course4/b11a12-server-side-tariqul25


