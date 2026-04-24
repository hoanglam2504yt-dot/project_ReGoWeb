-- Tạo bảng categories
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(255),
    parent_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_parent_id (parent_id),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Thêm cột category_id vào bảng products (nếu chưa có)
-- Kiểm tra và thêm từng cột riêng lẻ
SET @dbname = DATABASE();
SET @tablename = "products";
SET @columnname = "category_id";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " BIGINT")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Thêm cột created_at
SET @columnname = "created_at";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Thêm cột updated_at
SET @columnname = "updated_at";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Thêm foreign key constraint (nếu chưa có)
SET @constraintname = "fk_products_category";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (constraint_name = @constraintname)
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD CONSTRAINT ", @constraintname, " FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Thêm index (nếu chưa có)
SET @indexname = "idx_category_id";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (index_name = @indexname)
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD INDEX ", @indexname, " (category_id)")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Insert dữ liệu mẫu cho categories cha (bỏ qua nếu đã tồn tại)
INSERT IGNORE INTO categories (name, description, icon, parent_id) VALUES
('Điện tử', 'Các sản phẩm điện tử, công nghệ', '📱', NULL),
('Thời trang', 'Quần áo, giày dép, phụ kiện', '👕', NULL),
('Nội thất', 'Đồ nội thất, trang trí nhà cửa', '🛋️', NULL),
('Sách & Văn phòng phẩm', 'Sách, vở, dụng cụ học tập', '📚', NULL),
('Thể thao & Giải trí', 'Dụng cụ thể thao, đồ chơi', '⚽', NULL),
('Xe cộ', 'Xe máy, xe đạp, phụ tùng', '🚗', NULL),
('Mẹ & Bé', 'Đồ dùng cho mẹ và bé', '👶', NULL),
('Làm đẹp & Sức khỏe', 'Mỹ phẩm, chăm sóc sức khỏe', '💄', NULL);

-- Insert sub-categories cho Điện tử (bỏ qua nếu đã tồn tại)
INSERT IGNORE INTO categories (name, description, icon, parent_id) VALUES
('Điện thoại', 'Điện thoại di động các loại', '📱', 1),
('Laptop', 'Máy tính xách tay', '💻', 1),
('Máy tính bảng', 'Tablet các loại', '📱', 1),
('Tai nghe', 'Tai nghe, headphone', '🎧', 1),
('Đồng hồ thông minh', 'Smartwatch, fitness tracker', '⌚', 1);

-- Insert sub-categories cho Thời trang (bỏ qua nếu đã tồn tại)
INSERT IGNORE INTO categories (name, description, icon, parent_id) VALUES
('Quần áo nam', 'Thời trang nam', '👔', 2),
('Quần áo nữ', 'Thời trang nữ', '👗', 2),
('Giày dép nam', 'Giày, dép nam', '👞', 2),
('Giày dép nữ', 'Giày, dép nữ', '👠', 2),
('Túi xách', 'Túi xách, balo', '👜', 2);

-- Insert sub-categories cho Nội thất (bỏ qua nếu đã tồn tại)
INSERT IGNORE INTO categories (name, description, icon, parent_id) VALUES
('Bàn ghế', 'Bàn, ghế các loại', '🪑', 3),
('Giường & Tủ', 'Giường ngủ, tủ quần áo', '🛏️', 3),
('Đèn trang trí', 'Đèn chiếu sáng, trang trí', '💡', 3),
('Đồ trang trí', 'Tranh, cây cảnh, đồ decor', '🖼️', 3);
