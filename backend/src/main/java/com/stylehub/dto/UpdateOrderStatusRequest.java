package com.stylehub.dto;
import com.stylehub.model.OrderStatus;
import lombok.Data;
@Data
public class UpdateOrderStatusRequest {
    private OrderStatus status;
    private String trackingId;
    private String estimatedDelivery;
}
