package com.stylehub.service;
import com.stylehub.dto.ProductRequest;
import com.stylehub.exception.ResourceNotFoundException;
import com.stylehub.model.*;
import com.stylehub.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service @RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    public List<Product> getAll() { return productRepository.findByAvailableTrue(); }
    public List<Product> getFeatured() { return productRepository.findByFeaturedTrueAndAvailableTrue(); }
    public List<Product> getByGender(Gender gender) { return productRepository.findByGenderAndAvailableTrue(gender); }
    public List<Product> getByCategory(String cat) { return productRepository.findByCategoryIgnoreCaseAndAvailableTrue(cat); }
    public List<Product> getAllAdmin() { return productRepository.findAll(); }
    public Product getById(Long id) { return productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found: "+id)); }
    public Product create(ProductRequest r) { Product p=new Product(); map(r,p); return productRepository.save(p); }
    public Product update(Long id, ProductRequest r) { Product p=getById(id); map(r,p); return productRepository.save(p); }
    public void delete(Long id) { productRepository.delete(getById(id)); }

    private void map(ProductRequest r, Product p) {
        p.setName(r.getName()); p.setDescription(r.getDescription()); p.setPrice(r.getPrice());
        p.setOriginalPrice(r.getOriginalPrice()); p.setCategory(r.getCategory()); p.setGender(r.getGender());
        p.setImageUrl1(r.getImageUrl1()); p.setImageUrl2(r.getImageUrl2()); p.setImageUrl3(r.getImageUrl3());
        p.setSizes(r.getSizes()); p.setColor(r.getColor());
        p.setAvailable(r.getAvailable()!=null?r.getAvailable():true);
        p.setStock(r.getStock()!=null?r.getStock():100);
        p.setFeatured(r.getFeatured()!=null?r.getFeatured():false);
    }
}
