package com.example.demo.service;

import com.example.demo.entity.Product;
import com.example.demo.entity.Category;
import com.example.demo.entity.User;
import com.example.demo.Repository.ProductRepository;
import com.example.demo.Repository.CategoryRepository;
import com.example.demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    // Lấy tất cả sản phẩm
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Lấy sản phẩm với phân trang
    public Page<Product> getProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    // Lấy sản phẩm theo ID
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // Tạo sản phẩm mới
    public Product createProduct(Product product, Long userId, Long categoryId) {
        // Validate và set default productType
        validateProductType(product.getProductType());
        if (product.getProductType() == null || product.getProductType().isBlank()) {
            product.setProductType("sale");
        }
        
        // Auto-set price to 0 for free items
        if ("free".equals(product.getProductType())) {
            product.setPrice(0.0);
        }
        
        // Tìm user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với ID: " + userId));
        
        // Tìm category (nếu có)
        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy category với ID: " + categoryId));
            product.setCategory(category);
        }
        
        product.setUser(user);
        return productRepository.save(product);
    }
    
    // Validate product type
    private void validateProductType(String productType) {
        if (productType != null && !productType.isBlank() &&
            !productType.equals("sale") && !productType.equals("free")) {
            throw new IllegalArgumentException("Loại sản phẩm phải là 'sale' hoặc 'free'");
        }
    }

    // Cập nhật sản phẩm
    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));

        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        
        if (productDetails.getCategory() != null) {
            product.setCategory(productDetails.getCategory());
        }

        return productRepository.save(product);
    }

    // Xóa sản phẩm
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));
        productRepository.delete(product);
    }

    // Lấy sản phẩm theo category
    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    // Lấy sản phẩm theo user
    public List<Product> getProductsByUser(Long userId) {
        return productRepository.findByUserId(userId);
    }

    // Tìm kiếm sản phẩm theo từ khóa (tên hoặc mô tả)
    public List<Product> searchProducts(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return productRepository.findAll();
        }
        return productRepository.searchByNameOrDescription(keyword.trim());
    }
    
    // Lấy sản phẩm theo loại (sale/free)
    public List<Product> getProductsByType(String productType) {
        validateProductType(productType);
        return productRepository.findByProductTypeOrderByCreatedAtDesc(productType);
    }
    
    // Lấy sản phẩm bán
    public List<Product> getSaleProducts() {
        return getProductsByType("sale");
    }
    
    // Lấy sản phẩm tặng
    public List<Product> getFreeProducts() {
        return getProductsByType("free");
    }
}
