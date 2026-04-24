package com.example.demo.config;

import com.example.demo.entity.Category;
import com.example.demo.entity.Product;
import com.example.demo.entity.User;
import com.example.demo.Repository.CategoryRepository;
import com.example.demo.Repository.ProductRepository;
import com.example.demo.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            initializeCategories();
        }
        User demoSeller = userRepository.findByEmail("demo@rego.vn").orElseGet(this::createDemoUser);
        if (productRepository.count() == 0) {
            seedSampleProducts(demoSeller);
        }
    }

    private User createDemoUser() {
        User u = new User();
        u.setEmail("demo@rego.vn");
        u.setFullName("Shop mẫu ReGo");
        u.setPhoneNumber("0900000000");
        u.setPassword(passwordEncoder.encode("demo123"));
        u.setRole("USER");
        User saved = userRepository.save(u);
        System.out.println("✅ Đã tạo user mẫu: demo@rego.vn / demo123");
        return saved;
    }

    private void seedSampleProducts(User seller) {
        record Sample(String categoryName, String title, String description, double price) {}

        List<Sample> samples = List.of(
                new Sample("Điện tử", "iPhone 13 128GB", "Máy đẹp 95%, pin 89%, đủ hộp.", 12_500_000),
                new Sample("Điện tử", "Samsung Galaxy A54", "Màn hình AMOLED, RAM 8GB.", 7_200_000),
                new Sample("Điện tử", "Tai nghe Sony WH-1000XM4", "Chống ồn chủ động, ít dùng.", 4_800_000),
                new Sample("Thời trang", "Áo khoác gió Uniqlo size M", "Màu navy, giặt máy OK.", 450_000),
                new Sample("Thời trang", "Giày Nike Air size 42", "Đế còn tốt, hơi bẩn nhẹ.", 1_800_000),
                new Sample("Thời trang", "Túi tote canvas", "Handmade, dùng vài lần.", 120_000),
                new Sample("Nội thất", "Bàn làm việc gỗ 1m2", "Chân sắt, mặt gỗ MDF.", 1_200_000),
                new Sample("Nội thất", "Ghế công thái học cũ", "Điều chỉnh được độ cao.", 900_000),
                new Sample("Nội thất", "Đèn bàn LED", "3 mức sáng, USB còn dùng.", 250_000),
                new Sample("Sách & Văn phòng phẩm", "Bộ sách Clean Code", "Tiếng Anh, gáy hơi vàng.", 350_000),
                new Sample("Sách & Văn phòng phẩm", "Máy tính Casio FX-570VN", "Pin mới thay.", 180_000),
                new Sample("Sách & Văn phòng phẩm", "Sổ tay B5 200 trang", "Ruột còn trắng ~80%.", 40_000),
                new Sample("Thể thao & Giải trí", "Vợt cầu lông Yonex", "Căng dây 24lb, có túi.", 650_000),
                new Sample("Thể thao & Giải trí", "Xe đạp tập tại nhà", "Nam châm, màn hình hiển thị.", 2_100_000),
                new Sample("Thể thao & Giải trí", "Boardgame Catan", "Đủ quân, thiếu 1 thẻ (thay thế).", 550_000),
                new Sample("Xe cộ", "Xe máy Honda Vision 2019", "BSX TP.HCM, đi 25k km.", 28_000_000),
                new Sample("Xe cộ", "Mũ bảo hiểm fullface", "Size L, kính hơi xước.", 800_000),
                new Sample("Xe cộ", "Xe đạp địa hình", "Khung nhôm, 21 số.", 3_500_000),
                new Sample("Mẹ & Bé", "Xe đẩy em bé Aprica", "Gấp gọn, nệm sạch.", 2_200_000),
                new Sample("Mẹ & Bé", "Ghế ăn dặm IKEA", "Dây đai đủ, có khay.", 450_000),
                new Sample("Mẹ & Bé", "Bộ body sơ sinh (5 cái)", "Cotton, size 0–3 tháng.", 150_000),
                new Sample("Làm đẹp & Sức khỏe", "Máy rửa mặt Foreo mini", "Sạc được, dùng 1 năm.", 1_100_000),
                new Sample("Làm đẹp & Sức khỏe", "Nước hoa 50ml còn 70%", "Hương floral nhẹ.", 600_000),
                new Sample("Làm đẹp & Sức khỏe", "Cân điện tử Xiaomi", "Bluetooth, pin OK.", 320_000)
        );

        for (Sample s : samples) {
            categoryRepository.findByName(s.categoryName()).ifPresent(cat -> {
                Product p = new Product();
                p.setName(s.title());
                p.setDescription(s.description());
                p.setPrice(s.price());
                p.setUser(seller);
                p.setCategory(cat);
                productRepository.save(p);
            });
        }
        System.out.println("✅ Đã seed tối đa " + samples.size() + " sản phẩm mẫu. Tổng sản phẩm trong DB: "
                + productRepository.count());
    }

    private void initializeCategories() {
        Category dienTu = createCategory("Điện tử", "Các sản phẩm điện tử, công nghệ", "📱", null);
        Category thoiTrang = createCategory("Thời trang", "Quần áo, giày dép, phụ kiện", "👕", null);
        Category noiThat = createCategory("Nội thất", "Đồ nội thất, trang trí nhà cửa", "🛋️", null);
        Category sach = createCategory("Sách & Văn phòng phẩm", "Sách, vở, dụng cụ học tập", "📚", null);
        Category theThao = createCategory("Thể thao & Giải trí", "Dụng cụ thể thao, đồ chơi", "⚽", null);
        Category xeCo = createCategory("Xe cộ", "Xe máy, xe đạp, phụ tùng", "🚗", null);
        Category meBe = createCategory("Mẹ & Bé", "Đồ dùng cho mẹ và bé", "👶", null);
        Category lamDep = createCategory("Làm đẹp & Sức khỏe", "Mỹ phẩm, chăm sóc sức khỏe", "💄", null);

        createCategory("Điện thoại", "Điện thoại di động các loại", "📱", dienTu);
        createCategory("Laptop", "Máy tính xách tay", "💻", dienTu);
        createCategory("Máy tính bảng", "Tablet các loại", "📱", dienTu);
        createCategory("Tai nghe", "Tai nghe, headphone", "🎧", dienTu);
        createCategory("Đồng hồ thông minh", "Smartwatch, fitness tracker", "⌚", dienTu);

        createCategory("Quần áo nam", "Thời trang nam", "👔", thoiTrang);
        createCategory("Quần áo nữ", "Thời trang nữ", "👗", thoiTrang);
        createCategory("Giày dép nam", "Giày, dép nam", "👞", thoiTrang);
        createCategory("Giày dép nữ", "Giày, dép nữ", "👠", thoiTrang);
        createCategory("Túi xách", "Túi xách, balo", "👜", thoiTrang);

        createCategory("Bàn ghế", "Bàn, ghế các loại", "🪑", noiThat);
        createCategory("Giường & Tủ", "Giường ngủ, tủ quần áo", "🛏️", noiThat);
        createCategory("Đèn trang trí", "Đèn chiếu sáng, trang trí", "💡", noiThat);
        createCategory("Đồ trang trí", "Tranh, cây cảnh, đồ decor", "🖼️", noiThat);

        System.out.println("✅ Đã khởi tạo dữ liệu categories thành công!");
    }

    private Category createCategory(String name, String description, String icon, Category parent) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setIcon(icon);
        category.setParent(parent);
        return categoryRepository.save(category);
    }
}
