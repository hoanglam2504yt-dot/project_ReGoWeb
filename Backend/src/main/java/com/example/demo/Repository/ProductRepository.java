package com.example.demo.Repository;

import com.example.demo.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Tìm sản phẩm theo category
    List<Product> findByCategoryId(Long categoryId);
    
    // Tìm sản phẩm theo user
    List<Product> findByUserId(Long userId);
    
    // Tìm kiếm sản phẩm theo tên (không phân biệt hoa thường)
    List<Product> findByNameContainingIgnoreCase(String keyword);

    /** Tìm theo tên hoặc mô tả (theo spec: từ khóa) */
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchByNameOrDescription(@Param("keyword") String keyword);
    
    // Tìm sản phẩm theo khoảng giá
    List<Product> findByPriceBetween(Double minPrice, Double maxPrice);
    
    // Tìm sản phẩm theo loại (sale/free)
    List<Product> findByProductType(String productType);
    
    // Tìm sản phẩm theo loại và sắp xếp theo thời gian tạo giảm dần
    List<Product> findByProductTypeOrderByCreatedAtDesc(String productType);
    
    // Tìm sản phẩm theo category và sắp xếp theo thời gian tạo giảm dần
    List<Product> findByCategoryIdOrderByCreatedAtDesc(Long categoryId);
}