# Red Envelope Backend

Backend API for Red Envelope application with PostgreSQL database support.

## 🎯 Features

- ✅ PostgreSQL database integration
- ✅ Automatic fallback to in-memory storage if database unavailable
- ✅ RESTful API endpoints
- ✅ Token-based creator authentication
- ✅ Interactive envelope opening with claim tracking
- ✅ Connection pooling for scalability

## 📦 Database Design

### Tables

**packets** - Red envelope collections
- `id` (UUID): Primary key
- `creator_token` (UUID): Secret token for editing
- `total_envelopes` (INT): Total number of envelopes
- `opened_count` (INT): Number of opened envelopes
- `allow_multiple_open` (BOOLEAN): Allow multiple opens
- `is_active` (BOOLEAN): Soft delete flag

**envelopes** - Individual red envelopes
- `id` (UUID): Primary key
- `packet_id` (UUID): Foreign key to packets
- `amount` (DECIMAL): Money amount
- `image_id` (VARCHAR): Envelope design ID
- `is_opened` (BOOLEAN): Opened status
- `opened_at` (TIMESTAMP): Time opened
- `opened_by` (VARCHAR): IP address of opener

See `DATABASE_DESIGN.md` for full schema details.

## 🚀 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your database credentials:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173

# Database Configuration
DB_HOST=10.1.2.21
DB_PORT=5436
DB_NAME=testdb
DB_USER=pila
DB_PASSWORD=123
```

### 3. Initialize Database

Run database setup:

```bash
npm run db:setup
```

This will create all required tables, indexes, and functions.

## 🏃 Running

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

## 🔍 Health Check

After starting the server:

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-02-17T..."
}
```

## 📡 API Endpoints

### Create Red Envelope
```
POST /api/red-envelopes
Body: RedEnvelopeUpsertDTO
Response: RedEnvelopeDetailDTO (includes publicUrl, editUrl, creatorToken)
```

### Get Red Envelope (Public)
```
GET /api/red-envelopes/:id
Response: RedEnvelopeDTO (amounts hidden for unopened envelopes)
```

### Claim/Open Envelope
```
POST /api/red-envelopes/:id/claim/:envelopeId
Response: ClaimEnvelopeDTO (returns amount if successfully claimed)
```

### Update Red Envelope (Creator Only)
```
PUT /api/red-envelopes/:id?token=CREATOR_TOKEN
Body: RedEnvelopeUpsertDTO
Response: RedEnvelopeDTO
```

## 🗄️ Storage Modes

### PostgreSQL (Primary)
- ✅ Persistent storage
- ✅ Scalable with connection pooling
- ✅ ACID transactions
- ✅ Advanced features (functions, triggers)

### In-Memory (Fallback)
- ⚠️ Data lost on restart
- ✅ No database required
- ✅ Fast for development/testing

The server automatically falls back to in-memory storage if database connection fails.

## 🔧 Database Troubleshooting

If you encounter database connection issues, see `DATABASE_SETUP.md` for detailed troubleshooting guide.

Common issues:
- Password authentication failed → Check credentials in `.env`
- Connection refused → Ensure PostgreSQL is running
- Database doesn't exist → Create database first

## 🧪 Testing

Test with curl:

```bash
# Create envelope
curl -X POST http://localhost:3000/api/red-envelopes \
  -H "Content-Type: application/json" \
  -d '{"envelopes":[{"amount":100000,"imageId":"red-gold"}]}'

# Get envelope
curl http://localhost:3000/api/red-envelopes/ENVELOPE_ID

# Claim envelope
curl -X POST http://localhost:3000/api/red-envelopes/PACKET_ID/claim/ENVELOPE_ID
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts           # PostgreSQL connection
│   ├── database/
│   │   ├── schema.sql            # Database schema
│   │   └── init.ts               # Database initialization
│   ├── routes/
│   │   └── redEnvelopeRoutes.ts  # API routes
│   ├── storage/
│   │   ├── DatabaseStorage.ts    # PostgreSQL storage
│   │   └── InMemoryStorage.ts    # Fallback storage
│   ├── types/
│   │   └── RedEnvelope.ts        # TypeScript types
│   └── server.ts                 # Main server file
├── scripts/
│   └── setup-database.ts         # Database setup script
└── package.json
```

## 🔒 Security

- Creator token is UUID v4 (cryptographically secure)
- Tokens never exposed in public API responses
- SQL injection prevented with parameterized queries
- Password not stored in code (environment variables)

## 📈 Scaling

The application is ready for production scaling:

1. **Database**: PostgreSQL with connection pooling
2. **Horizontal Scaling**: Stateless design allows multiple instances
3. **Caching**: Add Redis for frequently accessed packets
4. **Load Balancing**: Put instances behind load balancer
5. **Database Replication**: Use read replicas for scaling reads

## 📝 License

MIT
