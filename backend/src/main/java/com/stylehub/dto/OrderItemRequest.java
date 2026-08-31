package com.stylehub.dto;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data
public class OrderItemRequest {
    @NotNull private Long productId;
    @NotNull @Positive private Integer quantity;
    @NotBlank private String size;
}
