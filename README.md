# Climb Gear

Climb Gear is a simple e-commerce web application created as a university project for a course related to web applications.  
The project simulates an online store for climbing equipment and demonstrates full-stack development using React and Node.js.

---

## Authors

- Backend: Aliaksei Rusinovcich
- Frontend: Ilya Paliashchuk

Team size: 2 people

---

## Technologies Used

### Frontend
- React
- React Router
- JavaScript
- HTML / CSS

### Backend
- Node.js
- Express
- SQLite3
- JSON Web Token (JWT)

### Other Tools
- Postman (API documentation)
- Git / GitHub

---

## Application Features

### Public (no authentication required)
- Browse all products
- Search products by name
- Filter products by category
- View product details

### Authenticated User
- User registration
- User login using JWT
- Add products to cart
- Remove products from cart
- Change product quantity in cart
- Place orders
- Add product reviews
- Edit own reviews
- Delete own reviews

**Restrictions:**
- Only one review per product per user
- Reviews are available only for logged-in users
- Users cannot view order history

### Administrator
- Delete any review
- Add new product categories
- Add new products

Administrator account (default):  
email: admin@admin.com    
password: 12345678  

---

## Authentication & Authorization

- Authentication is based on JSON Web Token (JWT)
- Token is returned during login and used to access protected routes
- No refresh token mechanism is implemented
- Role-based access control:
  - Public routes (e.g. product list)
  - Protected routes (JWT required)
  - Admin-only routes

---

## Frontend Structure

Main pages:
- Home Page (product list, search, filters)
- Product Details Page
- Cart Page
- Login Page
- Registration Page
- Search Page
- Sign in Page

Routing is handled using React Router.  
Automatic redirects are implemented for protected pages when the user is not authenticated.

---

## Backend Overview

- Backend implemented using Node.js and Express
- SQLite3 used as a relational database
- All CRUD operations are persisted in the database
- Cart and orders are stored on the server

### Order
Each order contains:
- Unique ID
- Creation date
- Total price

---

## API Documentation

API documentation is provided as a Postman Collection.

The collection contains:
- All available endpoints
- Example request bodies
- Example responses
- Authorization using JWT

The Postman collection is included in the project files.


---

## Setup & Installation

### Prerequisites
- Node.js
- npm

### Frontend

cd frontend  
npm install  
npm run dev  

### Backend

cd backend  
npm install  
npm run dev  

---

## Environment Variables

The project uses environment variables.

Create a `.env` file in the `backend` directory based on the example below:

JWT_SECRET=your_secret_key  
JWT_EXPIRES=30m  
BACKEND_SERVER_URL=http://localhost:5000    

---

## Additional Features

- Protected routes (JWT required)
- Admin-only endpoints
- Automatic redirects for unauthorized access
- Form validation
- Error handling on both frontend and backend

---

## Repository

The project is hosted in a single Git repository containing both frontend and backend:

frontend/  
backend/
