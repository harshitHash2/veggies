# Node Mongo Store - Final (ESM, Full Implementation)

Quick start:
1. Copy `.env.example` to `.env` and set values.
2. npm install
3. npm run dev (requires nodemon) or npm start
4. Ensure MongoDB is running and reachable via MONGO_URI

APIs are namespaced exactly as requested:
- /api/Account/...
- /api/Auth/...
- /api/Buyer/...
- /api/Seller/...
Responses follow `{ code, msg, data? }` format.
