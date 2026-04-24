# Script kiểm tra Backend

Write-Host "=== KIỂM TRA BACKEND ===" -ForegroundColor Green

# 1. Kiểm tra port 8081
Write-Host "`n1. Kiểm tra port 8081..." -ForegroundColor Yellow
$port8081 = netstat -ano | findstr :8081
if ($port8081) {
    Write-Host "✓ Backend đang chạy trên port 8081" -ForegroundColor Green
    Write-Host $port8081
} else {
    Write-Host "✗ Backend KHÔNG chạy trên port 8081" -ForegroundColor Red
    exit 1
}

# 2. Test API products
Write-Host "`n2. Test API /api/products..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8081/api/products" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ API products hoạt động tốt" -ForegroundColor Green
        $json = $response.Content | ConvertFrom-Json
        Write-Host "  Số sản phẩm: $($json.data.Count)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "✗ Lỗi khi gọi API products: $_" -ForegroundColor Red
}

# 3. Test API orders (không có token)
Write-Host "`n3. Test API /api/orders (không có token)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8081/api/orders" -Method GET -UseBasicParsing
    Write-Host "✗ API orders không yêu cầu authentication (BUG!)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 403) {
        Write-Host "✓ API orders yêu cầu authentication (403 Forbidden)" -ForegroundColor Green
    } else {
        Write-Host "? Status code: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
}

# 4. Hướng dẫn tiếp theo
Write-Host "`n=== HƯỚNG DẪN TIẾP THEO ===" -ForegroundColor Green
Write-Host "1. Mở frontend: http://localhost:5173 hoặc http://localhost:5174"
Write-Host "2. Đăng nhập với tài khoản đã có"
Write-Host "3. Mở DevTools (F12) > Application > Local Storage"
Write-Host "4. Kiểm tra có key 'accessToken' không"
Write-Host "5. Nếu không có, đăng xuất và đăng nhập lại"
Write-Host "6. Sau đó thử tạo đơn hàng"

Write-Host "`n=== KẾT THÚC ===" -ForegroundColor Green
