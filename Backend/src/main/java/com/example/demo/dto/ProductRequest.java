package com.example.demo.dto;

public class ProductRequest {
    private String name;
    private String description;
    private Double price;
    private String productType;
    private Long categoryId;
    private Long userId;

    // Constructors
    public ProductRequest() {
    }

    public ProductRequest(String name, String description, Double price, Long categoryId, Long userId) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.productType = "sale"; // default
        this.categoryId = categoryId;
        this.userId = userId;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getProductType() {
        return productType;
    }

    public void setProductType(String productType) {
        this.productType = productType;
    }
}
