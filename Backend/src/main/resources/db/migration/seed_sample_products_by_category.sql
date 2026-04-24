-- USE exchange_db;
-- USE rego_db;
-- (Bỏ comment một dòng cho đúng database của bạn, hoặc chọn DB trước khi SOURCE file này.)

-- =============================================================================
-- Dữ liệu mẫu: sản phẩm gắn với DANH MỤC CHA (Điện tử, Thời trang, …)
-- Khi frontend bấm ô "Điện tử" → gọi GET /api/products/category/{id} với id của
-- danh mục cha → thấy iPhone 13 và các SP điện tử khác.
-- =============================================================================
-- Điều kiện:
--   1. Đã có bảng categories, products, users (JPA ddl-auto hoặc create_categories_table.sql).
--   2. Có ít nhất 1 user (đăng ký qua app hoặc user demo@rego.vn từ DataInitializer).
--   3. Trong DB phải có đúng tên 8 danh mục cha như dưới (trùng script categories).
--
-- Cách chạy (MySQL):
--   USE exchange_db;   -- hoặc rego_db — đổi cho khớp application.properties
--   SOURCE Backend/src/main/resources/db/migration/seed_sample_products_by_category.sql;
-- =============================================================================

SET @seller_id = (SELECT MIN(id) FROM users);
SET @cat_dientu = (SELECT id FROM categories WHERE name = 'Điện tử' LIMIT 1);
SET @cat_thoitrang = (SELECT id FROM categories WHERE name = 'Thời trang' LIMIT 1);
SET @cat_noithat = (SELECT id FROM categories WHERE name = 'Nội thất' LIMIT 1);
SET @cat_sach = (SELECT id FROM categories WHERE name = 'Sách & Văn phòng phẩm' LIMIT 1);
SET @cat_thethao = (SELECT id FROM categories WHERE name = 'Thể thao & Giải trí' LIMIT 1);
SET @cat_xe = (SELECT id FROM categories WHERE name = 'Xe cộ' LIMIT 1);
SET @cat_mebe = (SELECT id FROM categories WHERE name = 'Mẹ & Bé' LIMIT 1);
SET @cat_lamdep = (SELECT id FROM categories WHERE name = 'Làm đẹp & Sức khỏe' LIMIT 1);

-- Không có user thì không chèn (tránh lỗi FK)
INSERT INTO products (name, description, price, category_id, user_id, created_at, updated_at)
SELECT * FROM (
    SELECT 'iPhone 13 128GB' AS name, 'Máy đẹp 95%, pin 89%, đủ hộp sạc.' AS description, 12500000.0 AS price, @cat_dientu AS category_id, @seller_id AS user_id, NOW() AS created_at, NOW() AS updated_at
    UNION ALL SELECT 'Samsung Galaxy A54', 'Màn AMOLED, RAM 8GB, dùng 8 tháng.', 7200000, @cat_dientu, @seller_id, NOW(), NOW()
    UNION ALL SELECT 'Tai nghe Sony WH-1000XM4', 'Chống ồn, ít trầy.', 4800000, @cat_dientu, @seller_id, NOW(), NOW()
    UNION ALL SELECT 'Áo khoác gió Uniqlo size M', 'Màu navy, giặt máy OK.', 450000, @cat_thoitrang, @seller_id, NOW(), NOW()
    UNION ALL SELECT 'Giày Nike Air size 42', 'Đế còn tốt.', 1800000, @cat_thoitrang, @seller_id, NOW(), NOW()
    UNION ALL SELECT 'Túi tote canvas', 'Dùng vài lần.', 120000, @cat_thoitrang, @seller_id, NOW(), NOW()
    UNION ALL SELECT 'Bàn làm việc gỗ 1m2', 'Chân sắt, mặt MDF.', 1200000, @cat_noithat, @seller_id, NOW(), NOW()
    UNION ALL SELECT 'Ghế công thái học', 'Điều chỉnh độ cao.', 900000, @cat_noithat, @seller_id, NOW(), NOW()
    UNION ALL SELECT 'Đèn bàn LED', '3 mức sáng.', 250000, @cat_noithat, @seller_id, NOW(), NOW()
    UNION ALL SELECT 'Bộ sách Clean Code (tiếng Anh)', 'Gáy hơi vàng.', 350000, @cat_sach, @seller_id, NOW(), NOW()
    UNION ALL SELECT 'Máy tính Casio FX-570VN', 'Pin mới thay.', 180000, @cat_sach, @seller_id, NOW(), NOW()
    UNION ALL SELECT 'Vợt cầu lông Yonex', 'Căng dây 24lb.', 650000, @cat_thethao, @seller_id, NOW(), NOW()
    UNION ALL SELECT 'Boardgame Catan', 'Đủ quân.', 550000, @cat_thethao, @seller_id, NOW(), NOW()
    UNION ALL SELECT 'Xe máy Honda Vision 2019', 'Odo 25k km.', 28000000, @cat_xe, @seller_id, NOW(), NOW()
    UNION ALL SELECT 'Mũ bảo hiểm fullface size L', 'Kính xước nhẹ.', 800000, @cat_xe, @seller_id, NOW(), NOW()
    UNION ALL SELECT 'Xe đẩy em bé Aprica', 'Gấp gọn.', 2200000, @cat_mebe, @seller_id, NOW(), NOW()
    UNION ALL SELECT 'Ghế ăn dặm IKEA', 'Có khay.', 450000, @cat_mebe, @seller_id, NOW(), NOW()
    UNION ALL SELECT 'Máy rửa mặt Foreo mini', 'Sạc được.', 1100000, @cat_lamdep, @seller_id, NOW(), NOW()
    UNION ALL SELECT 'Nước hoa 50ml còn ~70%', 'Hương floral.', 600000, @cat_lamdep, @seller_id, NOW(), NOW()
) AS seed
WHERE @seller_id IS NOT NULL
  AND @cat_dientu IS NOT NULL
  AND @cat_thoitrang IS NOT NULL
  AND @cat_noithat IS NOT NULL
  AND @cat_sach IS NOT NULL
  AND @cat_thethao IS NOT NULL
  AND @cat_xe IS NOT NULL
  AND @cat_mebe IS NOT NULL
  AND @cat_lamdep IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'iPhone 13 128GB' LIMIT 1);
