package org.example.yogabusinessmanagementweb;

import org.example.yogabusinessmanagementweb.common.entities.MembershipType;
import org.example.yogabusinessmanagementweb.repositories.MembershipTypeRepository;
import org.example.yogabusinessmanagementweb.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.math.BigDecimal;

@SpringBootApplication
@EnableScheduling
public class YogaBusinessManagementWebApplication {

    public static void main(String[] args) {
        SpringApplication.run(YogaBusinessManagementWebApplication.class, args);
    }
    @Bean

    CommandLineRunner runner(UserService userService, MembershipTypeRepository membershipTypeRepository) {
        return args -> {
            createMembershipTypeIfNotExists("Đồng", "Thành viên cơ bản", new BigDecimal("0"), 30, "https://emojigraph.org/media/apple/3rd-place-medal_1f949.png",membershipTypeRepository);
            createMembershipTypeIfNotExists("Bạc", "Thành viên nâng cao", new BigDecimal("1000000"), 30, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX4agEYx79zhV_jLZhJub6vNJdy1Utzl4bxTRzxsnvUZYDJExuisxiMTi--OKvHTTsvtk&usqp=CAU",membershipTypeRepository);
            createMembershipTypeIfNotExists("Vàng", "Thành viên cao cấp", new BigDecimal("199000"), 30, "https://img.pikbest.com/png-images/qiantu/vector-illustration-of-hand-drawn-gold-medal_2717438.png!sw800",membershipTypeRepository);
        };
    }
    private void createMembershipTypeIfNotExists(String name, String desc, BigDecimal price, int duration, String url,MembershipTypeRepository repo) {
        if (repo.findByName(name).isEmpty()) {
            MembershipType type = MembershipType.builder()
                    .name(name)
                    .description(desc)
                    .price(price)
                    .durationInDays(duration)
                    .url(url)
                    .build();
            repo.save(type);
        }
    }
}
