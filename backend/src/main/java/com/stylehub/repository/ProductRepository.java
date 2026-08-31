package com.stylehub.repository;
import com.stylehub.model.Gender;
import com.stylehub.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ProductRepository extends JpaRepository<Product,Long> {
    List<Product> findByAvailableTrue();
    List<Product> findByGenderAndAvailableTrue(Gender gender);
    List<Product> findByCategoryIgnoreCaseAndAvailableTrue(String category);
    List<Product> findByFeaturedTrueAndAvailableTrue();
}
