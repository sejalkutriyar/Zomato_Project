# Zomato Ops Pro – Smart Kitchen + Delivery Hub

A full-stack MERN application for managing restaurant operations and delivery partners.

## Features

### 👨‍🍳 Restaurant Manager Dashboard
*   **Table View**: Real-time overview of all orders.
*   **Create Orders**: Quickly add new orders directly from the dashboard.
*   **Assign Partners**: Assign specific orders to available delivery partners (Rider 1, Rider 2, Rider 3).
*   **Live Status Tracking**: Monitor order status from `PREP` -> `PICKED` -> `ON_ROUTE` -> `DELIVERED`.

### 🛵 Delivery Partner View
*   **Dedicated Interface**: Clean, mobile-friendly card view for riders.
*   **Dynamic Actions**: Single-button workflow to update status (Mark as Picked, Start Delivery, etc.).
*   **Real-time Assignments**: Instantly see when an order is assigned.

## Tech Stack
*   **Frontend**: React + Vite (Custom CSS for styling)
*   **Backend**: Node.js + Express
*   **Database**: MongoDB (using Mongoose)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/sejalkutriyar/Zomato_Project.git
cd Zomato_Project
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```
Start the backend server:
```bash
npm run dev
# Server running on http://localhost:5000
```

### 3. Frontend Setup
Navigate to the frontend folder and install dependencies:
```bash
cd frontend
npm install
```
Start the frontend application:
```bash
npm run dev
# App running on http://localhost:5173
```

## Credentials
*   **Manager**: `manager` / `manager123`
*   **Rider 1**: `rider1` / `rider123`
*   **Rider 2**: `rider2` / `rider123`
*   **Rider 3**: `rider3` / `rider123`
