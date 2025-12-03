# UrbanCart E-commerce Project

A full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features
- **User Authentication**: Sign up, login, and role-based access (Admin/Customer).
- **Product Management**: Admin can add, edit, and delete products.
- **Shopping Cart**: Users can add items to cart and checkout.
- **Order Management**:
    - Users can view their order history.
    - Admins can view all orders and update delivery status.
- **Inventory Management**: Real-time stock updates and low stock alerts.

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: MongoDB

## Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance running on port 27017)

## Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd ecom-project
    ```

2.  **Install Backend Dependencies**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies**
    ```bash
    cd ../frontend
    npm install
    ```

## Configuration

1.  **Backend Environment Variables**
    Create a `.env` file in the `backend` directory:
    ```env
    PORT=4000
    MONGO_URI=mongodb://localhost:27017/ecom
    ```

2.  **Frontend Environment Variables**
    (Optional) Create a `.env` file in the `frontend` directory if you need to change the API URL:
    ```env
    VITE_API_BASE_URL=http://localhost:4000/api
    ```

## Running the Project

You need to run the backend and frontend in separate terminal windows.

### 1. Start the Backend
```bash
cd backend
npm run seed  # Run this once to seed initial data (Admin user)
npm start
```
The backend will run on `http://localhost:4000`.

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`.

## Default Credentials

**Admin Account:**
- **Username:** `admin`
- **Email:** `admin@urbancart.com`
- **Password:** `admin123456`

**Customer Account:**
- You can sign up for a new account on the login page.
