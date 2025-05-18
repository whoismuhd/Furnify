# Furnify API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication Endpoints

### Register User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "message": "Registration successful. Please check your email to verify your account.",
    "token": "jwt_token"
  }
  ```
- **Error Response**: `400 Bad Request`
  ```json
  {
    "message": "User already exists"
  }
  ```

### Login User
- **URL**: `/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "token": "jwt_token",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string"
    }
  }
  ```
- **Error Response**: `401 Unauthorized`
  ```json
  {
    "message": "Invalid credentials"
  }
  ```

### Verify Email
- **URL**: `/auth/verify-email/:token`
- **Method**: `GET`
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Email verified successfully"
  }
  ```
- **Error Response**: `400 Bad Request`
  ```json
  {
    "message": "Invalid verification token"
  }
  ```

### Reset Password
- **URL**: `/auth/reset-password`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "token": "string",
    "password": "string"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Password reset successfully"
  }
  ```

## Product Endpoints

### Get All Products
- **URL**: `/products`
- **Method**: `GET`
- **Query Parameters**:
  - `category`: Filter by category
  - `sort`: Sort by price, rating
  - `page`: Page number
  - `limit`: Items per page
- **Success Response**: `200 OK`
  ```json
  {
    "products": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "price": "number",
        "category": "string",
        "image": "string",
        "rating": "number",
        "stock": "number"
      }
    ],
    "pagination": {
      "currentPage": "number",
      "totalPages": "number",
      "totalItems": "number"
    }
  }
  ```

### Get Single Product
- **URL**: `/products/:id`
- **Method**: `GET`
- **Success Response**: `200 OK`
  ```json
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "price": "number",
    "category": "string",
    "image": "string",
    "rating": "number",
    "stock": "number",
    "reviews": [
      {
        "user": "string",
        "rating": "number",
        "comment": "string",
        "date": "string"
      }
    ]
  }
  ```

## Cart Endpoints

### Get Cart
- **URL**: `/cart`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer token`
- **Success Response**: `200 OK`
  ```json
  {
    "items": [
      {
        "product": {
          "id": "string",
          "name": "string",
          "price": "number",
          "image": "string"
        },
        "quantity": "number"
      }
    ],
    "total": "number"
  }
  ```

### Add to Cart
- **URL**: `/cart`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer token`
- **Request Body**:
  ```json
  {
    "productId": "string",
    "quantity": "number"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Item added to cart",
    "cart": {
      "items": [],
      "total": "number"
    }
  }
  ```

### Update Cart Item
- **URL**: `/cart/:productId`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer token`
- **Request Body**:
  ```json
  {
    "quantity": "number"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Cart updated",
    "cart": {
      "items": [],
      "total": "number"
    }
  }
  ```

## Order Endpoints

### Create Order
- **URL**: `/orders`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer token`
- **Request Body**:
  ```json
  {
    "items": [
      {
        "product": "string",
        "quantity": "number"
      }
    ],
    "shippingAddress": {
      "street": "string",
      "city": "string",
      "state": "string",
      "zipCode": "string",
      "country": "string"
    },
    "paymentMethod": "string"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "orderId": "string",
    "status": "string",
    "total": "number"
  }
  ```

### Get User Orders
- **URL**: `/orders/myorders`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer token`
- **Success Response**: `200 OK`
  ```json
  {
    "orders": [
      {
        "id": "string",
        "items": [],
        "total": "number",
        "status": "string",
        "createdAt": "string"
      }
    ]
  }
  ``` 