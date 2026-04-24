#!/bin/bash

# Script kiểm tra API đặt hàng
# Chạy: bash test-order-api.sh

echo "=== Test Order API ==="
echo ""

# 1. Đăng ký user mới (nếu chưa có)
echo "1. Đăng ký user test..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phoneNumber": "0987654321"
  }')
echo "Register Response: $REGISTER_RESPONSE"
echo ""

# 2. Đăng nhập để lấy token
echo "2. Đăng nhập..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')
echo "Login Response: $LOGIN_RESPONSE"
echo ""

# Extract token từ response
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"
echo ""

if [ -z "$TOKEN" ]; then
  echo "❌ Không lấy được token. Vui lòng kiểm tra backend."
  exit 1
fi

# 3. Tạo đơn hàng
echo "3. Tạo đơn hàng..."
ORDER_RESPONSE=$(curl -s -X POST http://localhost:8081/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "items": [
      {
        "productId": 1,
        "productName": "Test Product",
        "productPrice": 100000,
        "productImage": "https://via.placeholder.com/150",
        "quantity": 2,
        "subtotal": 200000
      }
    ],
    "totalAmount": 200000,
    "shippingFee": 30000,
    "discountAmount": 0,
    "finalAmount": 230000,
    "shippingInfo": {
      "fullName": "Test User",
      "email": "test@example.com",
      "phone": "0987654321",
      "address": "123 Test Street",
      "city": "Hà Nội",
      "note": "Test order"
    },
    "paymentMethod": "cod"
  }')
echo "Order Response: $ORDER_RESPONSE"
echo ""

# 4. Lấy danh sách đơn hàng
echo "4. Lấy danh sách đơn hàng..."
ORDERS_RESPONSE=$(curl -s -X GET http://localhost:8081/api/orders \
  -H "Authorization: Bearer $TOKEN")
echo "Orders Response: $ORDERS_RESPONSE"
echo ""

echo "=== Test hoàn tất ==="
