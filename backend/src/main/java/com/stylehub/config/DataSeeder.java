package com.stylehub.config;
import com.stylehub.model.*;
import com.stylehub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component @RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;
    @Value("${app.admin.email}") private String adminEmail;
    @Value("${app.admin.password}") private String adminPassword;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedProducts();
    }

    private void seedAdmin() {
        if (!userRepository.existsByEmail(adminEmail)) {
            User a = new User();
            a.setName("StyleHub Admin"); a.setEmail(adminEmail);
            a.setPassword(passwordEncoder.encode(adminPassword)); a.setRole(Role.ROLE_ADMIN);
            userRepository.save(a);
            System.out.println(">>> Admin seeded: " + adminEmail);
        }
    }

    private void seedProducts() {
        if (productRepository.count() > 0) return;

        // WOMEN's collection
        productRepository.save(product(
            "Floral Wrap Dress",
            "A stunning floral wrap dress with a flattering V-neckline. Perfect for brunches, dates, or summer outings. Made from breathable chiffon fabric that drapes beautifully on all body types.",
            new BigDecimal("1899"), new BigDecimal("2999"), "Dress", Gender.WOMEN,
            "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&q=80",
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80",
            "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
            "XS,S,M,L,XL", "Floral Blue", true
        ));

        productRepository.save(product(
            "Classic White Button Shirt",
            "A timeless white button-down shirt crafted from 100% Egyptian cotton. Features a relaxed fit perfect for tucking in or wearing loose. A wardrobe essential that pairs with everything.",
            new BigDecimal("1299"), new BigDecimal("1999"), "Shirt", Gender.WOMEN,
            "https://images.unsplash.com/photo-1594938298603-c8148c4bfbf7?w=600&q=80",
            "https://images.unsplash.com/photo-1604575408399-6e6e9f46a90c?w=600&q=80",
            "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&q=80",
            "XS,S,M,L,XL,XXL", "White", true
        ));

        productRepository.save(product(
            "High-Waist Slim Jeans",
            "Premium denim high-waist jeans with a flattering slim cut. Features stretch fabric for all-day comfort. The ankle-length cut and classic blue wash make these incredibly versatile.",
            new BigDecimal("2199"), new BigDecimal("3499"), "Jeans", Gender.WOMEN,
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80",
            "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&q=80",
            "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&q=80",
            "26,28,30,32,34", "Indigo Blue", true
        ));

        productRepository.save(product(
            "Elegant Evening Gown",
            "A floor-length evening gown with a sleek silhouette and subtle shimmer. The fitted bodice and flowy skirt create a perfect balance of sophistication and comfort for special occasions.",
            new BigDecimal("4999"), new BigDecimal("7999"), "Dress", Gender.WOMEN,
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
            "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
            "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&q=80",
            "XS,S,M,L,XL", "Midnight Black", true
        ));

        productRepository.save(product(
            "Cozy Oversized Hoodie",
            "Ultra-soft fleece oversized hoodie perfect for lounging or casual outings. Features a kangaroo pocket, adjustable drawstring, and ribbed cuffs. Available in a range of earthy tones.",
            new BigDecimal("1599"), new BigDecimal("2499"), "Hoodie", Gender.WOMEN,
            "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
            "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
            "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&q=80",
            "S,M,L,XL,XXL", "Beige", true
        ));

        // MEN's collection
        productRepository.save(product(
            "Slim Fit Formal Shirt",
            "A premium slim-fit formal shirt made from wrinkle-resistant cotton blend. Features a spread collar, French front placket, and adjustable cuffs. Ideal for office wear or formal events.",
            new BigDecimal("1499"), new BigDecimal("2199"), "Shirt", Gender.MEN,
            "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&q=80",
            "https://images.unsplash.com/photo-1614975059251-992f11792b9f?w=600&q=80",
            "https://images.unsplash.com/photo-1603252109360-909baaf261ae?w=600&q=80",
            "S,M,L,XL,XXL", "Navy Blue", true
        ));

        productRepository.save(product(
            "Classic Chino Pants",
            "Straight-fit chino pants with a clean, polished look. Made from soft cotton-twill fabric with a comfortable stretch. Pairs seamlessly with shirts, polos, and casual tees alike.",
            new BigDecimal("1799"), new BigDecimal("2799"), "Pants", Gender.MEN,
            "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
            "https://images.unsplash.com/photo-1542272201-b1ca555f8505?w=600&q=80",
            "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
            "28,30,32,34,36,38", "Khaki", true
        ));

        productRepository.save(product(
            "Graphic Print T-Shirt",
            "A premium-quality graphic tee made from 100% combed cotton. Features a bold artistic print with a relaxed crew-neck fit. Perfect for casual weekend wear and streetwear styling.",
            new BigDecimal("799"), new BigDecimal("1299"), "T-Shirt", Gender.MEN,
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
            "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=600&q=80",
            "S,M,L,XL,XXL", "White", true
        ));

        productRepository.save(product(
            "Leather Biker Jacket",
            "A genuine leather biker jacket with asymmetric zip closure, snap-button lapels, and multiple pockets. Lined interior for warmth. A statement piece that elevates any outfit instantly.",
            new BigDecimal("7999"), new BigDecimal("12999"), "Jacket", Gender.MEN,
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
            "https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=600&q=80",
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
            "S,M,L,XL,XXL", "Black", true
        ));

        productRepository.save(product(
            "Premium Denim Jacket",
            "A classic denim jacket with a slightly oversized fit — works for both men and women. Features chest flap pockets, button-front closure, and washed fabric for a vintage look.",
            new BigDecimal("2499"), new BigDecimal("3999"), "Jacket", Gender.UNISEX,
            "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=600&q=80",
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
            "XS,S,M,L,XL,XXL", "Light Blue", true
        ));

        System.out.println(">>> 10 products seeded");
    }

    private Product product(String name, String desc, BigDecimal price, BigDecimal origPrice,
                             String cat, Gender gender, String img1, String img2, String img3,
                             String sizes, String color, boolean featured) {
        Product p = new Product();
        p.setName(name); p.setDescription(desc); p.setPrice(price); p.setOriginalPrice(origPrice);
        p.setCategory(cat); p.setGender(gender); p.setImageUrl1(img1); p.setImageUrl2(img2);
        p.setImageUrl3(img3); p.setSizes(sizes); p.setColor(color);
        p.setAvailable(true); p.setStock(50); p.setFeatured(featured);
        return p;
    }
}
