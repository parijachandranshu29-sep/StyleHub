# StyleHub — Full-Stack Clothing E-Commerce

React + Spring Boot + PostgreSQL + Razorpay + COD

## Tech Stack
| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Spring Boot 3, Java 17, JWT |
| Database | PostgreSQL (prod) / H2 (local dev) |
| Payment | Razorpay + Cash on Delivery |

## Quick Start (Local)

### Backend
```bash
cd backend
mvn spring-boot:run
```
Runs on http://localhost:8080

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on http://localhost:5173

## Default Credentials
| Role | Email | Password |
|---|---|---|
| Admin | admin@stylehub.com | Admin@123 |
| User | Register at /register | Your choice |

## Features
- Browse 10 clothing products with real model photos
- Filter by gender (Men/Women), category, price
- Product detail with image gallery and size selector
- Cart with quantity management
- Checkout with address form
- Razorpay online payment + Cash on Delivery
- Order tracking (Placed → Confirmed → Shipped → Delivered)
- Admin panel: manage products + orders + delivery status

## Deploy on Render

### Backend (Web Service)
```
Language:       Docker
Dockerfile:     ./Dockerfile
```
Environment Variables:
- APP_JWT_SECRET
- APP_CORS_ALLOWED_ORIGIN
- APP_ADMIN_EMAIL
- APP_ADMIN_PASSWORD
- RAZORPAY_KEY_ID
- RAZORPAY_KEY_SECRET
- DATABASE_URL (PostgreSQL)
- DATABASE_USERNAME
- DATABASE_PASSWORD
- DATABASE_DRIVER=org.postgresql.Driver
- HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect

### Frontend (Static Site)
```
Root Directory: frontend
Build Command:  npm install && npm run build
Publish Dir:    dist
```
