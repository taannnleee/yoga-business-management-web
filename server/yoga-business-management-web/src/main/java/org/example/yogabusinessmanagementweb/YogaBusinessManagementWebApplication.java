package org.example.yogabusinessmanagementweb;

import org.example.yogabusinessmanagementweb.workoutwithAI.service.HealthyService;
import org.example.yogabusinessmanagementweb.workoutwithAI.service.PostService;
import org.example.yogabusinessmanagementweb.workoutwithAI.service.UserService;
import org.example.yogabusinessmanagementweb.workoutwithAI.service.YogaService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class YogaBusinessManagementWebApplication {

    public static void main(String[] args) {
        SpringApplication.run(YogaBusinessManagementWebApplication.class, args);
    }
    @Bean

    CommandLineRunner runner(UserService userService, YogaService yogaService, PostService postService,
                             HealthyService healthyService) {
        return args -> {

            healthyService.createWeightPlanData();
            userService.createData();
            yogaService.createData();
            postService.createPost();
        };
    }
}
