package com.example.demo.service;

import com.example.demo.Repository.OrderRepository;
import com.example.demo.Repository.ProductRepository;
import com.example.demo.dto.OrderRequest;
import com.example.demo.dto.OrderResponse;
import com.example.demo.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Transactional
    public OrderResponse createOrder(User user, OrderRequest request) {
        System.out.println("=== Creating Order ===");
        System.out.println("User ID: " + user.getId());
        System.out.println("User Email: " + user.getEmail());
        System.out.println("Items count: " + request.getItems().size());
        System.out.println("Final Amount: " + request.getFinalAmount());
        
        Order order = new Order();
        order.setUser(user);
        order.setTotalAmount(request.getTotalAmount());
        order.setShippingFee(request.getShippingFee());
        order.setDiscountAmount(request.getDiscountAmount());
        order.setFinalAmount(request.getFinalAmount());
        
        // Set shipping info
        order.setShippingFullName(request.getShippingInfo().getFullName());
        order.setShippingEmail(request.getShippingInfo().getEmail());
        order.setShippingPhone(request.getShippingInfo().getPhone());
        order.setShippingAddress(request.getShippingInfo().getAddress());
        order.setShippingCity(request.getShippingInfo().getCity());
        order.setShippingNote(request.getShippingInfo().getNote());
        
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus("pending");
        
        // Save order first to get ID
        order = orderRepository.save(order);
        System.out.println("Order saved with ID: " + order.getId());
        
        // Create order items
        for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemReq.getProductId()));
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setProductName(itemReq.getProductName());
            orderItem.setProductPrice(itemReq.getProductPrice());
            orderItem.setProductImage(itemReq.getProductImage());
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setSubtotal(itemReq.getSubtotal());
            
            order.getItems().add(orderItem);
        }
        System.out.println("Added " + order.getItems().size() + " items to order");
        
        // Create initial status history
        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(order);
        history.setStatus("pending");
        history.setNote("Đơn hàng đã được tạo");
        order.getStatusHistory().add(history);
        
        order = orderRepository.save(order);
        System.out.println("Order fully saved with items and history");
        System.out.println("=== Order Created Successfully ===");
        
        return OrderResponse.fromEntity(order);
    }
    
    public List<OrderResponse> getUserOrders(User user) {
        List<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(user);
        return orders.stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    public OrderResponse getOrderById(Long orderId, User user) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to order");
        }
        
        return OrderResponse.fromEntity(order);
    }
    
    @Transactional
    public OrderResponse cancelOrder(Long orderId, User user) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to order");
        }
        
        if (!order.getStatus().equals("pending") && !order.getStatus().equals("processing")) {
            throw new RuntimeException("Cannot cancel order with status: " + order.getStatus());
        }
        
        order.setStatus("cancelled");
        
        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(order);
        history.setStatus("cancelled");
        history.setNote("Người dùng hủy đơn");
        order.getStatusHistory().add(history);
        
        order = orderRepository.save(order);
        
        return OrderResponse.fromEntity(order);
    }
    
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String newStatus, String note) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setStatus(newStatus);
        
        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(order);
        history.setStatus(newStatus);
        history.setNote(note);
        order.getStatusHistory().add(history);
        
        order = orderRepository.save(order);
        
        return OrderResponse.fromEntity(order);
    }
}
