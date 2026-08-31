package com.stylehub.dto;
import com.stylehub.model.PaymentMethod;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;
@Data
public class PlaceOrderRequest {
    @NotEmpty private List<OrderItemRequest> items;
    @NotBlank private String shippingAddress;
    @NotBlank private String shippingName;
    @NotBlank private String shippingPhone;
    @NotNull private PaymentMethod paymentMethod;
}
