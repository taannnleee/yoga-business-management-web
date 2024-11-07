package org.example.yogabusinessmanagementweb.controller.user.profile;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.dto.CloudinaryResponse;
import org.example.yogabusinessmanagementweb.dto.request.user.UpdateProfileRequest;
import org.example.yogabusinessmanagementweb.dto.response.address.AddressResponse;
import org.example.yogabusinessmanagementweb.dto.response.checkout.UserAddressDefaultResponse;
import org.example.yogabusinessmanagementweb.dto.response.user.ProfileResponse;
import org.example.yogabusinessmanagementweb.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.service.CloudinaryService;
import org.example.yogabusinessmanagementweb.service.Impl.AuthencationService;
import org.example.yogabusinessmanagementweb.service.UserService;
import org.example.yogabusinessmanagementweb.service.EmailService;
import org.example.yogabusinessmanagementweb.utils.FileUploadUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/user")
@Slf4j
public class UserController {
    CloudinaryService cloudinaryService;
    UserService userService;
    UserRepository userRepository;
    EmailService emailService;
    AuthencationService authencationService;

    // get address với trạng thái default
    @GetMapping("/get-user-address-default")
    public ApiResponse<?> getUserAddressDefault(HttpServletRequest request) {
        UserAddressDefaultResponse addressResponse =  userService.getUserAddressDefault(request);
        return new ApiResponse<>(HttpStatus.OK.value(), "Get user address default success",addressResponse);
    }

    @GetMapping("/get-profile")
    public ApiResponse<?> getProfile(HttpServletRequest request){
        ProfileResponse profileResponse =  userService.getProfile(request);
        return new ApiResponse<>(HttpStatus.OK.value(), "getProfile successfully",profileResponse);
    }
    @PostMapping("/update-profile")
    public ApiResponse<?> updateProfile(@Valid @RequestBody UpdateProfileRequest updateProfileRequest, HttpServletRequest request){
        userService.updateProfile(updateProfileRequest, request);
        return new ApiResponse<>(HttpStatus.OK.value(), "update profile successfully");

    }

    @PostMapping("/image/upload")
    public ApiResponse<?> uploadImage(@RequestParam(name = "file", required = true)
                                                    MultipartFile file) {
        FileUploadUtil.assertAllowed(file, FileUploadUtil.IMAGE_PATTERN);
        final String fileName = FileUploadUtil.getFileName(file.getOriginalFilename());
        final CloudinaryResponse response = cloudinaryService.uploadFile(file, fileName);
        return new ApiResponse<>(HttpStatus.OK.value(), "Tải ảnh lên Coudinary thành công.",response);
    }


    @DeleteMapping("/image/delete")
    public ApiResponse<?> deleteImage(@RequestParam("url") String url) throws IOException {
        try {
            cloudinaryService.deleteByUrl(url);
            return new ApiResponse<>(HttpStatus.OK.value(), "Xóa ảnh thành công.",null);
//        } catch (CustomException e) {
//            return ResponseEntity.status(e.getStatusCode()).body(new BaseResponse(e.getMessage(), e.getStatusCode(), null));
        } catch (IOException e) {
            return new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống. Vui lòng thử lại.",null);

        }
    }

}
