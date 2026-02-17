#!/bin/bash

# Test script for Red Envelope API

BASE_URL="http://localhost:3000/api"

echo "🧪 Testing Red Envelope API"
echo "============================"
echo ""

# Test 1: Health check
echo "1️⃣ Testing health endpoint..."
curl -s http://localhost:3000/health | jq '.'
echo ""

# Test 2: Create red envelope
echo "2️⃣ Creating red envelope..."
RESPONSE=$(curl -s -X POST $BASE_URL/red-envelopes \
  -H "Content-Type: application/json" \
  -d '{
    "envelopes": [
      {
        "amount": 100000,
        "imageId": "red-gold"
      },
      {
        "amount": 200000,
        "imageId": "lucky-red"
      }
    ]
  }')

echo "$RESPONSE" | jq '.'
echo ""

# Extract ID and token
ID=$(echo "$RESPONSE" | jq -r '.id')
TOKEN=$(echo "$RESPONSE" | jq -r '.creatorToken')

echo "📝 Created envelope with ID: $ID"
echo "🔑 Creator token: $TOKEN"
echo ""

# Test 3: Get red envelope (public)
echo "3️⃣ Getting red envelope (public view)..."
curl -s $BASE_URL/red-envelopes/$ID | jq '.'
echo ""

# Test 4: Update red envelope
echo "4️⃣ Updating red envelope..."
curl -s -X PUT "$BASE_URL/red-envelopes/$ID?token=$TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "envelopes": [
      {
        "amount": 500000,
        "imageId": "golden-fortune"
      }
    ]
  }' | jq '.'
echo ""

# Test 5: Try to update without token (should fail)
echo "5️⃣ Testing unauthorized update (should fail)..."
curl -s -X PUT "$BASE_URL/red-envelopes/$ID" \
  -H "Content-Type: application/json" \
  -d '{
    "envelopes": [
      {
        "amount": 999999,
        "imageId": "red-gold"
      }
    ]
  }' | jq '.'
echo ""

echo "✅ Tests completed!"
