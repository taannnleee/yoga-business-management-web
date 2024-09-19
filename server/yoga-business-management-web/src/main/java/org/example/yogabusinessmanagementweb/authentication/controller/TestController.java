package org.example.yogabusinessmanagementweb.authentication.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.authentication.dto.CustomerDTO;
import org.example.yogabusinessmanagementweb.authentication.dto.response.ResponseData;
import org.example.yogabusinessmanagementweb.authentication.dto.response.ResponseSuccess;
import org.example.yogabusinessmanagementweb.authentication.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Validated
@Slf4j
@Tag(name = "Test Controller")
public class TestController {

    private final UserService userService;

    @PostMapping("/test")
    public ResponseEntity<?> TESTcheckRegister(@Valid @RequestBody CustomerDTO customerDTO,
                                           @RequestParam("city") String city,
                                           @RequestParam("district") String district,
                                           @RequestParam("street") String street) {
        try {
            // Trả về một đối tượng JSON chứa kết quả của quá trình đăng ký
            log.info("success");
            return ResponseEntity.ok().body("Registration successful!");
        } catch (Exception e) {
            // Xử lý lỗi và trả về một đối tượng JSON chứa thông báo lỗi
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed: " + e.getMessage());
        }
    }

    @PutMapping("/test/{id}")
    public ResponseEntity<?> TESTupdate(@PathVariable int id, @RequestParam(required = false) boolean status){
        try{
            return ResponseEntity.status(HttpStatus.OK).body("Update Success");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Update Error");
        }
    }

    @DeleteMapping("test/{id}")
    public ResponseSuccess TESTdelete(@PathVariable int id){
        return new ResponseSuccess(HttpStatus.CREATED, "Success", 1);
    }


    @Operation(summary = "Add user", description = "API create new user")
    @GetMapping("test")
    public ResponseData<?> TESTget(){
        return new ResponseData<>(HttpStatus.CREATED.value(), "Success", 1);
    }

    @PostMapping("/save")
    public void TESTsaveCustomer(){
//        Customer customer   = new Customer();
//        customerRepository.save(customer);
    }

    @PostMapping("/getAll")
    public ResponseData<?> TESTgetAll(){
        log.info("temp");
//        CustomerDTO customerDTO = CustomerDTO.builder()
//                .id(1L)
//                .email("letan")
//                .build();
        return new ResponseData<>(HttpStatus.CREATED.value(), "Success", "a");
    }


    //    @GetMapping("index")
//    public ResponseData<Customer> index(){
//        Customer customer =  customerService.getCustomerByEmail("leetaan1902@gmail.com");
//        return new ResponseData<>(HttpStatus.CREATED.value(), "Success", customer);
//    }



}