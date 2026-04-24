package com.example.demo.service;

import com.example.demo.entity.Category;
import com.example.demo.Repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Lấy tất cả categories
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Lấy tất cả parent categories (không có parent)
    public List<Category> getParentCategories() {
        return categoryRepository.findByParentIsNull();
    }

    // Lấy category theo ID
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    // Lấy category theo tên
    public Optional<Category> getCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }

    // Lấy sub-categories của một category
    public List<Category> getSubCategories(Long parentId) {
        return categoryRepository.findByParentId(parentId);
    }

    // Tạo category mới
    public Category createCategory(Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("Category với tên '" + category.getName() + "' đã tồn tại");
        }
        return categoryRepository.save(category);
    }

    // Cập nhật category
    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy category với ID: " + id));

        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        category.setIcon(categoryDetails.getIcon());
        category.setParent(categoryDetails.getParent());

        return categoryRepository.save(category);
    }

    // Xóa category
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy category với ID: " + id));
        categoryRepository.delete(category);
    }

    // Kiểm tra category có tồn tại
    public boolean existsByName(String name) {
        return categoryRepository.existsByName(name);
    }
}
