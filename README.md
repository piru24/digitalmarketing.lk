
## Grocery & Household Planner

A modern, responsive full-stack web application to manage grocery and household tasks, with secure **OTP-based 2-step user registration**. Track your groceries, and manage monthly spending effortlessly.


### Project Overview

The Grocery Planner App empowers users to:

* 🧾 Register securely with **OTP (2-step verification)**.
* Add, manage, and complete grocery tasks.
* Set due dates, priority, quantity & unit.
* View smart monthly reports with expense tracking.
* Use on any device — mobile, tablet, or desktop.


### Key Features

***Task Management**
  Create, update, delete tasks with category, unit, and priority options.

***2-Step Verification**
  Registration is secured with email/mobile-based OTP verification to verify identity.

***Smart Planning**
  Due dates, priorities, and reminders for efficient grocery management.

***Monthly Report View**
  Visualize monthly totals for quantity and spending.

***Responsive UI**
  Fully optimized layout for mobile/desktop with a hero section animation and tips.

***JWT Auth with Protected Routes**
  Only logged-in users can access the dashboard and reports.



###  Tech Stack



Frontend | React + Vite + Tailwind CSS       
Backend  | Node.js + Express.js              
Database | MongoDB                      
Auth     | JWT, OTP Verification (email) 
Styling  | Tailwind CSS + Animation         



### How to Run Locally

#### 1. Clone the Repository

git clone https://github.com/piru24/digitalmarketing.lk.git
cd igitalmarketing.lk

#### 2. Backend Setup

cd backend
npm install

Start backend:
nodemon server.js


#### 3. 💻 Frontend Setup

cd ../frontend
npm install
npm run dev


### 🧾 How to Use

1. **Register** using your email and password.
2. **Receive OTP** (email).
3. **Enter OTP** to verify.
4. **Login** and start managing your groceries.
5. Create tasks, mark them complete, and track costs.
6. Navigate to the **Report Page** to see your monthly summary.


