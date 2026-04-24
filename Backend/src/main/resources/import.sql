-- Insert parent categories
INSERT INTO categories (name, description, icon, parent_id) VALUES ('Điện tử', 'Các sản phẩm điện tử, công nghệ', '📱', NULL) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO categories (name, description, icon, parent_id) VALUES ('Thời trang', 'Quần áo, giày dép, phụ kiện', '👕', NULL) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO categories (name, description, icon, parent_id) VALUES ('Nội thất', 'Đồ nội thất, trang trí nhà cửa', '🛋️', NULL) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO categories (name, description, icon, parent_id) VALUES ('Sách & Văn phòng phẩm', 'Sách, vở, dụng cụ học tập', '📚', NULL) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO categories (name, description, icon, parent_id) VALUES ('Thể thao & Giải trí', 'Dụng cụ thể thao, đồ chơi', '⚽', NULL) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO categories (name, description, icon, parent_id) VALUES ('Xe cộ', 'Xe máy, xe đạp, phụ tùng', '🚗', NULL) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO categories (name, description, icon, parent_id) VALUES ('Mẹ & Bé', 'Đồ dùng cho mẹ và bé', '👶', NULL) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO categories (name, description, icon, parent_id) VALUES ('Làm đẹp & Sức khỏe', 'Mỹ phẩm, chăm sóc sức khỏe', '💄', NULL) ON DUPLICATE KEY UPDATE name=name;
