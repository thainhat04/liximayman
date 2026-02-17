# Database Setup Guide

## ⚠️ Connection Issue

The database connection failed with authentication error. Please check:

### 1. Database Credentials

Verify your `.env` file has correct credentials:

```env
DB_HOST=10.1.2.21
DB_PORT=5436
DB_NAME=testdb
DB_USER=pila
DB_PASSWORD=123
```

### 2. Check PostgreSQL Server

Test connection manually:

```bash
psql -h 10.1.2.21 -p 5436 -U pila -d testdb
```

Enter password when prompted: `123`

### 3. Common Issues

#### Password Authentication Failed
- Password is incorrect → Update `.env` with correct password
- User doesn't exist → Create user first
- User doesn't have access to database → Grant permissions

#### Create User (if needed)
```sql
-- Connect as postgres superuser first
CREATE USER pila WITH PASSWORD '123';
GRANT ALL PRIVILEGES ON DATABASE testdb TO pila;
```

#### Database doesn't exist
```sql
CREATE DATABASE testdb OWNER pila;
```

### 4. Setup Database Schema

Once connection works, run:

```bash
npm run db:setup
```

This will create the required tables and indexes.

## Manual Schema Setup

If automatic setup doesn't work, you can run the SQL manually:

```bash
psql -h 10.1.2.21 -p 5436 -U pila -d testdb -f src/database/schema.sql
```

## Fallback Mode

If database is not available, the server will automatically fallback to **in-memory storage**.

You'll see this message when starting:
```
🗄️  Database: In-Memory (Fallback)
```

### Limitations of In-Memory Mode:
- ❌ Data lost on server restart
- ❌ No persistence
- ❌ Cannot scale horizontally
- ✅ Good for development/testing

## Production Setup

For production, ensure:
1. ✅ PostgreSQL is properly configured
2. ✅ Connection pooling is enabled (already configured)
3. ✅ Regular backups are scheduled
4. ✅ Use strong passwords
5. ✅ Enable SSL connection (add to .env):
   ```env
   DB_SSL=true
   ```

## Testing Connection

Run health check after server starts:

```bash
curl http://localhost:3000/health
```

Response should show:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-02-17T..."
}
```

## Next Steps

1. Fix database credentials in `.env`
2. Test connection with `psql` command
3. Run `npm run db:setup`
4. Start server with `npm run dev`
5. Check `/health` endpoint

## Need Help?

- Check PostgreSQL logs for more details
- Verify network connectivity to 10.1.2.21:5436
- Ensure PostgreSQL is accepting remote connections
- Check `pg_hba.conf` for authentication settings
