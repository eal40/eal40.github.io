# dHWD Billing System

## Overview
The dHWD Billing System is a Windows desktop application developed in Visual Basic .NET that provides comprehensive billing and customer management functionality for small to medium-sized businesses. The system allows users to manage customers, create invoices, process payments, and generate various reports.

## Features

### Customer Management
- Add new customers with detailed information (name, address, contact details)
- Edit existing customer information
- Search and filter customers
- Track customer payment status

### Invoice Management
- Create new invoices with line items
- Calculate subtotals, taxes, and final amounts
- Set invoice due dates
- Track invoice status (open, paid)

### Payment Processing
- Record customer payments
- Track payment history
- Update customer and invoice status upon payment

### Reporting
- Invoice reports
- Payment reports
- Tax reports

### User Management
- Role-based access control (Staff and Admin roles)
- Secure login system

## Technical Details

### Development Environment
- Language: Visual Basic .NET
- Framework: .NET Framework 4.8
- UI: Windows Forms
- Database: Microsoft Access (db_billing.accdb)

### Project Structure
- **Form1.vb**: Main application form containing the primary UI and business logic
- **Files.vb**: Secondary form for file and customer management
- **Module1.vb**: Contains database connection and utility functions
- **Module2.vb**: Contains UI helper functions and utilities

### Database Schema
The application uses the following main tables:
- **tblcustomer**: Stores customer information
- **tblcreateinvoice**: Stores invoice details
- **tblsummary**: Stores invoice summary information
- **tbluser**: Stores user authentication information

## Installation

1. Ensure you have .NET Framework 4.8 or higher installed
2. Clone or download the repository
3. Open the solution file (Billing Systems.sln) in Visual Studio
4. Build the solution
5. Run the application

## Usage

1. Launch the application
2. Log in with your credentials
   username: admin
   password: admin
4. Use the navigation menu to access different features
5. For new users, start by adding customers before creating invoices

## Dependencies

- Microsoft.VisualBasic.PowerPacks.Vs
- Microsoft.ACE.OLEDB.12.0 (for database access)

## License

This project is proprietary software. All rights reserved.
