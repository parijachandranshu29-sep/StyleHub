package com.stylehub.model;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Table(name="products") @Data @NoArgsConstructor
public class Product {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false,length=150) private String name;
    @Column(length=1000) private String description;
    @Column(nullable=false,precision=10,scale=2) private BigDecimal price;
    @Column(name="original_price",precision=10,scale=2) private BigDecimal originalPrice;
    @Column(nullable=false,length=100) private String category;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private Gender gender;
    @Column(name="image_url1",length=500) private String imageUrl1;
    @Column(name="image_url2",length=500) private String imageUrl2;
    @Column(name="image_url3",length=500) private String imageUrl3;
    @Column(length=100) private String sizes;
    @Column(length=50) private String color;
    @Column(nullable=false) private Boolean available=true;
    @Column(nullable=false) private Integer stock=100;
    @Column(nullable=false) private Boolean featured=false;
    @Column(name="created_at",updatable=false) private LocalDateTime createdAt=LocalDateTime.now();
}
