# Full Stack Order Management System

## 🎯 Project Overview

A complete order management system with NestJS backend and Next.js frontend. The system allows viewing orders and cancelling them with balance management.

## Backend Requirements:

### Core Tasks:

1. **Complete GET /orders endpoint**

   - Return orders with customer and store names
   - Add database joins to fetch customer and store data
   - Match exact response format in TODO comments

2. **Complete DELETE /orders/:id endpoint**

   - Cancel order with balance checking (no email sending)
   - Check user balance when refund is requested
   - If balance sufficient AND refund=true: deduct from store balance
   - If insufficient balance: return error "Insufficient balance"
   - Return formatted response matching TODO specifications

3. **Write Tests**
   - Unit tests for both endpoints
   - Test balance checking and deduction logic
   - Test error handling scenarios

## Frontend Requirements:

1. **Load Orders List**

   - Show all orders when the page opens
   - Display orders in a table format

2. **Cancel Orders**

   - Each order should have a "Cancel" button
   - Clicking cancel opens a modal with 2 buttons:
     - "Cancel with refund"
     - "Cancel without a refund"

3. **Handle Cancellation**
   - When cancellation is successful, close the modal and update the orders list
   - If there's an error, show an error message and keep the modal open
   - It should deduct the order amount from the store balance

## 📁 Project Structure

- `server/` - NestJS backend API
- `client/` - Next.js frontend application

## ⏱️ Time Estimates

- **Backend**: 3-4 hours
- **Frontend**: 3-4 hours
