package com.stylehub.controller;
import com.stylehub.dto.*;
import com.stylehub.model.*;
import com.stylehub.repository.UserRepository;
import com.stylehub.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/orders") @RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final UserRepository userRepository;

    @PostMapping public ResponseEntity<Order> placeOrder(@Valid @RequestBody PlaceOrderRequest req, Authentication auth) {
        return ResponseEntity.ok(orderService.placeOrder(user(auth), req));
    }
    @PostMapping("/verify-payment") public ResponseEntity<ApiResponse> verifyPayment(@Valid @RequestBody VerifyPaymentRequest req) {
        orderService.verifyPayment(req);
        return ResponseEntity.ok(new ApiResponse(true, "Payment verified! Order confirmed."));
    }
    @GetMapping("/my") public ResponseEntity<List<Order>> myOrders(Authentication auth) { return ResponseEntity.ok(orderService.getMyOrders(user(auth))); }
    @GetMapping("/{id}") public ResponseEntity<Order> getOrder(@PathVariable Long id) { return ResponseEntity.ok(orderService.getById(id)); }

    private User user(Authentication auth) { return userRepository.findByEmail(auth.getName()).orElseThrow(); }
}
