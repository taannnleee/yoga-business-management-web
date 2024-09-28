package org.example.yogabusinessmanagementweb.authentication.service.Impl;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.example.yogabusinessmanagementweb.authentication.dto.request.LoginRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.request.RegistrationRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.request.UpdateProfileRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.response.ProfileResponse;
import org.example.yogabusinessmanagementweb.authentication.dto.response.RegistrationResponse;
import org.example.yogabusinessmanagementweb.authentication.exception.AppException;
import org.example.yogabusinessmanagementweb.authentication.exception.ErrorCode;
import org.example.yogabusinessmanagementweb.authentication.exception.InvalidPasswordException;
import org.example.yogabusinessmanagementweb.authentication.exception.UserNotFoundException;
import org.example.yogabusinessmanagementweb.authentication.repositories.UserRepository;
import org.example.yogabusinessmanagementweb.authentication.service.AddressService;
import org.example.yogabusinessmanagementweb.authentication.service.JwtService;
import org.example.yogabusinessmanagementweb.authentication.service.UserService;
import org.example.yogabusinessmanagementweb.common.entities.Address;
import org.example.yogabusinessmanagementweb.common.entities.User;
import org.example.yogabusinessmanagementweb.common.mapper.Mappers;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.ErrorResponseException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.example.yogabusinessmanagementweb.common.Enum.ETokenType.ACCESSTOKEN;
import static org.example.yogabusinessmanagementweb.common.Enum.ETokenType.REFRESHTOKEN;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Autowired
    @Lazy
    private AuthencationService authencationService;

    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressService addressService;

    @Autowired
    private JwtService jwtService;;

    @Override
    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    @Override
    public User findUserById(String id) {
        return userRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    public UserDetailsService userDetailsService() {
        return username ->
                userRepository.findByUsername(username)
                        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    public RegistrationResponse registerUser(RegistrationRequest registrationRequest) {
        ArrayList arrayList = new ArrayList();
        Address address = new Address();
        arrayList.add(address);

        String encodedPassword = passwordEncoder.encode(registrationRequest.getPassword());
        User user = Mappers.convertToEntity(registrationRequest, User.class);
        user.setPassword(encodedPassword);
        user.setStatus(false);

        address.setUser(user);
        user.setAddresses(arrayList);
        userRepository.save(user);
        authencationService.sendOTP(registrationRequest.getEmail());

        RegistrationResponse registrationResponse = Mappers.convertToDto(user, RegistrationResponse.class);
        return registrationResponse;
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    public long saveUser(User user) {
        userRepository.save(user);
        return user.getId();
    }

    @Override
    public ProfileResponse getProfile(HttpServletRequest request) {
        String access_token = request.getHeader("x-token");

        if(StringUtils.isBlank(access_token)){
            throw new AppException(ErrorCode.TOKEN_EMPTY);
        }

        final String userName = jwtService.extractUsername(access_token, ACCESSTOKEN);

        User user =  userRepository.findByUsername(userName).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));;

        //validate xem token có hợp lệ không
        if(!jwtService.isValid(access_token, ACCESSTOKEN,user)){
            throw new AppException(ErrorCode.TOKEN_INVALID);
        }

        Address address =  addressService.findAddressByUser(user);

        ProfileResponse profileResponse = Mappers.convertToDto(user, ProfileResponse.class);
        profileResponse.setCity(address.getCity());
        profileResponse.setStreet(address.getStreet());
        profileResponse.setState(address.getDistrict());
        return profileResponse;
    }

    @Override
    public void updateProfile(UpdateProfileRequest updateProfileRequest, HttpServletRequest request) {
        String access_token = request.getHeader("x-token");

        if(StringUtils.isBlank(access_token)){
            throw new InvalidDataAccessApiUsageException("Token is empty");
        }

        final String userName = jwtService.extractUsername(access_token, ACCESSTOKEN);

        User user =  userRepository.findByUsername(userName).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        //validate xem token có hợp lệ không
        if(!jwtService.isValid(access_token, ACCESSTOKEN,user)){
            throw new AppException(ErrorCode.TOKEN_INVALID);
        }

        // Cập nhật thông tin người dùng từ request
        user.setFullname(updateProfileRequest.getFullname());
        user.setUsername(updateProfileRequest.getUsername());
        user.setEmail(updateProfileRequest.getEmail());
        user.setPhone(updateProfileRequest.getPhone());

        // Cập nhật địa chỉ
        Address address = addressService.findAddressByUser(user);
        address.setCity(updateProfileRequest.getCity());
        address.setStreet(updateProfileRequest.getStreet());
        address.setDistrict(updateProfileRequest.getState());

        // Lưu lại thông tin đã được cập nhật
        userRepository.save(user);
    }


    @Override
    public User findByPhone(String phoneNumber) {
        return userRepository.findByPhone(phoneNumber).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    public User findByUserName(String username) {
        return userRepository.findByUsername(username).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    public boolean checkUserNotExist(RegistrationRequest registrationRequest) {
        // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp không
        if (!registrationRequest.getPassword().equals(registrationRequest.getConfirmpassword())) {
            throw new AppException(ErrorCode.PASS_WORD_NOT_MATCHED);
        }

        // Kiểm tra xem username đã tồn tại chưa
        if (userRepository.findByUsername(registrationRequest.getUsername()).isPresent()) {
            throw new AppException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }

        // Kiểm tra xem phone đã tồn tại chưa
        if (userRepository.findByPhone(registrationRequest.getPhone()).isPresent()) {
            throw new AppException(ErrorCode.PHONE_ALREADY_EXISTS);
        }

        // Kiểm tra xem email đã tồn tại chưa
        if (userRepository.findByEmail(registrationRequest.getEmail()).isPresent()) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        return true;
    }

}
