package com.stylehub.service;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.stylehub.dto.PlaceOrderRequest;
import com.stylehub.dto.OrderItemRequest;
import com.stylehub.dto.UpdateOrderStatusRequest;
import com.stylehub.dto.VerifyPaymentRequest;
import com.stylehub.exception.BadRequestException;
import com.stylehub.exception.ResourceNotFoundException;
import com.stylehub.model.Order;
import com.stylehub.model.OrderItem;
import com.stylehub.model.OrderStatus;
import com.stylehub.model.PaymentMethod;
import com.stylehub.model.PaymentStatus;
import com.stylehub.model.Product;
import com.stylehub.model.User;
import com.stylehub.repository.OrderRepository;
import com.stylehub.repository.ProductRepository;
import com.stylehub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Value("${razorpay.currency}")
    private String currency;

    @Transactional
    public Order placeOrder(User user, PlaceOrderRequest req) {
        List<OrderItem> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest ir : req.getItems()) {
            Product p = productRepository.findById(ir.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + ir.getProductId()));
            if (!p.getAvailable()) throw new BadRequestException("Product not available: " + p.getName());

            OrderItem item = new OrderItem();
            item.setProduct(p);
            item.setQuantity(ir.getQuantity());
            item.setSize(ir.getSize());
            item.setPrice(p.getPrice());
            total = total.add(p.getPrice().multiply(BigDecimal.valueOf(ir.getQuantity())));
            items.add(item);
        }

        Order order = new Order();
        order.setUser(user);
        order.setTotalAmount(total);
        order.setShippingAddress(req.getShippingAddress());
        order.setShippingName(req.getShippingName());
        order.setShippingPhone(req.getShippingPhone());
        order.setPaymentMethod(req.getPaymentMethod());
        order.setStatus(OrderStatus.PLACED);
        order.setEstimatedDelivery(estimatedDelivery());

        if (req.getPaymentMethod() == PaymentMethod.COD) {
            order.setPaymentStatus(PaymentStatus.PENDING);
        } else {
            order.setPaymentStatus(PaymentStatus.PENDING);
            try {
                RazorpayClient client = new RazorpayClient(keyId, keySecret);
                JSONObject rq = new JSONObject();
                rq.put("amount", total.multiply(BigDecimal.valueOf(100)).longValueExact());
                rq.put("currency", currency);
                rq.put("receipt", "order_" + System.currentTimeMillis());
                com.razorpay.Order ro = client.orders.create(rq);
                order.setRazorpayOrderId(ro.get("id"));
            } catch (RazorpayException e) {
                throw new BadRequestException("Payment gateway error: " + e.getMessage());
            }
        }

        Order saved = orderRepository.save(order);
        for (OrderItem item : items) {
            item.setOrder(saved);
        }
        saved.setItems(items);
        return orderRepository.save(saved);
    }

    public void verifyPayment(VerifyPaymentRequest req) {
        Order order = orderRepository.findByRazorpayOrderId(req.getRazorpayOrderId())
                .orElseThrow(() -> new BadRequestException("Order not found"));
        try {
            JSONObject attrs = new JSONObject();
            attrs.put("razorpay_order_id", req.getRazorpayOrderId());
            attrs.put("razorpay_payment_id", req.getRazorpayPaymentId());
            attrs.put("razorpay_signature", req.getRazorpaySignature());

            if (!Utils.verifyPaymentSignature(attrs, keySecret)) {
                order.setPaymentStatus(PaymentStatus.FAILED);
                orderRepository.save(order);
                throw new BadRequestException("Payment verification failed");
            }

            order.setRazorpayPaymentId(req.getRazorpayPaymentId());
            order.setPaymentStatus(PaymentStatus.SUCCESS);
            order.setStatus(OrderStatus.CONFIRMED);
            order.setUpdatedAt(LocalDateTime.now());
            orderRepository.save(order);

        } catch (RazorpayException e) {
            throw new BadRequestException("Verification error: " + e.getMessage());
        }
    }

    public List<Order> getMyOrders(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public Order getById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
    }

    public Order updateStatus(Long id, UpdateOrderStatusRequest req) {
        Order order = getById(id);
        order.setStatus(req.getStatus());
        if (req.getTrackingId() != null) order.setTrackingId(req.getTrackingId());
        if (req.getEstimatedDelivery() != null) order.setEstimatedDelivery(req.getEstimatedDelivery());
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    private String estimatedDelivery() {
        var date = LocalDateTime.now().plusDays(5);
        return date.format(DateTimeFormatter.ofPattern("dd MMM yyyy"));
    }
}