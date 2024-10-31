<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>
## API Description

This is a Restaurant Management API that handles orders and restaurant capacity. Main features include:

### Restaurant Management
- Create and manage restaurants with capacity limits
- Track current number of clients in real-time
- Reset client count for restaurants
- Update restaurant information

### Order System
- Create orders for clients at specific restaurants
- Manage order status (paid, received, preparing, completed, delivered, cancelled)
- Add items to existing orders
- Track order history by client
- Prevent orders when restaurant is at capacity
- Automatically manage restaurant's current client count when orders are created/cancelled

### Key Features
- Real-time capacity management
- One active order per client per restaurant
- Complete order lifecycle management
- Client order history tracking
- Pagination support for listing orders and restaurants

### Technical Details
- Built with NestJS
- PostgreSQL database with TypeORM
- Swagger documentation available at /api/docs
- Docker support for easy deployment

### Put it to Work!

### Development Setup
1. Clone Proyect 
2. Copy ```env.template``` and rename it to ```.env```
3. Execute ```pnpm install```
4. Run database container ``` docker-compose up -d ``` Docker desktop needed
5. Run proyect in development mode  ``` pnpm run start:dev```

### Production Setup
1. Run the full application stack:
First time setup (build and run)
```docker-compose -f docker-compose.prod.yaml up --build```
2. Stop containers ``` docker-compose -f docker-compose.prod.yaml down```
3. Restart existing container ```docker-compose -f docker-compose.prod.yaml up```


#### Access and Testing
1. API Documentation: `localhost:3000/api/docs`
2. Run seed data: `localhost:3000/api/seed`
3. Test endpoints using Swagger UI

Have fun!