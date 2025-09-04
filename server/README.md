# Backend Developer Task

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Copy .env:

```bash
cp .env.dist .env
```

3. Run the development server:

```bash
npm run start:dev
```

4. Open [http://localhost:4000](http://localhost:4000) to view the application.

## 🎯 Backend Requirements

### Core Tasks:

**1. Complete GET /orders endpoint**

- Return orders with customer and store names (see TODO in controller)
- Add database joins to fetch customer and store data
- Match the exact response format specified in TODO comments

**2. Complete DELETE /orders/:id endpoint**

- Cancel order with balance checking instead of email sending
- Check if user has sufficient balance when refund is requested
- If balance is sufficient AND refund is true, deduct amount from store balance
- If insufficient balance, return error "Insufficient balance"
- Return formatted response matching TODO specifications

**3. Write Tests**

- Add unit tests for both endpoints
- Test success cases and error handling
- Test balance checking and deduction logic
- Follow existing test patterns and conventions

### Technical Requirements:

- All code must pass `npm run test` and `npm run lint`
- Follow existing NestJS/TypeORM patterns and conventions
- Match exact response formats specified in TODO comments
- Implement proper error handling and validation

### Balance Logic:

- When `refund=true`: Check store balance, deduct if sufficient, return error if insufficient
- When `refund=false`: Cancel order without balance checking
- Store balance should be tracked and updated appropriately
- Return clear error messages for insufficient balance scenarios

### Time Estimate: 3-4 hours
