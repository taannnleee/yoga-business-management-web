package org.example.yogabusinessmanagementweb.authentication.controller.admin;


import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.authentication.dto.request.AddProductRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.response.AddYogaWorkoutRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.response.ResponseData;
import org.example.yogabusinessmanagementweb.authentication.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.authentication.service.Impl.AuthencationService;
import org.example.yogabusinessmanagementweb.authentication.service.ProductService;
import org.example.yogabusinessmanagementweb.authentication.service.UserService;
import org.example.yogabusinessmanagementweb.common.entities.YogaWorkout;
import org.example.yogabusinessmanagementweb.sendEmail.service.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api")
@Slf4j
public class AdminYogaWorkoutController {
    UserService userService;
    UserRepository userRepository;
    EmailService emailService;
    AuthencationService authencationService;
    ProductService productService;

    @PostMapping("/add-yoga-workout")
    public ResponseData<?> creatProduct(@RequestBody AddYogaWorkoutRequest addYogaWorkoutRequest) {
        try{
//            productService.addYogaWorkout(addYogaWorkoutRequest);
            return new ResponseData<>(HttpStatus.OK.value(), "create product  successfully",true);
        }catch (Exception e){
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),e.getMessage(),false);
        }
    }

}
