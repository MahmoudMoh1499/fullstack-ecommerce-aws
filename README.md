# Fullstack E-Commerce on AWS

## Overview

This is a simple full-stack web application built using **AWS Lambda**, **S3**, **Node.js**, **Angular**, and **MySQL**.  
The application enables users to register, upload profile pictures to S3, browse a list of products, and manage a shopping cart.

---

## Features

### ✅ Core Features

1. **Authentication**
    - User registration and login using JWT.
    - Users can:
        - Submit basic info (name, email, password).
        - Upload a profile picture (stored in S3).
    - After login:
        - Users are redirected to the home page.
        - Their profile picture is displayed.
    - User data is stored in MySQL.

2. **Product Listing**
    - Backend Lambda function returns a list of products:
        - Name
        - Description
        - Price
        - Image URL (hosted in S3)
    - Frontend displays products in a grid/card layout.

3. **Shopping Cart**
    - Users can add or remove products.
    - Cart is persisted in the database and linked to the user.
    - Total price is displayed.

---

### 🎁 Bonus Feature

- Admin-only endpoint to add products.

---

## AWS Setup

### 🗂️ S3 Setup

1. Create an S3 bucket for storing:
    - Profile pictures (private access)
    - Product images (public read access)

2. Configure bucket permissions:
    - **Public read** access for product images.
    - **Private** access for profile pictures.

3. IAM Policy for Lambda S3 Access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

---

## Database Schema

The MySQL database schema is defined in the file `schema.sql`.

---

## Project Structure

```
product-mgt/
├── Product Browser API.postman_collection.json
├── README.md
├── schema.sql
├── product-browser-api/
│   ├── .env
│   ├── src/
│   │   ├── app.js
│   │   ├── setup-db.js
│   │   ├── handlers/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   └── tests/
├── product-browser-frontend/
│   ├── angular.json
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   ├── environments/
```

---

## Instructions to Run the Project

### 🔧 Backend (Node.js + AWS Lambda)

1. Install dependencies:

```bash
cd product-browser-api
npm install
```

2. Create a `.env` file with the following variables:

```env
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=product_browser
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=your-aws-region
PROFILE_PICS_BUCKET=your-profile-pics-bucket
PRODUCT_IMAGES_BUCKET=your-product-images-bucket
```

3. Set up the database:

```bash
node src/setup-db.js
```

4. Deploy Lambda functions to AWS.

---

### 🧪 API Testing with Postman

- Use the collection file `Product Browser API.postman_collection.json` to test all endpoints.

---

### 💻 Frontend (Angular)

1. Install dependencies:

```bash
cd product-browser-frontend
npm install
```

2. Start the Angular dev server:

```bash
ng serve
```

3. Open the application in your browser at:

```
http://localhost:4200
```

---

## Notes

- Ensure S3 bucket names and DB credentials in `.env` are correct.
- Replace all placeholders like `your-bucket-name` and `your-database-host` with actual values.
