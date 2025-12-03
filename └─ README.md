# Ecom Project (Catalog + Inventory)

## Prereqs

- Node 18+, npm
- Docker & Docker Compose (optional) OR local MongoDB replica set / Atlas

## Local w/ Docker compose (recommended)

1. Start services:
   docker-compose up -d

2. Initialize replica set (local mongo):
   docker exec -it <mongo_container> mongosh --eval "rs.initiate()"

3. Seed DB (runs once):
   docker exec -it <backend_container> npm run seed
   OR from host: cd backend && npm run seed

4. (Optional) apply DB validators:
   cd backend && npm run setup-validators

5. Open:
   Backend: http://localhost:4000
   Frontend: http://localhost:5173

## Dev without docker

- Start mongo (replica set) or use Atlas
- cd backend && npm install && npm run dev
- cd frontend && npm install && npm run dev
