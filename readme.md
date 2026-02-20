Ledger-Based Banking System
Project Overview

This project is a ledger-based banking system designed to simulate real-world financial transaction processing with transactional integrity

The system enables users to create and manage multiple bank accounts, securely transfer funds between accounts, and maintain a structured transaction history through a ledger mechanism.

To ensure atomicity and data consistency, MongoDB session-based transactions with replica set configuration are implemented. This guarantees that all multi-step financial operations either complete successfully or roll back entirely in case of failure.

Core Features

• User authentication using JWT
• Secure money transfer between accounts
• Ledger-based double-entry system (DEBIT and CREDIT entries)
• Transaction lifecycle management (PENDING → COMPLETED)
• Email notifications for debit and credit alerts
• Dashboard displaying account details and transaction history
• MongoDB session-based transactions

Technology Stack

Backend: Node.js, Express.js
Frontend: React.js
Database: MongoDB (Replica Set enabled)
Authentication: JSON Web Token (JWT)
Email Service: Nodemailer with Gmail OAuth2

Database Configuration

Database URL:

DB_URL = mongodb://localhost:27017/banksys?replicaSet=rs0

Replica set is required to enable MongoDB multi-document transactions.

Server Configuration

PORT = 3000

Authentication Configuration

JWT_SECRET = <your-secret-key>

JWT is used for secure authentication and authorization of users.

Email API Configuration (Environment Variables)

CLIENT_ID = <gmail-client-id>
CLIENT_SECRET = <gmail-client-secret>
REFRESH_TOKEN = <gmail-refresh-token>
EMAIL_USER = <system-email-address>

These are used for sending transactional email notifications.

API Endpoints
User Authentication

POST /api/auth/register
POST /api/auth/login

Account Management

POST /api/account/createaccount
GET /api/account/myaccount

Transaction Management

POST /api/transactions/sendmoney
GET /api/transactions/mytransaction

System Access (Admin-Level Operation)

POST /api/transactions/system/initialfunds

This endpoint is used to initialize system-level funds or seed accounts.

Transaction Flow (High-Level)

User initiates money transfer

MongoDB session starts

Transaction document created with PENDING status

Ledger entries created (DEBIT and CREDIT)

Account balances updated

Transaction marked as COMPLETED

Session committed

Email notifications sent to sender and receiver


Architectural Concept

The system follows a layered structure:

Client (React Frontend)
↓
REST API (Express Backend)
↓
Business Logic Layer
↓
MongoDB (Replica Set)
↓
Ledger & Transaction Management


Learning Outcomes

Through this project, the following concepts were implemented and understood:

• Database transaction management
• session based transaction
• Double-entry system
• Backend REST API design
• JWT-based authentication
• Replica set configuration in MongoDB
• Email integration with OAuth2