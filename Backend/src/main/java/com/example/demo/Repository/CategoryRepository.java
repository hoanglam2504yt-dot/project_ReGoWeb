package com.example.demo.Repository;

import com.example.demo.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    // Tìm category theo tên
    Optional<Category> findByName(String name);
    
    // Lấy tất cả categories cha (không có parent)
    List<Category> findByParentIsNull();
    
    // Lấy tất cả sub-categories của một category cha
    List<Category> findByParentId(Long parentId);
    
    // Kiểm tra category có tồn tại theo tên
    boolean existsByName(String name);
    
    // Lấy categories với số lượng sản phẩm
    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.products WHERE c.parent IS NULL")
    List<Category> findAllParentCategoriesWithProducts();
}
