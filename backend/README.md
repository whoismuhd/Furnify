# Furnify Backend API

This is the backend API for the Furnify e-commerce platform. It provides endpoints for user authentication, product management, and order processing.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/furnify
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
NODE_ENV=development
```

3. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/users/register`
- **Body**: `{ name, email, password }`
- **Response**: User object with JWT token

#### Login User
- **POST** `/api/users/login`
- **Body**: `{ email, password }`
- **Response**: User object with JWT token

### User Profile

#### Get Profile
- **GET** `/api/users/profile`
- **Auth**: Required
- **Response**: User profile data

#### Update Profile
- **PUT** `/api/users/profile`
- **Auth**: Required
- **Body**: `{ name?, email?, password?, address? }`
- **Response**: Updated user data

### Products

#### Get All Products
- **GET** `/api/products`
- **Query Parameters**: 
  - `category`: Filter by category
  - `search`: Search in name
  - `sort`: Sort by field (e.g., 'price:desc')
  - `minPrice`: Minimum price
  - `maxPrice`: Maximum price

#### Get Single Product
- **GET** `/api/products/:id`

#### Create Product (Admin)
- **POST** `/api/products`
- **Auth**: Admin required
- **Body**: `{ name, price, description, image, category, stock }`

#### Update Product (Admin)
- **PUT** `/api/products/:id`
- **Auth**: Admin required
- **Body**: Product fields to update

#### Delete Product (Admin)
- **DELETE** `/api/products/:id`
- **Auth**: Admin required

### Orders

#### Create Order
- **POST** `/api/orders`
- **Auth**: Required
- **Body**: 
```json
{
  "items": [
    {
      "product": "product_id",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "City",
    "state": "State",
    "zipCode": "12345",
    "country": "Country"
  },
  "paymentMethod": "credit_card"
}
```

#### Get My Orders
- **GET** `/api/orders/myorders`
- **Auth**: Required

#### Get Order by ID
- **GET** `/api/orders/:id`
- **Auth**: Required

#### Update Order Status (Admin)
- **PUT** `/api/orders/:id/status`
- **Auth**: Admin required
- **Body**: `{ status }`

#### Update Order to Paid
- **PUT** `/api/orders/:id/pay`
- **Auth**: Required

## Error Handling

The API uses a consistent error response format:
```json
{
  "success": false,
  "error": "Error message"
}
```

For validation errors:
```json
{
  "success": false,
  "errors": [
    {
      "field": "field_name",
      "message": "Error message"
    }
  ]
}
```

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer your_jwt_token
```

## Models

### User
- name (String, required)
- email (String, required, unique)
- password (String, required)
- role (String, enum: ['user', 'admin'])
- address (Object)
  - street (String)
  - city (String)
  - state (String)
  - zipCode (String)
  - country (String)

### Product
- name (String, required)
- price (Number, required)
- description (String, required)
- image (String, required)
- category (String, required)
- stock (Number, required)

### Order
- user (Reference to User)
- items (Array)
  - product (Reference to Product)
  - quantity (Number)
  - price (Number)
- shippingAddress (Object)
  - street (String)
  - city (String)
  - state (String)
  - zipCode (String)
  - country (String)
- paymentMethod (String)
- paymentStatus (String)
- orderStatus (String)
- subtotal (Number)
- shippingCost (Number)
- total (Number) 