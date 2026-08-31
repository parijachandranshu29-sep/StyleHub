package com.stylehub.controller;
import com.stylehub.model.*;
import com.stylehub.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/products") @RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    @GetMapping public ResponseEntity<List<Product>> getAll() { return ResponseEntity.ok(productService.getAll()); }
    @GetMapping("/featured") public ResponseEntity<List<Product>> getFeatured() { return ResponseEntity.ok(productService.getFeatured()); }
    @GetMapping("/gender/{gender}") public ResponseEntity<List<Product>> getByGender(@PathVariable Gender gender) { return ResponseEntity.ok(productService.getByGender(gender)); }
    @GetMapping("/category/{category}") public ResponseEntity<List<Product>> getByCategory(@PathVariable String category) { return ResponseEntity.ok(productService.getByCategory(category)); }
    @GetMapping("/{id}") public ResponseEntity<Product> getOne(@PathVariable Long id) { return ResponseEntity.ok(productService.getById(id)); }
}
