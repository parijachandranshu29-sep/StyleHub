package com.stylehub.model;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity @Table(name="orders") @Data @NoArgsConstructor
public class Order {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="user_id",nullable=false) private User user;
    @OneToMany(mappedBy="order",cascade=CascadeType.ALL,fetch=FetchType.LAZY) private List<OrderItem> items;
    @Column(name="total_amount",nullable=false,precision=10,scale=2) private BigDecimal totalAmount;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private OrderStatus status=OrderStatus.PLACED;
    @Enumerated(EnumType.STRING) @Column(name="payment_method",nullable=false) private PaymentMethod paymentMethod;
    @Enumerated(EnumType.STRING) @Column(name="payment_status",nullable=false) private PaymentStatus paymentStatus=PaymentStatus.PENDING;
    @Column(name="razorpay_order_id",length=100) private String razorpayOrderId;
    @Column(name="razorpay_payment_id",length=100) private String razorpayPaymentId;
    @Column(name="shipping_address",length=500,nullable=false) private String shippingAddress;
    @Column(name="shipping_name",length=100) private String shippingName;
    @Column(name="shipping_phone",length=20) private String shippingPhone;
    @Column(name="tracking_id",length=50) private String trackingId;
    @Column(name="estimated_delivery",length=100) private String estimatedDelivery;
    @Column(name="created_at",updatable=false) private LocalDateTime createdAt=LocalDateTime.now();
    @Column(name="updated_at") private LocalDateTime updatedAt=LocalDateTime.now();
}
