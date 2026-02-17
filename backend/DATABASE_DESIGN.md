# Database Design

## Enhanced Schema

### Table: `packets`
Lưu thông tin bộ bao lì xì (red envelope collection)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| creator_token | UUID | NOT NULL, UNIQUE | Token để edit (giữ bí mật) |
| name | VARCHAR(255) | NULL | Tên bộ bao lì xì (optional) |
| total_envelopes | INTEGER | NOT NULL | Tổng số bao lì xì |
| opened_count | INTEGER | DEFAULT 0 | Số bao đã mở |
| allow_multiple_open | BOOLEAN | DEFAULT false | Cho phép mở nhiều lần |
| is_active | BOOLEAN | DEFAULT true | Trạng thái active |
| created_at | TIMESTAMP | DEFAULT NOW() | Thời gian tạo |
| updated_at | TIMESTAMP | DEFAULT NOW() | Thời gian cập nhật |

**Indexes:**
- PRIMARY KEY (id)
- UNIQUE INDEX (creator_token)
- INDEX (created_at)

---

### Table: `envelopes`
Lưu từng bao lì xì riêng lẻ

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| packet_id | UUID | NOT NULL, FOREIGN KEY | Tham chiếu đến packets.id |
| amount | DECIMAL(15,2) | NOT NULL | Số tiền (VNĐ) |
| image_id | VARCHAR(50) | NOT NULL | ID mẫu bao lì xì |
| is_opened | BOOLEAN | DEFAULT false | Đã mở chưa |
| opened_at | TIMESTAMP | NULL | Thời gian mở |
| opened_by | VARCHAR(100) | NULL | IP hoặc identifier người mở (optional) |
| created_at | TIMESTAMP | DEFAULT NOW() | Thời gian tạo |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (packet_id) REFERENCES packets(id) ON DELETE CASCADE
- INDEX (packet_id, is_opened)
- INDEX (is_opened)

---

## Relationships

```
packets (1) ──── (N) envelopes
```

- Một packet có nhiều envelopes
- Khi xóa packet → tự động xóa tất cả envelopes (CASCADE)
- Khi reset packet status → reset tất cả envelope status

---

## Business Logic

### 1. Create Packet
```sql
INSERT INTO packets (id, creator_token, total_envelopes)
VALUES (uuid, token, count);

INSERT INTO envelopes (id, packet_id, amount, image_id)
VALUES (uuid1, packet_id, 100000, 'red-gold'),
       (uuid2, packet_id, 200000, 'lucky-red');
```

### 2. Open Envelope (Claim)
```sql
-- Check if envelope can be opened
SELECT is_opened FROM envelopes WHERE id = envelope_id;

-- If not opened, mark as opened
UPDATE envelopes 
SET is_opened = true, opened_at = NOW()
WHERE id = envelope_id AND is_opened = false;

-- Update packet opened count
UPDATE packets 
SET opened_count = opened_count + 1 
WHERE id = packet_id;
```

### 3. Reset Packet (Admin/Creator)
```sql
-- Reset all envelopes in packet
UPDATE envelopes 
SET is_opened = false, opened_at = NULL, opened_by = NULL
WHERE packet_id = packet_id;

-- Reset packet counter
UPDATE packets 
SET opened_count = 0 
WHERE id = packet_id;
```

### 4. Update Packet (Edit)
```sql
-- Validate creator token
SELECT id FROM packets WHERE id = packet_id AND creator_token = token;

-- Delete old envelopes
DELETE FROM envelopes WHERE packet_id = packet_id;

-- Insert new envelopes
INSERT INTO envelopes (id, packet_id, amount, image_id)
VALUES ...;

-- Update packet
UPDATE packets 
SET total_envelopes = new_count, opened_count = 0, updated_at = NOW()
WHERE id = packet_id;
```

---

## Enhancements

### Optional Features (Future)

1. **Rate Limiting per IP**
```sql
opened_by VARCHAR(100) -- Store IP address
```

2. **Expiration**
```sql
expires_at TIMESTAMP -- Auto expire after X days
```

3. **Analytics**
```sql
view_count INTEGER DEFAULT 0
last_viewed_at TIMESTAMP
```

4. **Soft Delete**
```sql
deleted_at TIMESTAMP NULL
```

---

## Migration Strategy

1. Create tables with schema
2. Add indexes for performance
3. Migrate existing in-memory data (if any)
4. Update application code to use database
5. Test thoroughly before production

---

## Performance Considerations

- Use UUIDs for distributed systems
- Add indexes on frequently queried columns
- Use connection pooling
- Consider Redis cache for frequently accessed packets
- Implement read replicas for scaling reads
