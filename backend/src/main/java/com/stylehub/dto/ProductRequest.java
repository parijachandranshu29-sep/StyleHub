package com.stylehub.dto;
import com.stylehub.model.Gender;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
@Data
public class ProductRequest {
    @NotBlank private String name;
    private String description;
    @NotNull @Positive private BigDecimal price;
    private BigDecimal originalPrice;
    @NotBlank private String category;
    @NotNull private Gender gender;
    private String imageUrl1;
    private String imageUrl2;
    private String imageUrl3;
    private String sizes;
    private String color;
    private Boolean available;
    private Integer stock;
    private Boolean featured;
}
