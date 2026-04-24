package com.example.demo.Controller;

import com.example.demo.entity.Product;
import com.example.demo.entity.ProductImage;
import com.example.demo.dto.ProductRequest;
import com.example.demo.dto.ProductResponse;
import com.example.demo.service.ProductService;
import com.example.demo.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;
    
    @Autowired
    private FileStorageService fileStorageService;

    // GET /api/products - Lấy tất cả sản phẩm
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllProducts() {
        try {
            List<Product> products = productService.getAllProducts();
            List<ProductResponse> productResponses = products.stream()
                    .map(ProductResponse::new)
                    .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", productResponses);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Lỗi khi lấy danh sách sản phẩm: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // GET /api/products/{id} - Lấy sản phẩm theo ID (chỉ số — tránh xung đột với /search)
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<Map<String, Object>> getProductById(@PathVariable Long id) {
        try {
            Product product = productService.getProductById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", new ProductResponse(product));
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    // POST /api/products - Tạo sản phẩm mới với ảnh
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, Object>> createProductWithImages(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("productType") String productType,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam("userId") Long userId,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {
        try {
            // Tạo product
            Product product = new Product();
            product.setName(name);
            product.setDescription(description);
            product.setPrice(price);
            product.setProductType(productType);
            
            Product newProduct = productService.createProduct(product, userId, categoryId);
            
            // Upload và lưu ảnh
            if (images != null && !images.isEmpty()) {
                for (int i = 0; i < images.size(); i++) {
                    MultipartFile file = images.get(i);
                    if (!file.isEmpty()) {
                        String imageUrl = fileStorageService.storeFile(file);
                        ProductImage productImage = new ProductImage(
                            newProduct, 
                            imageUrl, 
                            i == 0, // Ảnh đầu tiên là primary
                            i
                        );
                        newProduct.addImage(productImage);
                    }
                }
                // Lưu lại product với images
                newProduct = productService.updateProduct(newProduct.getId(), newProduct);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đăng tin thành công");
            response.put("data", new ProductResponse(newProduct));
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Lỗi khi tạo sản phẩm: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    // POST /api/products/json - Tạo sản phẩm không có ảnh (giữ lại cho compatibility)
    @PostMapping(value = "/json", consumes = {"application/json"})
    public ResponseEntity<Map<String, Object>> createProductJson(@RequestBody ProductRequest request) {
        try {
            Product product = new Product();
            product.setName(request.getName());
            product.setDescription(request.getDescription());
            product.setPrice(request.getPrice());
            product.setProductType(request.getProductType());
            
            Product newProduct = productService.createProduct(
                product, 
                request.getUserId(), 
                request.getCategoryId()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đăng tin thành công");
            response.put("data", new ProductResponse(newProduct));
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }


    // PUT /api/products/{id} - Cập nhật sản phẩm
    @PutMapping("/{id:\\d+}")
    public ResponseEntity<Map<String, Object>> updateProduct(
            @PathVariable Long id, 
            @RequestBody ProductRequest request) {
        try {
            Product productDetails = new Product();
            productDetails.setName(request.getName());
            productDetails.setDescription(request.getDescription());
            productDetails.setPrice(request.getPrice());
            
            Product updatedProduct = productService.updateProduct(id, productDetails);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cập nhật sản phẩm thành công");
            response.put("data", new ProductResponse(updatedProduct));
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    // DELETE /api/products/{id} - Xóa sản phẩm
    @DeleteMapping("/{id:\\d+}")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Xóa sản phẩm thành công");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    // GET /api/products/category/{categoryId} - Lấy sản phẩm theo category
    @GetMapping("/category/{categoryId:\\d+}")
    public ResponseEntity<Map<String, Object>> getProductsByCategory(@PathVariable Long categoryId) {
        try {
            List<Product> products = productService.getProductsByCategory(categoryId);
            List<ProductResponse> productResponses = products.stream()
                    .map(ProductResponse::new)
                    .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", productResponses);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Lỗi khi lấy sản phẩm theo category: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // GET /api/products/user/{userId} - Lấy sản phẩm theo user
    @GetMapping("/user/{userId:\\d+}")
    public ResponseEntity<Map<String, Object>> getProductsByUser(@PathVariable Long userId) {
        try {
            List<Product> products = productService.getProductsByUser(userId);
            List<ProductResponse> productResponses = products.stream()
                    .map(ProductResponse::new)
                    .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", productResponses);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Lỗi khi lấy sản phẩm của user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // GET /api/products/search?keyword=... - Tìm kiếm sản phẩm
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchProducts(@RequestParam String keyword) {
        try {
            List<Product> products = productService.searchProducts(keyword);
            List<ProductResponse> productResponses = products.stream()
                    .map(ProductResponse::new)
                    .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", productResponses);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Lỗi khi tìm kiếm sản phẩm: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    // GET /api/products/type/{type} - Lấy sản phẩm theo loại (sale/free)
    @GetMapping("/type/{type}")
    public ResponseEntity<Map<String, Object>> getProductsByType(@PathVariable String type) {
        try {
            List<Product> products = productService.getProductsByType(type);
            List<ProductResponse> productResponses = products.stream()
                    .map(ProductResponse::new)
                    .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", productResponses);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Lỗi khi lấy sản phẩm theo loại: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
