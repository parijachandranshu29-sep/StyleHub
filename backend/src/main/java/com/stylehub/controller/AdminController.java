package com.stylehub.controller;
import com.stylehub.dto.*;
import com.stylehub.model.*;
import com.stylehub.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/admin") @RequiredArgsConstructor
public class AdminController {
    private final ProductService productService;
    private final OrderService orderService;

    @GetMapping("/products") public ResponseEntity<List<Product>> products() { return ResponseEntity.ok(productService.getAllAdmin()); }
    @PostMapping("/products") public ResponseEntity<Product> create(@Valid @RequestBody ProductRequest r) { return ResponseEntity.ok(productService.create(r)); }
    @PutMapping("/products/{id}") public ResponseEntity<Product> update(@PathVariable Long id, @Valid @RequestBody ProductRequest r) { return ResponseEntity.ok(productService.update(id,r)); }
    @DeleteMapping("/products/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) { productService.delete(id); return ResponseEntity.noContent().build(); }

    @GetMapping("/orders") public ResponseEntity<List<Order>> orders() { return ResponseEntity.ok(orderService.getAllOrders()); }
    @PutMapping("/orders/{id}/status") public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestBody UpdateOrderStatusRequest r) { return ResponseEntity.ok(orderService.updateStatus(id,r)); }
}
